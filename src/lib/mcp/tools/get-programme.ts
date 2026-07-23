import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PROGRAMMES } from "@/data/programmes";
import { INSTITUTIONS } from "@/data/institutions";

export default defineTool({
  name: "get_programme",
  title: "Get programme details",
  description:
    "Return full details for one programme by slug: overview, admission rule (min points, required subjects, O-level requirements), duration, tuition, modules, documents, application URL, and the official source URL with the last-verified date.",
  inputSchema: {
    slug: z.string().describe("Programme slug, e.g. 'muhas-doctor-of-medicine'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const p = PROGRAMMES.find((x) => x.slug === slug);
    if (!p) {
      return { content: [{ type: "text", text: `No programme with slug '${slug}'` }], isError: true };
    }
    const inst = INSTITUTIONS.find((i) => i.id === p.institutionId);
    const campus = inst?.campuses.find((c) => c.id === p.campusId);
    const out = {
      slug: p.slug,
      name: p.name.en,
      nameSwahili: p.name.sw,
      institution: inst?.name ?? p.institutionId,
      institutionType: inst?.type,
      location: campus ? `${campus.name}, ${campus.region}` : "",
      durationYears: p.durationYears,
      category: p.category,
      overview: p.overview.en,
      heslbEligible: p.heslbEligible,
      tuition: p.tuition,
      applicationOpens: p.applicationOpens,
      applicationDeadline: p.applicationDeadline,
      applicationUrl: p.applicationUrl,
      admissionRule: p.rule,
      modules: p.modules.map((m) => m.en),
      requiredDocuments: p.requiredDocuments,
      source: p.source,
      lastVerified: p.lastVerified,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
      structuredContent: out,
    };
  },
});
