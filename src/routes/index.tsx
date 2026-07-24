import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import {
  ArrowRight,
  Bookmark,
  Bell,
  ClipboardCheck,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import heroStudent from "@/assets/hero-student.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://njiayangu.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://njiayangu.lovable.app/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const primaryCta = user ? "/find-my-courses" : "/auth";
  const primaryLabel = user
    ? t("home.cta.find")
    : t("auth.createAccount");

  return (
    <AppShell>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand/10 via-background to-gold/10">
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
                  ? "Create an account, then unlock 5 personalized programme-match generations for a one-time 1,000 TZS payment — matched to your combination and grades and verified against TCU and NACTE."
                  : "Fungua akaunti, kisha lipa TZS 1,000 mara moja kupata migao 5 ya kozi zinazokufaa — kwa mujibu wa mchepuo na alama zako, zilizohakikiwa dhidi ya TCU na NACTE."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={primaryCta}
                  preload="viewport"
                  className="inline-flex items-center gap-2 h-12 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {user ? null : <LogIn className="h-4 w-4" aria-hidden />}
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                {!user && (
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 h-12 px-5 rounded-full border border-border/70 text-sm font-medium hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t("auth.signIn")}
                  </Link>
                )}
              </div>
            </div>

            {/* Hero illustration */}
            <div className="relative md:order-last">
              <div className="relative mx-auto aspect-square w-full max-w-[16rem] sm:max-w-sm md:max-w-lg">
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
              </div>
            </div>
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
                  {lang === "en" ? "1,000 TZS · 5 generations" : "TZS 1,000 · Migao 5"}
                </div>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                  {lang === "en"
                    ? "Sign in, pay once, unlock every feature."
                    : "Ingia, lipa mara moja, fungua vipengele vyote."}
                </h2>
                <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-md">
                  {lang === "en"
                    ? "Create your NjiaYangu account, then pay a one-time 1,000 TZS via Snippe to unlock 5 programme-match generations plus the HESLB checklist, career explorer, saved comparisons and deadline reminders. Top up any time to get 5 more."
                    : "Fungua akaunti ya NjiaYangu, kisha lipa TZS 1,000 mara moja kupitia Snippe kupata migao 5 ya kozi pamoja na orodha ya HESLB, kivinjari cha kazi, mlinganisho uliohifadhiwa na vikumbusho vya tarehe. Ongeza malipo wakati wowote kupata migao 5 zaidi."}
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
      <section className="container-page pb-8 md:pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <ShieldCheck className="h-5 w-5 text-brand mx-auto" />
          <p className="mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
            {t("home.official")}
          </p>
        </div>
      </section>

      {/* ───────── Legal & Compliance Footer ───────── */}
      <footer className="border-t border-border/60 bg-surface/50">
        <div className="container-page py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} NjiaYangu. {lang === "en" ? "All rights reserved." : "Haki zote zimehifadhiwa."}
          </div>
          <div className="flex gap-4 text-xs font-medium text-muted-foreground">
            <Link to="/security" className="hover:text-foreground transition-colors">
              {lang === "en" ? "Security & Compliance" : "Usalama na Makubaliano"}
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              {lang === "en" ? "Privacy Policy" : "Sera ya Faragha"}
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              {lang === "en" ? "Terms of Service" : "Vigezo na Masharti"}
            </Link>
          </div>
        </div>
      </footer>
    </AppShell>
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
