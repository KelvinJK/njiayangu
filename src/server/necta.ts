import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import * as cheerio from "cheerio";

const fetchNectaResultSchema = z.object({
  indexNumber: z.string(),
  examType: z.enum(["CSEE", "ACSEE"]),
  year: z.string(),
});

export const fetchNectaResult = createServerFn({ method: "GET" })
  .validator(fetchNectaResultSchema)
  .handler(async ({ data }) => {
    const { indexNumber, examType, year } = data;

    // Validate index number format e.g. S0101/0001 or P0101/0001
    const parts = indexNumber.toUpperCase().split("/");
    if (parts.length < 2) {
      throw new Error("Invalid Index Number format. Use format like S0101/0001");
    }

    const centerNumber = parts[0].toLowerCase();
    const url = `https://onlinesys.necta.go.tz/results/${year}/${examType.toLowerCase()}/results/${centerNumber}.htm`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Could not fetch results from NECTA for ${year}. The results might not be available or the center number is incorrect.`
        );
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      let foundStudent = null;

      // NECTA results are usually in an HTML table or sometimes <pre> tags.
      // We will look for the exact index number in the text.
      const searchStr = `${parts[0].toUpperCase()}/${parts[1]}`;

      // Check tables (standard format for recent years)
      $("tr").each((i, el) => {
        const tds = $(el).find("td");
        if (tds.length >= 5) {
          const indexText = $(tds[0]).text().trim();
          if (indexText === searchStr) {
            foundStudent = {
              index: indexText,
              gender: $(tds[1]).text().trim(),
              points: $(tds[2]).text().trim(),
              division: $(tds[3]).text().trim(),
              subjects: $(tds[4]).text().trim(),
            };
            return false; // Break the each loop
          }
        }
      });

      // Fallback for older/different formats using <pre> tags where lines are text
      if (!foundStudent) {
        const preText = $("pre").text();
        if (preText) {
          const lines = preText.split("\n");
          for (const line of lines) {
            if (line.includes(searchStr)) {
              // Usually formatted with spaces: S0101/0001  M  14  I  CIV - 'C' ...
              // We'll extract the subjects part which usually comes after the Division (I, II, III, IV, 0)
              const match = line.match(new RegExp(`${searchStr}\\s+(\\w)\\s+(\\d+)\\s+([IV0]+)\\s+(.*)`));
              if (match) {
                foundStudent = {
                  index: searchStr,
                  gender: match[1],
                  points: match[2],
                  division: match[3],
                  subjects: match[4].trim(),
                };
                break;
              }
            }
          }
        }
      }

      if (!foundStudent) {
        throw new Error(`Results for ${searchStr} not found in center ${centerNumber.toUpperCase()}.`);
      }

      return { success: true, result: foundStudent };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to fetch from NECTA" };
    }
  });
