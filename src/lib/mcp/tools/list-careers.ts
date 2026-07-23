import { instrument } from "../instrument";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CAREERS } from "@/data/careers";

export default defineTool({
  name: "list_careers",
  title: "List career pathways",
  description:
    "List Tanzanian career pathways in NjiaYangu's career explorer, with regulator, related programmes, and public data.",
  inputSchema: {
    category: z.string().optional().describe("Optional career category filter."),
    query: z.string().optional().describe("Optional keyword filter on career title or description."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results. Default 20."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: instrument("list_careers", ({ category, query, limit }) => {
    const q = query?.trim().toLowerCase();
    const rows = CAREERS.filter((c) => (category ? c.category.toLowerCase() === category.toLowerCase() : true))
      .filter((c) => {
        if (!q) return true;
        return (
          c.title.en.toLowerCase().includes(q) ||
          c.title.sw.toLowerCase().includes(q) ||
          c.description.en.toLowerCase().includes(q)
        );
      })
      .slice(0, limit ?? 20)
      .map((c) => ({
        id: c.id,
        title: c.title.en,
        category: c.category,
        description: c.description.en,
        registration: c.registration?.en,
        relatedCareers: c.relatedCareers,
        source: c.source,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, careers: rows },
    };
  }),
});
