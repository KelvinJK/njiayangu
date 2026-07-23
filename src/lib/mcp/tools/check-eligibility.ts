import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PROGRAMMES } from "@/data/programmes";
import { evaluate } from "@/lib/eligibility";
import type { StudentAcademics } from "@/lib/eligibility";
import { GRADES } from "@/data/combinations";

const GradeSchema = z.enum(GRADES as unknown as [string, ...string[]]);

export default defineTool({
  name: "check_eligibility",
  title: "Check eligibility",
  description:
    "Run NjiaYangu's deterministic admission engine against a programme for a given Form Six combination and subject grades. Returns eligibility status (eligible / borderline / not_eligible), computed points, and which admission rules matched or failed.",
  inputSchema: {
    programmeSlug: z.string().describe("Programme slug to evaluate."),
    combinationCode: z
      .string()
      .describe("Form Six combination code, e.g. PCM, PCB, HGE, EGM, CBG, HKL."),
    subjects: z
      .record(z.string(), GradeSchema)
      .describe(
        "Map of subject code -> Form Six grade (A-F). Include at least the three principal subjects of the combination.",
      ),
    olevelDivision: z.number().int().min(1).max(4).optional().describe("O-level division (1-4)."),
    olevelPasses: z.number().int().min(0).max(12).optional().describe("Number of O-level passes (grade D or better)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ programmeSlug, combinationCode, subjects, olevelDivision, olevelPasses }) => {
    const p = PROGRAMMES.find((x) => x.slug === programmeSlug);
    if (!p) {
      return { content: [{ type: "text", text: `No programme with slug '${programmeSlug}'` }], isError: true };
    }
    const academics: StudentAcademics = {
      combination: combinationCode.toUpperCase(),
      subjects: subjects as StudentAcademics["subjects"],
      olevelDivision,
      olevelPasses,
    };
    const result = evaluate(p, academics);
    const summary = {
      programme: p.name.en,
      status: result.status,
      points: result.points,
      minPoints: p.rule.minPoints,
      reasons: result.reasons,
      source: p.source,
      lastVerified: p.lastVerified,
      disclaimer:
        "Admission rules can change. Always confirm with the official institution or TCU/NACTE source before applying.",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
