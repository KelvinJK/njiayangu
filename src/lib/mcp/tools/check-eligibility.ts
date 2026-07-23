import { instrument } from "../instrument";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PROGRAMMES } from "@/data/programmes";
import { evaluate } from "@/lib/eligibility";
import type { StudentAcademics } from "@/lib/eligibility";
import { GRADES, type Grade, type SubjectCode } from "@/data/combinations";

const GradeSchema = z.enum(GRADES as unknown as [Grade, ...Grade[]]);

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
    grades: z
      .record(z.string(), GradeSchema)
      .describe(
        "Map of subject code -> Form Six grade (A-F). Include the principal subjects of the combination.",
      ),
    gsGrade: GradeSchema.optional().describe("General Studies grade (A-F), if known."),
    oLevel: z
      .record(z.string(), GradeSchema)
      .optional()
      .describe("Map of O-level subject name -> grade (e.g. Mathematics: 'C', English: 'D')."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: instrument("check_eligibility", ({ programmeSlug, combinationCode, grades, gsGrade, oLevel }) => {
    const p = PROGRAMMES.find((x) => x.slug === programmeSlug);
    if (!p) {
      return { content: [{ type: "text", text: `No programme with slug '${programmeSlug}'` }], isError: true };
    }
    const academics: StudentAcademics = {
      combinationCode: combinationCode.toUpperCase(),
      grades: grades as Partial<Record<SubjectCode, Grade>>,
      gsGrade,
      oLevel: (oLevel ?? {}) as Record<string, Grade | undefined>,
    };
    const result = evaluate(p, academics);
    const summary = {
      programme: p.name.en,
      status: result.status,
      points: result.points,
      minPoints: p.rule.minPoints,
      passed: result.passed,
      failed: result.failed,
      missing: result.missing,
      matchingSubjects: result.matchingSubjects,
      source: result.source,
      lastVerified: result.lastVerified,
      disclaimer:
        "Admission rules can change. Always confirm with the official institution or TCU/NACTE source before applying.",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  }),
});
