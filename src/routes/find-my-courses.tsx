import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { z } from "zod";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { COMBINATIONS, GRADES, SUBJECTS, type Grade, type SubjectCode } from "@/data/combinations";
import { PROGRAMMES, PROGRAMME_CATEGORIES } from "@/data/programmes";
import { INSTITUTIONS, REGIONS } from "@/data/institutions";
import { applyPreferences, evaluate, type StudentAcademics, type StudentPreferences } from "@/lib/eligibility";
import { ProgrammeCard } from "@/components/site/ProgrammeCard";
import { NectaResultFetcher } from "@/components/NectaResultFetcher";
import { ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const searchSchema = z.object({ combination: z.string().optional() });

export const Route = createFileRoute("/find-my-courses")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Find My Courses — NjiaYangu" },
      { name: "description", content: "Answer a short questionnaire about your Form Six combination, grades and preferences to see eligible Tanzanian university programmes." },
      { property: "og:title", content: "Find My Courses — NjiaYangu" },
      { property: "og:description", content: "Match your Form Six results to eligible Tanzanian university programmes." },
    ],
  }),
  component: FindPage,
});

const O_LEVEL_SUBJECTS = ["Mathematics", "English", "Physics", "Chemistry", "Biology", "Kiswahili", "History", "Geography"];

