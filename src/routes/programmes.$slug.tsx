import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { PROGRAMMES } from "@/data/programmes";
import { INSTITUTIONS } from "@/data/institutions";
import { CAREERS } from "@/data/careers";
import { evaluate } from "@/lib/eligibility";
import { ExternalLink, CheckCircle2, XCircle, HelpCircle, ShieldCheck, Bookmark, BookmarkCheck, GitCompareArrows } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/programmes/$slug")({
  loader: ({ params }) => {
    const programme = PROGRAMMES.find((p) => p.slug === params.slug);
    if (!programme) throw notFound();
    return { programme };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Programme not found — NjiaYangu" }, { name: "robots", content: "noindex" }] };
    }
    const { programme } = loaderData;
    const inst = INSTITUTIONS.find((i) => i.id === programme.institutionId);
    return {
      meta: [
        { title: `${programme.name.en} — ${inst?.name} — NjiaYangu` },
        { name: "description", content: `${programme.name.en} at ${inst?.name}. ${programme.overview.en.slice(0, 140)}` },
        { property: "og:title", content: `${programme.name.en} — ${inst?.name}` },
        { property: "og:description", content: programme.overview.en.slice(0, 200) },
      ],
    };
  },
  notFoundComponent: () => (
    <AppShell><div className="container-page py-16 text-center text-muted-foreground">Programme not found. <Link to="/programmes" className="text-brand">Browse all →</Link></div></AppShell>
  ),
  component: DetailPage,
});

