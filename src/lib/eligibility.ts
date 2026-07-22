import { GRADE_POINTS, type Grade, type SubjectCode } from "@/data/combinations";
import type { AdmissionRule, EligibilityStatus, Programme } from "@/data/programmes";

export interface StudentAcademics {
  combinationCode: string;
  grades: Partial<Record<SubjectCode, Grade>>; // principal subject grades
  gsGrade?: Grade; // General Studies
  oLevel: Record<string, Grade | undefined>; // e.g. Mathematics, English, Physics, Kiswahili
}

export interface StudentPreferences {
  preferredName?: string;
  examinationYear?: number;
  region?: string;
  language?: "en" | "sw";
  careerInterests: string[]; // programme categories
  preferredRegions: string[];
  institutionType: "any" | "public" | "private";
  budgetMax?: number;
  willingToRelocate: boolean;
  preferredDuration?: "any" | "short" | "medium" | "long"; // <3, 3-4, >=5
  needsFinancing: boolean;
}

export interface EligibilityResult {
  status: EligibilityStatus;
  passed: string[];
  failed: string[];
  missing: string[];
  points: number;
  matchingSubjects: SubjectCode[];
  source: { title: string; url: string };
  lastVerified: string;
}

function principalGrades(a: StudentAcademics): { code: SubjectCode; grade: Grade }[] {
  return Object.entries(a.grades)
    .filter(([, g]) => g && g !== "F")
    .map(([code, grade]) => ({ code: code as SubjectCode, grade: grade as Grade }));
}

function topTwoPoints(a: StudentAcademics): number {
  const points = Object.values(a.grades)
    .filter((g): g is Grade => Boolean(g))
    .map((g) => GRADE_POINTS[g])
    .sort((x, y) => y - x);
  return (points[0] ?? 0) + (points[1] ?? 0);
}

function checkRule(a: StudentAcademics, rule: AdmissionRule) {
  const passed: string[] = [];
  const failed: string[] = [];
  const missing: string[] = [];

  const held = principalGrades(a);
  const heldCodes = new Set(held.map((h) => h.code));

  // Required subjects
  for (const s of rule.requiredSubjects) {
    if (heldCodes.has(s)) passed.push(`Has required subject: ${s}`);
    else failed.push(`Missing required principal subject: ${s}`);
  }

  // Alternative OR-groups
  if (rule.alternativeSubjects) {
    for (const group of rule.alternativeSubjects) {
      const hasOne = group.some((s) => heldCodes.has(s));
      if (hasOne) passed.push(`Has at least one of: ${group.join(" / ")}`);
      else failed.push(`Needs at least one of: ${group.join(" / ")}`);
    }
  }

  // Principal passes
  const passes = held.length;
  if (passes >= rule.minPrincipalPasses) passed.push(`Principal passes: ${passes}/${rule.minPrincipalPasses}`);
  else failed.push(`Only ${passes} principal passes (need ${rule.minPrincipalPasses})`);

  // Points (top 2)
  const pts = topTwoPoints(a);
  if (pts >= rule.minPoints) passed.push(`Points: ${pts}/${rule.minPoints}`);
  else failed.push(`Points ${pts} below minimum ${rule.minPoints}`);

  // Subject min grades
  if (rule.minSubjectGrade) {
    for (const [sub, minG] of Object.entries(rule.minSubjectGrade)) {
      const held = a.grades[sub as SubjectCode];
      if (!held) failed.push(`Missing grade for ${sub} (need at least ${minG})`);
      else if (GRADE_POINTS[held] >= GRADE_POINTS[minG as Grade])
        passed.push(`${sub} = ${held} meets minimum ${minG}`);
      else failed.push(`${sub} = ${held} below minimum ${minG}`);
    }
  }

  // O-Level
  if (rule.oLevel) {
    for (const req of rule.oLevel) {
      const held = a.oLevel[req.subject];
      if (!held) missing.push(`O-Level ${req.subject} grade not provided (need ${req.minGrade})`);
      else if (GRADE_POINTS[held] >= GRADE_POINTS[req.minGrade as Grade])
        passed.push(`O-Level ${req.subject} = ${held} meets ${req.minGrade}`);
      else failed.push(`O-Level ${req.subject} = ${held} below ${req.minGrade}`);
    }
  }

  return { passed, failed, missing, points: pts };
}

export function evaluate(programme: Programme, a: StudentAcademics): EligibilityResult {
  const held = principalGrades(a);
  const matchingSubjects = held.map((h) => h.code);

  // If no principal grades at all → incomplete
  const anyGrade = held.length > 0;
  if (!anyGrade) {
    return {
      status: "INCOMPLETE_INFORMATION",
      passed: [],
      failed: [],
      missing: ["No Form Six grades provided yet"],
      points: 0,
      matchingSubjects,
      source: programme.source,
      lastVerified: programme.lastVerified,
    };
  }

  const { passed, failed, missing, points } = checkRule(a, programme.rule);

  let status: EligibilityStatus;
  if (failed.length === 0 && missing.length === 0) status = "ELIGIBLE";
  else if (failed.length === 0 && missing.length > 0) status = "INCOMPLETE_INFORMATION";
  else if (failed.length <= 1 && missing.length === 0) status = "POTENTIALLY_ELIGIBLE";
  else status = "NOT_ELIGIBLE";

  return {
    status,
    passed,
    failed,
    missing,
    points,
    matchingSubjects,
    source: programme.source,
    lastVerified: programme.lastVerified,
  };
}

export function preferenceMatch(programme: Programme, p: StudentPreferences): number {
  let score = 0;
  let max = 0;

  max += 30;
  if (p.careerInterests.length === 0 || p.careerInterests.includes(programme.category)) score += 30;

  max += 20;
  if (p.institutionType === "any") score += 20;
  else score += 0; // caller supplies institution to check type-match externally

  max += 20;
  if (!p.budgetMax || programme.tuition.amount <= p.budgetMax) score += 20;

  max += 15;
  if (p.preferredDuration === "any" || !p.preferredDuration) score += 15;
  else if (p.preferredDuration === "short" && programme.durationYears < 3) score += 15;
  else if (p.preferredDuration === "medium" && programme.durationYears >= 3 && programme.durationYears <= 4) score += 15;
  else if (p.preferredDuration === "long" && programme.durationYears >= 5) score += 15;

  max += 15;
  if (!p.needsFinancing || programme.heslbEligible) score += 15;

  return Math.round((score / max) * 100);
}

export function applyPreferences<T extends { programme: Programme; institutionType: "public" | "private"; region: string }>(
  items: T[],
  p: StudentPreferences,
): (T & { preferenceMatch: number })[] {
  return items.map((it) => {
    let score = preferenceMatch(it.programme, p);
    // adjust for institution type & region
    if (p.institutionType !== "any" && it.institutionType !== p.institutionType) score -= 10;
    if (p.preferredRegions.length > 0 && !p.preferredRegions.includes(it.region) && !p.willingToRelocate)
      score -= 15;
    return { ...it, preferenceMatch: Math.max(0, Math.min(100, score)) };
  });
}
