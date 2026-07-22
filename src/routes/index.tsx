import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { COMBINATIONS } from "@/data/combinations";
import { CAREER_CATEGORIES } from "@/data/careers";
import { PROGRAMMES } from "@/data/programmes";
import { INSTITUTIONS } from "@/data/institutions";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { HESLB_ACADEMIC_YEAR } from "@/data/heslb";
import { Sparkles, GraduationCap, Landmark, Search, ClipboardCheck, ChevronRight, AlertCircle, Calendar, ShieldCheck } from "lucide-react";
import { ProgrammeCard } from "@/components/site/ProgrammeCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NjiaYangu — Discover what to study after Form Six in Tanzania" },
      { name: "description", content: "Enter your Form Six combination and grades to find eligible university programmes, institutions, HESLB guidance and Tanzanian career pathways." },
      { property: "og:title", content: "NjiaYangu — Your path after Form Six" },
      { property: "og:description", content: "Match your combination and grades to verified Tanzanian university programmes and careers." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, lang } = useI18n();
  const recentlyVerified = [...PROGRAMMES].sort((a, b) => b.lastVerified.localeCompare(a.lastVerified)).slice(0, 4);
  const openScholarships = SCHOLARSHIPS.filter((s) => s.status === "open").slice(0, 3);

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand to-brand/90 text-brand-foreground">
        <div className="container-page py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              {lang === "en" ? "Guidance for Form Six leavers in Tanzania" : "Mwongozo kwa wahitimu wa Kidato cha Sita Tanzania"}
            </div>
            <h1 className="mt-4 text-3xl sm:text-5xl font-semibold leading-tight tracking-tight">
              {t("home.hero.title")}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
              {t("home.hero.sub")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/find-my-courses"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-md bg-gold text-gold-foreground font-medium hover:opacity-90"
              >
                <Search className="h-4 w-4" /> {t("home.cta.find")}
              </Link>
              <Link
                to="/heslb"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-md border border-white/30 text-white hover:bg-white/10"
              >
                <ClipboardCheck className="h-4 w-4" /> {t("home.cta.heslb")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Alerts + HESLB deadline */}
      <section className="container-page mt-8 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-xl border bg-card p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium">{t("home.alerts")}</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {lang === "en"
                ? "TCU central admission window is expected to open in July 2026. HESLB loan applications typically open in July as well."
                : "Dirisha la udahili wa TCU linatarajiwa kufunguliwa Julai 2026. Maombi ya mkopo wa HESLB pia hufunguliwa Julai."}
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-gold/10 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4 text-gold" /> {t("home.heslb.deadline")}
          </div>
          <div className="mt-2 text-2xl font-semibold">30 Sep {HESLB_ACADEMIC_YEAR.split("/")[0]}</div>
          <Link to="/heslb" className="mt-2 inline-flex items-center gap-1 text-sm text-brand font-medium">
            {t("home.cta.heslb")} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Popular combinations */}
      <section className="container-page mt-12">
        <h2 className="text-xl font-semibold">{t("home.popular")}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {COMBINATIONS.filter((c) => c.popular).map((c) => (
            <Link
              key={c.code}
              to="/find-my-courses"
              search={{ combination: c.code }}
              className="inline-flex items-center gap-2 px-3 h-10 rounded-full border bg-surface hover:border-brand hover:text-brand text-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="font-medium">{c.code}</span>
              <span className="text-muted-foreground">— {c[lang]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Career categories */}
      <section className="container-page mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">{t("home.careers")}</h2>
          <Link to="/careers" className="text-sm text-brand">View all →</Link>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {CAREER_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to="/careers"
              search={{ category: cat }}
              className="rounded-xl border bg-card p-4 hover:border-brand hover:shadow-sm transition"
            >
              <div className="text-sm font-medium">{cat}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {PROGRAMMES.filter((p) => p.category === cat).length} programmes
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently verified */}
      <section className="container-page mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">{t("home.verified")}</h2>
          <Link to="/programmes" className="text-sm text-brand">View all →</Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recentlyVerified.map((p) => (
            <ProgrammeCard key={p.id} programme={p} />
          ))}
        </div>
      </section>

      {/* Scholarships */}
      <section className="container-page mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">{t("home.scholarships")}</h2>
          <Link to="/scholarships" className="text-sm text-brand">View all →</Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {openScholarships.map((s) => (
            <div key={s.id} className="rounded-xl border bg-card p-4">
              <div className="text-xs text-muted-foreground">{s.provider}</div>
              <div className="mt-1 font-medium">{s.name[lang]}</div>
              <div className="mt-3 text-xs text-muted-foreground">
                {t("card.deadline")}: {new Date(s.deadline).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <Link to="/scholarships" className="mt-3 inline-flex text-sm text-brand font-medium">
                View →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container-page mt-14">
        <h2 className="text-xl font-semibold">{t("home.how")}</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            { icon: GraduationCap, title: t("home.how.1"), body: t("home.how.1d") },
            { icon: Search, title: t("home.how.2"), body: t("home.how.2d") },
            { icon: Landmark, title: t("home.how.3"), body: t("home.how.3d") },
            { icon: ClipboardCheck, title: t("home.how.4"), body: t("home.how.4d") },
          ].map((s, i) => (
            <li key={i} className="rounded-xl border bg-card p-4">
              <div className="h-9 w-9 rounded-md bg-brand/10 text-brand flex items-center justify-center">
                <s.icon className="h-4 w-4" />
              </div>
              <div className="mt-3 text-sm font-semibold">{i + 1}. {s.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Verification statement */}
      <section className="container-page mt-14 mb-4">
        <div className="rounded-xl border bg-accent p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div className="text-sm text-foreground">
              <div className="font-medium">
                {lang === "en" ? "Official information & verification" : "Taarifa rasmi na uthibitisho"}
              </div>
              <p className="mt-1 text-muted-foreground">{t("home.official")}</p>
              <p className="mt-1 text-muted-foreground">
                {INSTITUTIONS.length} {lang === "en" ? "institutions in the current dataset" : "vyuo kwenye takwimu za sasa"} •
                {" "}{PROGRAMMES.length} {lang === "en" ? "programmes" : "kozi"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