function DetailPage() {
  const { programme } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const { profile, saved, toggleSaved, compare, toggleCompare } = useStore();
  const institution = INSTITUTIONS.find((i) => i.id === programme.institutionId)!;
  const campus = institution.campuses.find((c) => c.id === programme.campusId)!;
  const eligibility = profile.academics ? evaluate(programme, profile.academics) : undefined;
  const careers = CAREERS.filter((c) => programme.careerIds.includes(c.id));
  const related = PROGRAMMES.filter((p) => p.id !== programme.id && p.category === programme.category).slice(0, 3);
  const isSaved = saved.includes(programme.id);
  const inCompare = compare.includes(programme.id);

  return (
    <AppShell>
      <section className="container-page py-6 sm:py-10">
        <Link to="/programmes" className="text-sm text-brand">← {t("nav.programmes")}</Link>
        <div className="mt-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">{institution.name} • {campus.name}</div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold">{programme.name[lang]}</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">{programme.overview[lang]}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toggleSaved(programme.id)} className="inline-flex items-center gap-1 h-11 px-3 rounded-md border">
              {isSaved ? <BookmarkCheck className="h-4 w-4 text-brand" /> : <Bookmark className="h-4 w-4" />}
              <span className="text-sm">{isSaved ? t("card.saved") : t("card.save")}</span>
            </button>
            <button onClick={() => toggleCompare(programme.id)} className={cn("inline-flex items-center gap-1 h-11 px-3 rounded-md border text-sm", inCompare && "border-brand text-brand bg-accent")}>
              <GitCompareArrows className="h-4 w-4" /> {t("card.compare")}
            </button>
          </div>
        </div>

        {eligibility && (
          <div className="mt-6 rounded-xl border bg-card p-4 sm:p-5">
            <div className="text-sm font-medium">
              {lang === "en" ? "Your eligibility" : "Ustahili wako"}
            </div>
            <div className="mt-2">
              <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                eligibility.status === "ELIGIBLE" && "badge-eligible",
                eligibility.status === "POTENTIALLY_ELIGIBLE" && "badge-potential",
                eligibility.status === "NOT_ELIGIBLE" && "badge-not",
                eligibility.status === "INCOMPLETE_INFORMATION" && "badge-incomplete",
              )}>
                {t(`eligibility.${eligibility.status}`)}
              </span>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
              <div>
                <div className="text-xs font-medium text-success mb-1 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> {lang === "en" ? "Passed" : "Umefikisha"}</div>
                <ul className="space-y-1 text-muted-foreground">
                  {eligibility.passed.length === 0 && <li>—</li>}
                  {eligibility.passed.map((p, i) => <li key={i}>• {p}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-xs font-medium text-destructive mb-1 flex items-center gap-1"><XCircle className="h-3.5 w-3.5" /> {lang === "en" ? "Not met" : "Hayajatimizwa"}</div>
                <ul className="space-y-1 text-muted-foreground">
                  {eligibility.failed.length === 0 && <li>—</li>}
                  {eligibility.failed.map((p, i) => <li key={i}>• {p}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-xs font-medium text-info mb-1 flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5" /> {lang === "en" ? "Missing info" : "Taarifa zinazokosekana"}</div>
                <ul className="space-y-1 text-muted-foreground">
                  {eligibility.missing.length === 0 && <li>—</li>}
                  {eligibility.missing.map((p, i) => <li key={i}>• {p}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}

        {!eligibility && (
          <div className="mt-6 rounded-xl border bg-accent p-4 text-sm">
            <Link to="/find-my-courses" className="text-brand font-medium">
              {lang === "en" ? "Enter your grades to check eligibility →" : "Ingiza alama zako kuangalia ustahili →"}
            </Link>
          </div>
        )}

        {/* Details grid */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-4">
            <div className="text-xs text-muted-foreground">{t("card.duration")}</div>
            <div className="text-lg font-semibold">{programme.durationYears} yrs</div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="text-xs text-muted-foreground">{lang === "en" ? "Tuition (approx.)" : "Ada (takriban)"}</div>
            <div className="text-lg font-semibold">TZS {programme.tuition.amount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{programme.tuition.note[lang]}</div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="text-xs text-muted-foreground">{t("card.deadline")}</div>
            <div className="text-lg font-semibold">{new Date(programme.applicationDeadline).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-4">
            <h2 className="font-semibold">{lang === "en" ? "Entry requirements" : "Masharti ya kujiunga"}</h2>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>• {lang === "en" ? "Minimum principal passes" : "Idadi ya chini ya principal passes"}: {programme.rule.minPrincipalPasses}</li>
              <li>• {lang === "en" ? "Minimum points (top 2)" : "Alama za chini (mbili bora)"}: {programme.rule.minPoints}</li>
              {programme.rule.requiredSubjects.length > 0 && <li>• {lang === "en" ? "Required subjects" : "Masomo yanayohitajika"}: {programme.rule.requiredSubjects.join(", ")}</li>}
              {programme.rule.alternativeSubjects?.map((g, i) => <li key={i}>• {lang === "en" ? "At least one of" : "Angalau moja kati ya"}: {g.join(" / ")}</li>)}
              {programme.rule.minSubjectGrade && Object.entries(programme.rule.minSubjectGrade).map(([s, g]) => (
                <li key={s}>• {lang === "en" ? "Minimum grade in" : "Alama ya chini katika"} {s}: {g}</li>
              ))}
              {programme.rule.oLevel?.map((o, i) => <li key={i}>• O-Level {o.subject}: {o.minGrade}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <h2 className="font-semibold">{lang === "en" ? "Application" : "Maombi"}</h2>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>• {lang === "en" ? "Opens" : "Yafunguliwa"}: {new Date(programme.applicationOpens).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB")}</li>
              <li>• {t("card.deadline")}: {new Date(programme.applicationDeadline).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB")}</li>
              <li>• {t("card.heslb")}: {programme.heslbEligible ? (lang === "en" ? "Yes" : "Ndiyo") : (lang === "en" ? "No" : "Hapana")}</li>
            </ul>
            <div className="mt-3">
              <div className="text-xs text-muted-foreground mb-1">{lang === "en" ? "Required documents" : "Nyaraka zinazohitajika"}</div>
              <ul className="text-sm text-muted-foreground space-y-1">{programme.requiredDocuments.map((d) => <li key={d}>• {d}</li>)}</ul>
            </div>
            <a href={programme.applicationUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 h-11 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium">
              {t("common.apply")} <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Modules / Careers */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-4">
            <h2 className="font-semibold">{lang === "en" ? "What you will study" : "Utakachosoma"}</h2>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">{programme.modules.map((m, i) => <li key={i}>• {m[lang]}</li>)}</ul>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <h2 className="font-semibold">{lang === "en" ? "Career pathways" : "Njia za kikazi"}</h2>
            <ul className="mt-2 text-sm space-y-1">
              {careers.map((c) => (
                <li key={c.id}><Link to="/careers/$id" params={{ id: c.id }} className="text-brand hover:underline">{c.title[lang]}</Link></li>
              ))}
              {careers.length === 0 && <li className="text-muted-foreground">—</li>}
            </ul>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="font-semibold mb-3">{lang === "en" ? "Related programmes" : "Kozi zinazohusiana"}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {related.map((r) => {
                const inst = INSTITUTIONS.find((i) => i.id === r.institutionId);
                return (
                  <Link key={r.id} to="/programmes/$slug" params={{ slug: r.slug }} className="rounded-lg border bg-card p-3 hover:border-brand">
                    <div className="text-sm font-medium">{r.name[lang]}</div>
                    <div className="text-xs text-muted-foreground">{inst?.name}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Verification */}
        <div className="mt-8 rounded-xl border bg-accent p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-brand shrink-0 mt-0.5" />
          <div className="text-sm">
            <div>
              <span className="font-medium">{t("common.official.source")}:</span>{" "}
              <a href={programme.source.url} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                {programme.source.title}
              </a>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t("common.last.verified")}: {new Date(programme.lastVerified).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB")}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{t("disclaimer.short")}</p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
