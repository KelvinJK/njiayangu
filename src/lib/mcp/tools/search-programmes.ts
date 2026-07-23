import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PROGRAMMES } from "@/data/programmes";
import { INSTITUTIONS } from "@/data/institutions";

export default defineTool({
  name: "search_programmes",
  title: "Search programmes",
  description:
    "Search NjiaYangu's catalogue of Tanzanian undergraduate programmes by keyword, category, or institution. Returns programme name, institution, location, duration, category, HESLB eligibility, application deadline, and the official source URL.",
  inputSchema: {
    query: z
      .string()
      .optional()
      .describe("Free-text keyword matched against programme name, overview, category, and institution name."),
    category: z
      .string()
      .optional()
      .describe("Category to filter by, e.g. Health, Engineering, Business, Education, Law, ICT."),
    institutionId: z
      .string()
      .optional()
      .describe("Institution id (e.g. muhas, udsm, sua, mzumbe) to restrict results to one institution."),
    limit: z.number().int().min(1).max(50).optional().describe("Maximum results to return. Default 15."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category, institutionId, limit }) => {
    const q = query?.trim().toLowerCase();
    const results = PROGRAMMES.filter((p) => p.status === "active")
      .filter((p) => (category ? p.category.toLowerCase() === category.toLowerCase() : true))
      .filter((p) => (institutionId ? p.institutionId === institutionId : true))
      .filter((p) => {
        if (!q) return true;
        const inst = INSTITUTIONS.find((i) => i.id === p.institutionId);
        return (
          p.name.en.toLowerCase().includes(q) ||
          p.name.sw.toLowerCase().includes(q) ||
          p.overview.en.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (inst?.name.toLowerCase().includes(q) ?? false)
        );
      })
      .slice(0, limit ?? 15)
      .map((p) => {
        const inst = INSTITUTIONS.find((i) => i.id === p.institutionId);
        const campus = inst?.campuses.find((c) => c.id === p.campusId);
        return {
          slug: p.slug,
          name: p.name.en,
          institution: inst?.name ?? p.institutionId,
          location: campus ? `${campus.name}, ${campus.region}` : "",
          durationYears: p.durationYears,
          category: p.category,
          heslbEligible: p.heslbEligible,
          applicationDeadline: p.applicationDeadline,
          minPoints: p.rule.minPoints,
          sourceUrl: p.source.url,
          lastVerified: p.lastVerified,
        };
      });

    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      structuredContent: { count: results.length, results },
    };
  },
});
