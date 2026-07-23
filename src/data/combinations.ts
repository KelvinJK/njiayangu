// Form Six subject combinations used in Tanzania (illustrative, unverified sample).
// Grades used: A=5, B=4, C=3, D=2, E=1, F=0 (Form Six principal subject points).

export const SUBJECTS = [
  { code: "PHY", en: "Physics", sw: "Fizikia" },
  { code: "CHE", en: "Chemistry", sw: "Kemia" },
  { code: "MAT", en: "Advanced Mathematics", sw: "Hisabati ya Juu" },
  { code: "BIO", en: "Biology", sw: "Biolojia" },
  { code: "GEO", en: "Geography", sw: "Jiografia" },
  { code: "HIS", en: "History", sw: "Historia" },
  { code: "ECO", en: "Economics", sw: "Uchumi" },
  { code: "COM", en: "Commerce", sw: "Biashara" },
  { code: "ACC", en: "Accountancy", sw: "Uhasibu" },
  { code: "KIS", en: "Kiswahili", sw: "Kiswahili" },
  { code: "ENG", en: "English Literature", sw: "Fasihi ya Kiingereza" },
  { code: "FRE", en: "French", sw: "Kifaransa" },
  { code: "ARB", en: "Arabic", sw: "Kiarabu" },
  { code: "GS", en: "General Studies", sw: "Masomo ya Jumla" },
  { code: "BAM", en: "Basic Applied Mathematics", sw: "Hisabati ya Msingi" },
] as const;

export type SubjectCode = (typeof SUBJECTS)[number]["code"];

export interface Combination {
  code: string;
  en: string;
  sw: string;
  subjects: SubjectCode[];
  popular?: boolean;
}

export const COMBINATIONS: Combination[] = [
  // Sciences & Mathematics
  { code: "PCM", en: "Physics, Chemistry, Mathematics", sw: "Fizikia, Kemia, Hisabati", subjects: ["PHY", "CHE", "MAT"], popular: true },
  { code: "PCB", en: "Physics, Chemistry, Biology", sw: "Fizikia, Kemia, Biolojia", subjects: ["PHY", "CHE", "BIO"], popular: true },
  { code: "CBG", en: "Chemistry, Biology, Geography", sw: "Kemia, Biolojia, Jiografia", subjects: ["CHE", "BIO", "GEO"], popular: true },
  { code: "CBA", en: "Chemistry, Biology, Agriculture", sw: "Kemia, Biolojia, Kilimo", subjects: ["CHE", "BIO", "GEO"] }, // Assuming GEO placeholder for AGR
  { code: "CBN", en: "Chemistry, Biology, Nutrition", sw: "Kemia, Biolojia, Lishe", subjects: ["CHE", "BIO", "GEO"] },
  { code: "PGM", en: "Physics, Geography, Mathematics", sw: "Fizikia, Jiografia, Hisabati", subjects: ["PHY", "GEO", "MAT"] },
  { code: "PMC", en: "Physics, Mathematics, Computer Science", sw: "Fizikia, Hisabati, Sayansi ya Kompyuta", subjects: ["PHY", "MAT", "GEO"] }, // GEO placeholder
  // Business
  { code: "ECA", en: "Economics, Commerce, Accountancy", sw: "Uchumi, Biashara, Uhasibu", subjects: ["ECO", "COM", "ACC"], popular: true },
  { code: "EGM", en: "Economics, Geography, Mathematics", sw: "Uchumi, Jiografia, Hisabati", subjects: ["ECO", "GEO", "MAT"], popular: true },
  { code: "HGE", en: "History, Geography, Economics", sw: "Historia, Jiografia, Uchumi", subjects: ["HIS", "GEO", "ECO"], popular: true },
  // Arts & Humanities
  { code: "HGL", en: "History, Geography, English Literature", sw: "Historia, Jiografia, Fasihi", subjects: ["HIS", "GEO", "ENG"], popular: true },
  { code: "HGK", en: "History, Geography, Kiswahili", sw: "Historia, Jiografia, Kiswahili", subjects: ["HIS", "GEO", "KIS"], popular: true },
  { code: "HKL", en: "History, Kiswahili, English Literature", sw: "Historia, Kiswahili, Fasihi", subjects: ["HIS", "KIS", "ENG"], popular: true },
  { code: "KLF", en: "Kiswahili, English Language, French", sw: "Kiswahili, Kiingereza, Kifaransa", subjects: ["KIS", "ENG", "FRE"] },
  { code: "KLA", en: "Kiswahili, English Language, Arabic", sw: "Kiswahili, Kiingereza, Kiarabu", subjects: ["KIS", "ENG", "ARB"] },
  { code: "HLF", en: "History, English Language, French", sw: "Historia, Kiingereza, Kifaransa", subjects: ["HIS", "ENG", "FRE"] },
  { code: "EKA", en: "Economics, Kiswahili, Accountancy", sw: "Uchumi, Kiswahili, Uhasibu", subjects: ["ECO", "KIS", "ACC"] },
  { code: "KEC", en: "Kiswahili, English Language, Chinese", sw: "Kiswahili, Kiingereza, Kichina", subjects: ["KIS", "ENG", "GEO"] }, // GEO placeholder
];

export const GRADES = ["A", "B", "C", "D", "E", "F"] as const;
export type Grade = (typeof GRADES)[number];

export const GRADE_POINTS: Record<Grade, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

export function gradePoints(g: Grade | undefined): number {
  if (!g) return 0;
  return GRADE_POINTS[g];
}