function FindPage() {
  const { t, lang } = useI18n();
  const search = Route.useSearch();
  const { profile, setProfile } = useStore();
  const [step, setStep] = useState(1);

  const [preferredName, setPreferredName] = useState("");
  const [examYear, setExamYear] = useState(2026);
  const [region, setRegion] = useState("");
  const [combination, setCombination] = useState(search.combination ?? "");
  const [grades, setGrades] = useState<Partial<Record<SubjectCode, Grade>>>({});
  const [gsGrade, setGsGrade] = useState<Grade | undefined>();
  const [oLevel, setOLevel] = useState<Record<string, Grade | undefined>>({});
  const [careerInterests, setCareerInterests] = useState<string[]>([]);
  const [preferredRegions, setPreferredRegions] = useState<string[]>([]);
  const [institutionType, setInstitutionType] = useState<"any" | "public" | "private">("any");
  const [budgetMax, setBudgetMax] = useState<number | undefined>();
  const [willingToRelocate, setWillingToRelocate] = useState(true);
  const [preferredDuration, setPreferredDuration] = useState<"any" | "short" | "medium" | "long">("any");
  const [needsFinancing, setNeedsFinancing] = useState(true);

  // Hydrate from profile once
  useEffect(() => {
    const a = profile.academics;
    const p = profile.preferences;
    if (a) {
      setCombination(a.combinationCode);
      setGrades(a.grades);
      setGsGrade(a.gsGrade);
      setOLevel(a.oLevel);
    }
    if (p) {
      setPreferredName(p.preferredName ?? "");
      setExamYear(p.examinationYear ?? 2026);
      setRegion(p.region ?? "");
      setCareerInterests(p.careerInterests);
      setPreferredRegions(p.preferredRegions);
      setInstitutionType(p.institutionType);
      setBudgetMax(p.budgetMax);
      setWillingToRelocate(p.willingToRelocate);
      setPreferredDuration(p.preferredDuration ?? "any");
      setNeedsFinancing(p.needsFinancing);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCombo = COMBINATIONS.find((c) => c.code === combination);

  const academics: StudentAcademics = {
    combinationCode: combination,
    grades,
    gsGrade,
    oLevel,
  };
  const preferences: StudentPreferences = {
    preferredName,
    examinationYear: examYear,
    region,
    language: lang,
    careerInterests,
    preferredRegions,
    institutionType,
    budgetMax,
    willingToRelocate,
    preferredDuration,
    needsFinancing,
  };

  const results = useMemo(() => {
    const evaluated = PROGRAMMES.filter((p) => p.status === "active").map((p) => {
      const inst = INSTITUTIONS.find((i) => i.id === p.institutionId)!;
      const campus = inst.campuses.find((c) => c.id === p.campusId)!;
      return {
        programme: p,
        institution: inst,
        institutionType: inst.type,
        region: campus.region,
        eligibility: evaluate(p, academics),
      };
    });
    const withPref = applyPreferences(evaluated, preferences);
    return withPref.sort((a, b) => {
      const order = { ELIGIBLE: 0, POTENTIALLY_ELIGIBLE: 1, INCOMPLETE_INFORMATION: 2, NOT_ELIGIBLE: 3 } as const;
      const diff = order[a.eligibility.status] - order[b.eligibility.status];
      if (diff !== 0) return diff;
      return b.preferenceMatch - a.preferenceMatch;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combination, grades, gsGrade, oLevel, careerInterests, preferredRegions, institutionType, budgetMax, willingToRelocate, preferredDuration, needsFinancing]);

  const goNext = () => {
    if (step === 3) {
      setProfile({ academics, preferences });
    }
    setStep((s) => Math.min(4, s + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => setStep((s) => Math.max(1, s - 1));
  const reset = () => {
    setStep(1);
    setCombination("");
    setGrades({});
    setGsGrade(undefined);
    setOLevel({});
    setCareerInterests([]);
    setPreferredRegions([]);
    setInstitutionType("any");
    setBudgetMax(undefined);
    setWillingToRelocate(true);
    setPreferredDuration("any");
    setNeedsFinancing(true);
  };

  const grouped = {
    ELIGIBLE: results.filter((r) => r.eligibility.status === "ELIGIBLE"),
    POTENTIALLY_ELIGIBLE: results.filter((r) => r.eligibility.status === "POTENTIALLY_ELIGIBLE"),
    INCOMPLETE_INFORMATION: results.filter((r) => r.eligibility.status === "INCOMPLETE_INFORMATION"),
    NOT_ELIGIBLE: results.filter((r) => r.eligibility.status === "NOT_ELIGIBLE"),
  };

  return (
    <AppShell>
      <section className="container-page py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold">{t("nav.find")}</h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
          {lang === "en"
            ? "Answer a few questions to see programmes you qualify for. Your answers stay on this device."
            : "Jibu maswali machache ili kuona kozi unazostahili. Majibu yako yanabaki kwenye simu yako."}
        </p>

        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center border", step >= n ? "bg-brand text-brand-foreground border-brand" : "bg-muted")}>
                {n}
              </div>
              {n < 4 && <div className={cn("h-px w-6 sm:w-12", step > n ? "bg-brand" : "bg-border")} />}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border bg-card p-4 sm:p-6">
          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="block mb-1 font-medium">{lang === "en" ? "Preferred name" : "Jina la kupendelea"}</span>
                <input value={preferredName} onChange={(e) => setPreferredName(e.target.value)} className="w-full h-11 px-3 rounded-md border bg-surface" />
              </label>
              <label className="text-sm">
                <span className="block mb-1 font-medium">{lang === "en" ? "Examination year" : "Mwaka wa mtihani"}</span>
                <input type="number" value={examYear} onChange={(e) => setExamYear(Number(e.target.value))} className="w-full h-11 px-3 rounded-md border bg-surface" />
              </label>
              <label className="text-sm">
                <span className="block mb-1 font-medium">{lang === "en" ? "Region" : "Mkoa"}</span>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full h-11 px-3 rounded-md border bg-surface">
                  <option value="">—</option>
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
              <div className="text-sm">
                <span className="block mb-1 font-medium">{t("common.language")}</span>
                <p className="text-xs text-muted-foreground">
                  {lang === "en" ? "Use the EN / SW switch at the top." : "Tumia kitufe cha EN / SW juu."}
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6">
              <NectaResultFetcher
                onResultsFetched={(res) => {
                  // Attempt to parse combination from subjects
                  const subjectStr = res.subjects.toUpperCase();
                  
                  // Helper to map NECTA names to our SubjectCodes
                  const mapSubject = (nectaName: string): SubjectCode | null => {
                    if (nectaName.includes("PHY")) return "PHY";
                    if (nectaName.includes("CHEM")) return "CHE";
                    if (nectaName.includes("ADV/MATH") || nectaName.includes("B/MATH")) return "MAT";
                    if (nectaName.includes("BIO")) return "BIO";
                    if (nectaName.includes("GEO")) return "GEO";
                    if (nectaName.includes("HIST")) return "HIS";
                    if (nectaName.includes("ECON")) return "ECO";
                    if (nectaName.includes("COMM")) return "COM";
                    if (nectaName.includes("ACCT") || nectaName.includes("ACC")) return "ACC";
                    if (nectaName.includes("KISW")) return "KIS";
                    if (nectaName.includes("ENGL")) return "ENG";
                    if (nectaName.includes("FRE")) return "FRE";
                    if (nectaName.includes("ARB")) return "ARB";
                    return null;
                  };

                  const extractedGrades: Partial<Record<SubjectCode, Grade>> = {};
                  let gsG: Grade | undefined;
                  let bamG: Grade | undefined;

                  const subjectMatches = [...subjectStr.matchAll(/([A-Z/]+)\s*-\s*'([A-F0-9S])'/g)];
                  
                  // For Form 6, we try to detect combination based on the 3 principal subjects
                  const principals: SubjectCode[] = [];

                  for (const match of subjectMatches) {
                    const subj = match[1];
                    let grade = match[2] as Grade;
                    if (grade as string === 'S') grade = 'E'; // Map S to E for points sake, or leave it. NECTA S means pass.
                    
                    if (subj === "GS") {
                      gsG = grade;
                    } else if (subj === "BAM") {
                      bamG = grade;
                    } else {
                      const mapped = mapSubject(subj);
                      if (mapped) {
                        principals.push(mapped);
                        extractedGrades[mapped] = grade;
                      }
                    }
                  }

                  // Find combination
                  if (principals.length >= 3) {
                    const combo = COMBINATIONS.find(c => 
                      c.subjects.every(s => principals.includes(s))
                    );
                    if (combo) {
                      setCombination(combo.code);
                    }
                  }
                  
                  setGrades(extractedGrades);
                  if (gsG) setGsGrade(gsG);
                }}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {lang === "en" ? "Or enter manually" : "Au ingiza kwa mikono"}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">{lang === "en" ? "Form Six combination" : "Mchepuo wa Kidato cha Sita"}</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMBINATIONS.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => { setCombination(c.code); setGrades({}); }}
                      className={cn("text-left rounded-md border px-3 py-2 text-sm hover:border-brand", combination === c.code && "border-brand bg-accent")}
                    >
                      <div className="font-semibold">{c.code}</div>
                      <div className="text-xs text-muted-foreground">{c[lang]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedCombo && (
                <div>
                  <div className="text-sm font-medium mb-2">{lang === "en" ? "Principal subject grades" : "Alama za masomo makuu"}</div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {selectedCombo.subjects.map((code) => {
                      const sub = SUBJECTS.find((s) => s.code === code)!;
                      return (
                        <label key={code} className="text-sm">
                          <span className="block mb-1">{sub[lang]}</span>
                          <select value={grades[code] ?? ""} onChange={(e) => setGrades((g) => ({ ...g, [code]: (e.target.value || undefined) as Grade | undefined }))} className="w-full h-11 px-3 rounded-md border bg-surface">
                            <option value="">—</option>
                            {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </label>
                      );
                    })}
                    <label className="text-sm">
                      <span className="block mb-1">General Studies</span>
                      <select value={gsGrade ?? ""} onChange={(e) => setGsGrade((e.target.value || undefined) as Grade | undefined)} className="w-full h-11 px-3 rounded-md border bg-surface">
                        <option value="">—</option>
                        {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium mb-2">{lang === "en" ? "Relevant O-Level grades" : "Alama za Kidato cha Nne muhimu"}</div>
                <p className="text-xs text-muted-foreground mb-2">
                  {lang === "en" ? "Fill only what applies — programmes list their own O-Level requirements." : "Jaza tu zinazokuhusu — kila kozi ina masharti yake ya O-Level."}
                </p>
                <div className="grid gap-3 sm:grid-cols-4">
                  {O_LEVEL_SUBJECTS.map((s) => (
                    <label key={s} className="text-sm">
                      <span className="block mb-1">{s}</span>
                      <select value={oLevel[s] ?? ""} onChange={(e) => setOLevel((o) => ({ ...o, [s]: (e.target.value || undefined) as Grade | undefined }))} className="w-full h-11 px-3 rounded-md border bg-surface">
                        <option value="">—</option>
                        {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-6">
              <div>
                <div className="text-sm font-medium mb-2">{lang === "en" ? "Career interests" : "Maslahi ya kikazi"}</div>
                <div className="flex flex-wrap gap-2">
                  {PROGRAMME_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCareerInterests((v) => v.includes(c) ? v.filter((x) => x !== c) : [...v, c])}
                      className={cn("px-3 h-9 rounded-full border text-sm", careerInterests.includes(c) ? "border-brand bg-brand text-brand-foreground" : "hover:border-brand")}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">{lang === "en" ? "Preferred study regions" : "Mikoa unayopendelea"}</div>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setPreferredRegions((v) => v.includes(r) ? v.filter((x) => x !== r) : [...v, r])}
                      className={cn("px-3 h-9 rounded-full border text-sm", preferredRegions.includes(r) ? "border-brand bg-brand text-brand-foreground" : "hover:border-brand")}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="block mb-1 font-medium">{lang === "en" ? "Institution type" : "Aina ya chuo"}</span>
                  <select value={institutionType} onChange={(e) => setInstitutionType(e.target.value as any)} className="w-full h-11 px-3 rounded-md border bg-surface">
                    <option value="any">{lang === "en" ? "Any" : "Yoyote"}</option>
                    <option value="public">{lang === "en" ? "Public" : "Umma"}</option>
                    <option value="private">{lang === "en" ? "Private" : "Binafsi"}</option>
                  </select>
                </label>
                <label className="text-sm">
                  <span className="block mb-1 font-medium">{lang === "en" ? "Max tuition per year (TZS)" : "Ada ya juu kwa mwaka (TZS)"}</span>
                  <input type="number" value={budgetMax ?? ""} onChange={(e) => setBudgetMax(e.target.value ? Number(e.target.value) : undefined)} placeholder="1,500,000" className="w-full h-11 px-3 rounded-md border bg-surface" />
                </label>
                <label className="text-sm">
                  <span className="block mb-1 font-medium">{lang === "en" ? "Preferred duration" : "Muda unaopendelea"}</span>
                  <select value={preferredDuration} onChange={(e) => setPreferredDuration(e.target.value as any)} className="w-full h-11 px-3 rounded-md border bg-surface">
                    <option value="any">{lang === "en" ? "Any" : "Muda wowote"}</option>
                    <option value="short">&lt; 3 years</option>
                    <option value="medium">3–4 years</option>
                    <option value="long">5+ years</option>
                  </select>
                </label>
                <label className="text-sm flex items-center gap-2 mt-6">
                  <input type="checkbox" checked={willingToRelocate} onChange={(e) => setWillingToRelocate(e.target.checked)} className="h-4 w-4" />
                  <span>{lang === "en" ? "Willing to relocate for study" : "Niko tayari kuhamia kwa masomo"}</span>
                </label>
                <label className="text-sm flex items-center gap-2">
                  <input type="checkbox" checked={needsFinancing} onChange={(e) => setNeedsFinancing(e.target.checked)} className="h-4 w-4" />
                  <span>{lang === "en" ? "I need education financing (HESLB)" : "Ninahitaji ufadhili wa elimu (HESLB)"}</span>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["ELIGIBLE", "POTENTIALLY_ELIGIBLE", "INCOMPLETE_INFORMATION", "NOT_ELIGIBLE"] as const).map((k) => (
                  <div key={k} className="rounded-lg border bg-surface p-3">
                    <div className="text-2xl font-semibold">{grouped[k].length}</div>
                    <div className="text-xs text-muted-foreground">{t(`eligibility.${k}`)}</div>
                  </div>
                ))}
              </div>

              {(["ELIGIBLE", "POTENTIALLY_ELIGIBLE", "INCOMPLETE_INFORMATION", "NOT_ELIGIBLE"] as const).map((k) =>
                grouped[k].length > 0 ? (
                  <div key={k}>
                    <h2 className="text-lg font-semibold mb-3">{t(`eligibility.${k}`)} — {grouped[k].length}</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {grouped[k].slice(0, 12).map((r) => (
                        <ProgrammeCard key={r.programme.id} programme={r.programme} eligibility={r.eligibility} preferenceMatch={r.preferenceMatch} />
                      ))}
                    </div>
                  </div>
                ) : null,
              )}

              <div className="rounded-xl border bg-accent p-4 text-sm text-muted-foreground">
                {t("disclaimer.short")}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button onClick={goBack} disabled={step === 1} className="inline-flex items-center gap-1 h-11 px-4 rounded-md border text-sm disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" /> {t("find.back")}
          </button>
          <div className="flex gap-2">
            {step === 4 && (
              <button onClick={reset} className="inline-flex items-center gap-1 h-11 px-4 rounded-md border text-sm">
                <RotateCcw className="h-4 w-4" /> {t("find.reset")}
              </button>
            )}
            {step < 4 && (
              <button onClick={goNext} className="inline-flex items-center gap-1 h-11 px-5 rounded-md bg-brand text-brand-foreground text-sm font-medium">
                {step === 3 ? t("find.results") : t("find.next")} <ChevronRight className="h-4 w-4" />
              </button>
            )}
            {step === 4 && (
              <Link to="/compare" className="inline-flex items-center gap-1 h-11 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium">
                {t("nav.compare")} <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
