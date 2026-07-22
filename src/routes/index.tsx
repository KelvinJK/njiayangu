import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { COMBINATIONS } from "@/data/combinations";
import { PROGRAMMES } from "@/data/programmes";
import { INSTITUTIONS } from "@/data/institutions";
import { HESLB_ACADEMIC_YEAR } from "@/data/heslb";
import {
  ArrowRight,
  Bookmark,
  Bell,
  ClipboardCheck,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import heroStudent from "@/assets/hero-student.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NjiaYangu — Discover what to study after Form Six in Tanzania" },
      { name: "description", content: "Enter your Form Six combination and grades to find eligible university programmes, institutions, HESLB guidance and Tanzanian career pathways." },
      { property: "og:title", content: "NjiaYangu — Your path after Form Six" },
      { property: "og:description", content: "Match your combination and grades to verified Tanzanian university programmes and careers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const popular = COMBINATIONS.filter((c) => c.popular).slice(0, 8);
  const heslbYear = HESLB_ACADEMIC_YEAR.split("/")[0];

  return (
    <AppShell>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand/10 via-background to-gold/10">
        {/* Ambient background — brand-tinted, more colorful */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-brand/25 blur-3xl" />
          <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-success/15 blur-3xl" />
        </div>


        <div className="container-page pt-10 pb-14 md:pt-16 md:pb-24">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
            {/* Copy */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                {lang === "en" ? "For Form Six leavers in Tanzania" : "Kwa wahitimu wa Kidato cha Sita Tanzania"}
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-foreground">
                {lang === "en" ? (
                  <>Find the right <span className="text-brand">path</span> after Form Six.</>
                ) : (
                  <>Pata <span className="text-brand">njia</span> sahihi baada ya Kidato cha Sita.</>
                )}
              </h1>

              <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                {lang === "en"
                  ? "Enter your combination and grades. We match you to eligible programmes, institutions, HESLB guidance and career pathways — verified against TCU and NACTE."
                  : "Ingiza mchepuo na alama zako. Tunakulinganisha na kozi, vyuo, mwongozo wa HESLB na njia za kazi — zilizohakikiwa dhidi ya TCU na NACTE."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/find-my-courses"
                  className="inline-flex items-center gap-2 h-12 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Search className="h-4 w-4" /> {t("home.cta.find")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/heslb"
                  className="inline-flex items-center gap-2 h-12 px-5 rounded-full border border-border/70 text-sm font-medium hover:border-foreground/40 transition-colors"
                >
                  <ClipboardCheck className="h-4 w-4" /> {t("home.cta.heslb")}
                </Link>
              </div>

              {/* Trust markers */}
              <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
                <Stat value={`${PROGRAMMES.length}+`} label={lang === "en" ? "Programmes" : "Kozi"} />
                <Stat value={`${INSTITUTIONS.length}`} label={lang === "en" ? "Institutions" : "Vyuo"} />
                <Stat value="TCU · NACTE" label={lang === "en" ? "Verified" : "Zimehakikiwa"} />
              </div>
            </div>

            {/* Hero illustration */}
            <div className="relative order-first md:order-last">
              <div className="relative mx-auto aspect-square w-full max-w-md md:max-w-lg">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand/10 via-transparent to-gold/10" />
                <img
                  src={heroStudent}
                  alt={lang === "en"
                    ? "Illustration of a Tanzanian graduate reading a book with floating academic icons"
                    : "Mchoro wa mhitimu wa Tanzania akisoma kitabu na alama za masomo"}
                  width={1024}
                  height={1024}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="relative z-10 h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(15,23,42,0.15)]"
                />

                {/* Floating card — HESLB */}
                <div className="absolute bottom-2 left-0 md:-left-6 z-20 hidden sm:block">
                  <div className="rounded-2xl border border-border/70 bg-surface/95 px-4 py-3 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.25)] backdrop-blur">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                      {t("home.heslb.deadline")}
                    </div>
                    <div className="mt-1 text-lg font-semibold">30 Sep {heslbYear}</div>
                  </div>
                </div>
                {/* Floating card — Eligible */}
                <div className="absolute top-4 right-0 md:-right-4 z-20 hidden sm:block">
                  <div className="rounded-2xl border border-border/70 bg-surface/95 px-4 py-3 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.25)] backdrop-blur">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      {lang === "en" ? "Match found" : "Ulinganifu"}
                    </div>
                    <div className="mt-1 text-lg font-semibold">PCM · UDSM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── How it works — 4 quiet steps ───────── */}
      <section className="container-page py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {lang === "en" ? "How it works" : "Jinsi inavyofanya kazi"}
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
            {lang === "en" ? "From your results to a plan you can act on." : "Kutoka matokeo yako hadi mpango unaoweza kutumika."}
          </h2>
        </div>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", title: t("home.how.1"), body: t("home.how.1d"), tint: "from-brand/12 to-brand/0 text-brand ring-brand/25" },
            { n: "02", title: t("home.how.2"), body: t("home.how.2d"), tint: "from-success/15 to-success/0 text-success ring-success/25" },
            { n: "03", title: t("home.how.3"), body: t("home.how.3d"), tint: "from-info/15 to-info/0 text-info ring-info/25" },
            { n: "04", title: t("home.how.4"), body: t("home.how.4d"), tint: "from-gold/20 to-gold/0 text-gold-foreground ring-gold/30" },
          ].map((s) => (
            <li key={s.n} className={`relative rounded-2xl border bg-gradient-to-br ${s.tint} bg-surface p-5 ring-1`}>
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface border font-mono text-sm font-semibold`}>{s.n}</div>
              <div className="mt-3 text-base font-semibold text-foreground">{s.title}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>


      {/* ───────── Popular combinations ───────── */}
      <section className="border-t border-border/60 bg-gradient-to-b from-brand/8 via-muted/30 to-background">

        <div className="container-page py-16 md:py-24">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {lang === "en" ? "Start here" : "Anza hapa"}
              </div>
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                {t("home.popular")}
              </h2>
            </div>
            <Link to="/find-my-courses" className="text-sm font-medium text-brand inline-flex items-center gap-1">
              {lang === "en" ? "See all combinations" : "Ona michepuo yote"} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {popular.map((c, i) => {
              const tints = [
                "from-brand/10 to-transparent border-brand/30 hover:border-brand text-brand",
                "from-success/12 to-transparent border-success/30 hover:border-success text-success",
                "from-gold/15 to-transparent border-gold/40 hover:border-gold text-gold-foreground",
                "from-info/12 to-transparent border-info/30 hover:border-info text-info",
              ];
              const tint = tints[i % tints.length];
              return (
                <Link
                  key={c.code}
                  to="/find-my-courses"
                  search={{ combination: c.code }}
                  className={`group rounded-2xl border bg-gradient-to-br ${tint} bg-surface p-4 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold">{c.code}</span>
                    <Sparkles className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-2 text-sm text-foreground/80 line-clamp-2">
                    {c[lang]}
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* ───────── Sign-in benefits (only when signed-out) ───────── */}
      {!user && (
        <section className="container-page py-16 md:py-24">
          <div className="rounded-3xl border border-border/70 bg-gradient-to-br from-brand/5 via-surface to-gold/5 p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-brand">
                  {lang === "en" ? "Free account" : "Akaunti bure"}
                </div>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                  {lang === "en"
                    ? "Save your progress. Never miss a deadline."
                    : "Hifadhi maendeleo yako. Usikose tarehe muhimu."}
                </h2>
                <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-md">
                  {lang === "en"
                    ? "Create a free account to sync your saved programmes and HESLB checklist across devices, and get reminders before deadlines."
                    : "Fungua akaunti bure kusawazisha kozi ulizohifadhi na orodha ya HESLB kwenye vifaa, na upate vikumbusho kabla ya tarehe za mwisho."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90"
                  >
                    {t("auth.createAccount")} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-border/70 text-sm font-medium hover:border-foreground/40"
                  >
                    {t("auth.signIn")}
                  </Link>
                </div>
              </div>

              <ul className="grid gap-3 text-sm">
                <Benefit icon={Bookmark} title={lang === "en" ? "Save & compare programmes" : "Hifadhi na linganisha kozi"} body={lang === "en" ? "Bookmark programmes and revisit them anytime." : "Hifadhi kozi na uzirudie muda wowote."} />
                <Benefit icon={ClipboardCheck} title={lang === "en" ? "Track HESLB readiness" : "Fuatilia utayari wa HESLB"} body={lang === "en" ? "Your checklist syncs across your phone and computer." : "Orodha yako inasawazishwa kwenye simu na kompyuta."} />
                <Benefit icon={Bell} title={lang === "en" ? "Deadline notifications" : "Arifa za tarehe za mwisho"} body={lang === "en" ? "In-app and email reminders for HESLB and applications." : "Vikumbusho vya HESLB na maombi kupitia programu na barua pepe."} />
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ───────── Verification note ───────── */}
      <section className="container-page pb-16 md:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <ShieldCheck className="h-5 w-5 text-brand mx-auto" />
          <p className="mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
            {t("home.official")}
          </p>
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0">
      <div className="text-lg md:text-xl font-semibold tracking-tight truncate">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground truncate">{label}</div>
    </div>
  );
}

function Benefit({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-brand/10 text-brand grid place-items-center">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="font-medium">{title}</div>
        <div className="text-muted-foreground text-[13px]">{body}</div>
      </div>
    </li>
  );
}
