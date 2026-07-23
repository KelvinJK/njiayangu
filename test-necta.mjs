import * as cheerio from "cheerio";

async function testScraping() {
  try {
    const url = "https://onlinesys.necta.go.tz/results/2023/csee/results/s0101.htm";
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const parts = ["S0101", "0001"];
    const searchStr = `${parts[0].toUpperCase()}/${parts[1]}`;
    let foundStudent = null;

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
          return false;
        }
      }
    });

    console.log("Result:", foundStudent);
  } catch (err) {
    console.error(err);
  }
}

testScraping();
