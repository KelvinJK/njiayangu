import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { z } from "zod";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { COMBINATIONS, GRADES, SUBJECTS, type Grade, type SubjectCode } from "@/data/combinations";
import { PROGRAMMES, PROGRAMME_CATEGORIES } from "@/data/programmes";
import { INSTITUTIONS, REGIONS } from "@/data/institutions";
import { applyPreferences, evaluate, type StudentAcademics, type StudentPreferences } from "@/lib/eligibility";
import { ProgrammeCard } from "@/components/site/ProgrammeCard";
import { NectaResultFetcher } from "@/components/NectaResultFetcher";
import { ChevronRight, ChevronLeft, RotateCcw, Lock, CreditCard, Sparkles, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaywallModal } from "@/components/PaywallModal";

const searchSchema = z.object({ combination: z.string().optional(), returnFromAuth: z.boolean().optional() });

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, setProfile, incrementAttempts, redeemPayment: _r, consumeGeneration } = useStore();
  void _r;
  const [step, setStep] = useState(1);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallReason, setPaywallReason] = useState<"initial" | "outOfCredits">("initial");
  const processedReturn = useRef(false);

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
      
      setWillingToRelocate(p.willingToRelocate);
      setPreferredDuration(p.preferredDuration ?? "any");
      setNeedsFinancing(p.needsFinancing);
    }
    
    if (search.returnFromAuth && user && !processedReturn.current) {
      processedReturn.current = true;
      const remaining = profile.generationsRemaining ?? 0;
      if (remaining > 0) {
        consumeGeneration();
        setStep(4);
      } else {
        setPaywallReason("initial");
        setIsPaywallOpen(true);
      }
      navigate({ search: { combination: search.combination } as any, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, search.returnFromAuth]);

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
  }, [combination, grades, gsGrade, oLevel, careerInterests, preferredRegions, institutionType, willingToRelocate, preferredDuration, needsFinancing]);

  const goNext = () => {
    if (step === 3) {
      setProfile({ academics, preferences });
      if (!user) {
        navigate({ to: "/auth", search: { next: "/find-my-courses?returnFromAuth=true" } as any });
        return;
      }
      incrementAttempts();
      const remaining = profile.generationsRemaining ?? 0;
      const totalUsed = profile.generationsUsed ?? 0;
      if (remaining > 0) {
        consumeGeneration();
        setStep(4);
      } else {
        setPaywallReason(totalUsed > 0 ? "outOfCredits" : "initial");
        setIsPaywallOpen(true);
      }
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
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

  // Filter & sort state for Step 4 results
  type StatusFilter = "ALL" | "ELIGIBLE" | "POTENTIALLY_ELIGIBLE" | "INCOMPLETE_INFORMATION" | "NOT_ELIGIBLE";
  type SortKey = "relevance" | "match" | "deadline" | "points" | "duration";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("relevance");
  const [heslbOnly, setHeslbOnly] = useState(false);
  const [instTypeFilter, setInstTypeFilter] = useState<"any" | "public" | "private">("any");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredResults = useMemo(() => {
    let out = [...results];
    if (statusFilter !== "ALL") out = out.filter((r) => r.eligibility.status === statusFilter);
    if (heslbOnly) out = out.filter((r) => r.programme.heslbEligible);
    if (instTypeFilter !== "any") out = out.filter((r) => r.institutionType === instTypeFilter);
    const order = { ELIGIBLE: 0, POTENTIALLY_ELIGIBLE: 1, INCOMPLETE_INFORMATION: 2, NOT_ELIGIBLE: 3 } as const;
    out.sort((a, b) => {
      switch (sortKey) {
        case "match":
          return b.preferenceMatch - a.preferenceMatch;
        case "deadline":
          return new Date(a.programme.applicationDeadline).getTime() - new Date(b.programme.applicationDeadline).getTime();
        case "points":
          return a.programme.rule.minPoints - b.programme.rule.minPoints;
        case "duration":
          return a.programme.durationYears - b.programme.durationYears;
        case "relevance":
        default: {
          const diff = order[a.eligibility.status] - order[b.eligibility.status];
          return diff !== 0 ? diff : b.preferenceMatch - a.preferenceMatch;
        }
      }
    });
    return out;
  }, [results, statusFilter, heslbOnly, instTypeFilter, sortKey]);

  const activeFilterCount = (statusFilter !== "ALL" ? 1 : 0) + (heslbOnly ? 1 : 0) + (instTypeFilter !== "any" ? 1 : 0);
  const resetFilters = () => { setStatusFilter("ALL"); setHeslbOnly(false); setInstTypeFilter("any"); setSortKey("relevance"); };

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
                <input value={preferredName} onChange={(e) => setPreferredName(e.target.value)} className="w-full h-11 px-3 rounded-md border bg-surface text-base sm:text-sm" />
              </label>
              <label className="text-sm">
                <span className="block mb-1 font-medium">{lang === "en" ? "Examination year" : "Mwaka wa mtihani"}</span>
                <input type="number" value={examYear} onChange={(e) => setExamYear(Number(e.target.value))} className="w-full h-11 px-3 rounded-md border bg-surface text-base sm:text-sm" />
              </label>
              <label className="text-sm">
                <span className="block mb-1 font-medium">{lang === "en" ? "Region" : "Mkoa"}</span>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full h-11 px-3 rounded-md border bg-surface text-base sm:text-sm">
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
                          <select value={grades[code] ?? ""} onChange={(e) => setGrades((g) => ({ ...g, [code]: (e.target.value || undefined) as Grade | undefined }))} className="w-full h-11 px-3 rounded-md border bg-surface text-base sm:text-sm">
                            <option value="">—</option>
                            {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </label>
                      );
                    })}
                    <label className="text-sm">
                      <span className="block mb-1">General Studies</span>
                      <select value={gsGrade ?? ""} onChange={(e) => setGsGrade((e.target.value || undefined) as Grade | undefined)} className="w-full h-11 px-3 rounded-md border bg-surface text-base sm:text-sm">
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
                      <select value={oLevel[s] ?? ""} onChange={(e) => setOLevel((o) => ({ ...o, [s]: (e.target.value || undefined) as Grade | undefined }))} className="w-full h-11 px-3 rounded-md border bg-surface text-base sm:text-sm">
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
                  <select value={institutionType} onChange={(e) => setInstitutionType(e.target.value as any)} className="w-full h-11 px-3 rounded-md border bg-surface text-base sm:text-sm">
                    <option value="any">{lang === "en" ? "Any" : "Yoyote"}</option>
                    <option value="public">{lang === "en" ? "Public" : "Umma"}</option>
                    <option value="private">{lang === "en" ? "Private" : "Binafsi"}</option>
                  </select>
                </label>
                <label className="text-sm">
                  <span className="block mb-1 font-medium">{lang === "en" ? "Preferred duration" : "Muda unaopendelea"}</span>
                  <select value={preferredDuration} onChange={(e) => setPreferredDuration(e.target.value as any)} className="w-full h-11 px-3 rounded-md border bg-surface text-base sm:text-sm">
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
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-accent/50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-brand" />
                  <span className="font-medium">
                    {lang === "en" ? "Generations remaining" : "Migao iliyobaki"}:
                  </span>
                  <span className="font-mono font-semibold">{profile.generationsRemaining ?? 0}</span>
                  <span className="text-xs text-muted-foreground">
                    ({lang === "en" ? "used" : "zilizotumika"}: {profile.generationsUsed ?? 0})
                  </span>
                </div>
                <button
                  onClick={() => {
                    setPaywallReason("outOfCredits");
                    setIsPaywallOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-brand/40 bg-background text-xs font-medium hover:bg-accent"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  {lang === "en" ? "Top up (1,000 TZS)" : "Ongeza (TZS 1,000)"}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["ELIGIBLE", "POTENTIALLY_ELIGIBLE", "INCOMPLETE_INFORMATION", "NOT_ELIGIBLE"] as const).map((k) => {
                  const active = statusFilter === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setStatusFilter(active ? "ALL" : k)}
                      className={cn(
                        "rounded-lg border bg-surface p-3 text-left transition-colors",
                        active ? "border-brand bg-accent ring-1 ring-brand/40" : "hover:border-brand/50",
                      )}
                      aria-pressed={active}
                    >
                      <div className="text-2xl font-semibold">{grouped[k].length}</div>
                      <div className="text-xs text-muted-foreground truncate">{t(`eligibility.${k}`)}</div>
                    </button>
                  );
                })}
              </div>

              {/* Sticky filter/sort toolbar */}
              <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-card/95 backdrop-blur border-y">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                    className="inline-flex items-center gap-1.5 h-10 px-3 rounded-md border text-sm font-medium min-w-0 shrink-0"
                    aria-label={lang === "en" ? "Open filters" : "Fungua vichujio"}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>{lang === "en" ? "Filters" : "Vichujio"}</span>
                    {activeFilterCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-brand text-brand-foreground text-[10px] font-semibold">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                  <div className="relative flex-1 min-w-0">
                    <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      value={sortKey}
                      onChange={(e) => setSortKey(e.target.value as SortKey)}
                      className="w-full h-10 pl-8 pr-3 rounded-md border bg-surface text-sm truncate"
                      aria-label={lang === "en" ? "Sort results" : "Panga matokeo"}
                    >
                      <option value="relevance">{lang === "en" ? "Sort: Relevance" : "Panga: Muhimu"}</option>
                      <option value="match">{lang === "en" ? "Sort: Best match %" : "Panga: Ulinganifu %"}</option>
                      <option value="deadline">{lang === "en" ? "Sort: Deadline soonest" : "Panga: Tarehe ya karibu"}</option>
                      <option value="points">{lang === "en" ? "Sort: Points (low → high)" : "Panga: Alama (chini → juu)"}</option>
                      <option value="duration">{lang === "en" ? "Sort: Duration (short → long)" : "Panga: Muda (mfupi → mrefu)"}</option>
                    </select>
                  </div>
                </div>
                {activeFilterCount > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {statusFilter !== "ALL" && (
                      <button onClick={() => setStatusFilter("ALL")} className="inline-flex items-center gap-1 h-7 px-2 rounded-full border text-xs bg-background">
                        {t(`eligibility.${statusFilter}`)} <X className="h-3 w-3" />
                      </button>
                    )}
                    {heslbOnly && (
                      <button onClick={() => setHeslbOnly(false)} className="inline-flex items-center gap-1 h-7 px-2 rounded-full border text-xs bg-background">
                        HESLB <X className="h-3 w-3" />
                      </button>
                    )}
                    {instTypeFilter !== "any" && (
                      <button onClick={() => setInstTypeFilter("any")} className="inline-flex items-center gap-1 h-7 px-2 rounded-full border text-xs bg-background">
                        {instTypeFilter === "public" ? (lang === "en" ? "Public" : "Umma") : (lang === "en" ? "Private" : "Binafsi")} <X className="h-3 w-3" />
                      </button>
                    )}
                    <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1">
                      {lang === "en" ? "Clear all" : "Futa yote"}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="mb-3 text-sm text-muted-foreground" aria-live="polite">
                  {lang === "en"
                    ? `Showing ${filteredResults.length} of ${results.length} programmes`
                    : `Zinaonyeshwa ${filteredResults.length} kati ya ${results.length}`}
                </div>
                {filteredResults.length === 0 ? (
                  <div className="rounded-xl border bg-muted p-8 text-center text-sm text-muted-foreground">
                    {lang === "en" ? "No programmes match your filters." : "Hakuna kozi zinazokidhi vichujio."}
                    <div className="mt-3">
                      <button onClick={resetFilters} className="text-brand text-sm font-medium hover:underline">
                        {lang === "en" ? "Reset filters" : "Rudisha vichujio"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredResults.slice(0, 30).map((r) => (
                      <ProgrammeCard key={r.programme.id} programme={r.programme} eligibility={r.eligibility} preferenceMatch={r.preferenceMatch} />
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile filter sheet */}
              {filtersOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center" role="dialog" aria-modal="true">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
                  <div className="relative w-full sm:max-w-md bg-card border-t sm:border sm:rounded-xl rounded-t-2xl shadow-xl max-h-[85vh] overflow-y-auto">
                    <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b bg-card">
                      <h3 className="font-semibold">{lang === "en" ? "Filter results" : "Chuja matokeo"}</h3>
                      <button onClick={() => setFiltersOpen(false)} aria-label="Close" className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-muted">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-4 space-y-5">
                      <div>
                        <div className="text-sm font-medium mb-2">{lang === "en" ? "Eligibility status" : "Hali ya kufaa"}</div>
                        <div className="flex flex-wrap gap-2">
                          {(["ALL", "ELIGIBLE", "POTENTIALLY_ELIGIBLE", "INCOMPLETE_INFORMATION", "NOT_ELIGIBLE"] as const).map((k) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setStatusFilter(k)}
                              className={cn(
                                "px-3 h-9 rounded-full border text-sm",
                                statusFilter === k ? "border-brand bg-brand text-brand-foreground" : "hover:border-brand",
                              )}
                            >
                              {k === "ALL" ? (lang === "en" ? "All" : "Zote") : t(`eligibility.${k}`)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">{lang === "en" ? "Institution type" : "Aina ya chuo"}</div>
                        <div className="flex flex-wrap gap-2">
                          {(["any", "public", "private"] as const).map((k) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setInstTypeFilter(k)}
                              className={cn(
                                "px-3 h-9 rounded-full border text-sm",
                                instTypeFilter === k ? "border-brand bg-brand text-brand-foreground" : "hover:border-brand",
                              )}
                            >
                              {k === "any" ? (lang === "en" ? "Any" : "Yoyote") : k === "public" ? (lang === "en" ? "Public" : "Umma") : (lang === "en" ? "Private" : "Binafsi")}
                            </button>
                          ))}
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={heslbOnly} onChange={(e) => setHeslbOnly(e.target.checked)} className="h-4 w-4" />
                        <span>{lang === "en" ? "HESLB-eligible only" : "HESLB pekee"}</span>
                      </label>
                      <div>
                        <div className="text-sm font-medium mb-2">{lang === "en" ? "Sort by" : "Panga kwa"}</div>
                        <select
                          value={sortKey}
                          onChange={(e) => setSortKey(e.target.value as SortKey)}
                          className="w-full h-11 px-3 rounded-md border bg-surface text-sm"
                        >
                          <option value="relevance">{lang === "en" ? "Relevance" : "Muhimu"}</option>
                          <option value="match">{lang === "en" ? "Best match %" : "Ulinganifu %"}</option>
                          <option value="deadline">{lang === "en" ? "Deadline soonest" : "Tarehe ya karibu"}</option>
                          <option value="points">{lang === "en" ? "Points (low → high)" : "Alama (chini → juu)"}</option>
                          <option value="duration">{lang === "en" ? "Duration (short → long)" : "Muda (mfupi → mrefu)"}</option>
                        </select>
                      </div>
                    </div>
                    <div className="sticky bottom-0 flex gap-2 p-3 border-t bg-card">
                      <button onClick={resetFilters} className="flex-1 h-11 rounded-md border text-sm font-medium">
                        {lang === "en" ? "Reset" : "Rudisha"}
                      </button>
                      <button onClick={() => setFiltersOpen(false)} className="flex-1 h-11 rounded-md bg-brand text-brand-foreground text-sm font-medium">
                        {lang === "en" ? `Show ${filteredResults.length} results` : `Onyesha ${filteredResults.length}`}
                      </button>
                    </div>
                  </div>
                </div>
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
      <PaywallModal
        isOpen={isPaywallOpen}
        outOfCredits={paywallReason === "outOfCredits"}
        onClose={() => setIsPaywallOpen(false)}
        onVerified={() => {
          // Grant already applied by redeemPayment. Consume one for this run.
          consumeGeneration();
          setIsPaywallOpen(false);
          setStep(4);
          if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </AppShell>
  );
}
