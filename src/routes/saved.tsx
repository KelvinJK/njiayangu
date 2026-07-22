import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { PROGRAMMES } from "@/data/programmes";
import { INSTITUTIONS } from "@/data/institutions";
import { evaluateEligibility } from "@/lib/eligibility";
import {
  Bookmark,
  BookmarkX,
  GitCompareArrows,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved programmes — NjiaYangu" },
      { name: "description", content: "Review, remove and compare the university programmes you bookmarked on NjiaYangu." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Saved programmes — NjiaYangu" },
      { property: "og:description", content: "Manage your bookmarked programmes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { t, lang } = useI18n();
  const { user, loading } = useAuth();
  const { saved, toggleSaved, compare, toggleCompare, profile } = useStore();

  if (loading) return <AppShell><div className="container-page py-16"/></AppShell>;

  if (!user) {
    return (
      <AppShell>
        <div className="container-page py-16 max-w-md mx-auto text-center">
          <ShieldCheck className="h-10 w-10 text-brand mx-auto"/>
          <h1 className="mt-3 text-2xl font-semibold">{t("account.signInRequired")}</h1>
          <p className="mt-2 text-muted-foreground">{t("account.signInRequiredSub")}</p>
          <div className="mt-6 flex gap-2 justify-center">
            <Button asChild><Link to="/auth">{t("auth.signIn")}</Link></Button>
            <Button variant="outline" asChild><Link to="/">{t("auth.gotoHome")}</Link></Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const savedProgrammes = saved
    .map((id) => PROGRAMMES.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <AppShell>
      {/* Colorful gradient header */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-brand/10 via-surface to-gold/10">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-24 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <div className="container-page relative py-10 md:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
            <Bookmark className="h-3.5 w-3.5"/> {t("saved.title")}
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            {t("saved.title")}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">{t("saved.subtitle")}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface border px-3 py-1.5 text-sm font-medium">
              <span className="text-brand font-semibold">{savedProgrammes.length}</span> {t("saved.count")}
            </span>
            {compare.length > 0 && (
              <Button asChild className="rounded-full">
                <Link to="/compare">
                  <GitCompareArrows className="h-4 w-4 mr-1.5"/>
                  {t("saved.compareAll")} ({compare.length})
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/programmes">
                {t("saved.browse")} <ArrowRight className="h-4 w-4 ml-1.5"/>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container-page py-8 md:py-12">
        {savedProgrammes.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-surface p-10 md:p-16 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-brand/10 text-brand grid place-items-center">
              <Bookmark className="h-6 w-6"/>
            </div>
            <h2 className="mt-4 text-xl font-semibold">{t("saved.empty")}</h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">{t("saved.emptySub")}</p>
            <div className="mt-6 flex gap-2 justify-center flex-wrap">
              <Button asChild><Link to="/programmes">{t("saved.browse")}</Link></Button>
              <Button asChild variant="outline"><Link to="/find-my-courses">{t("nav.find")}</Link></Button>
            </div>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedProgrammes.map((programme, idx) => {
              const institution = INSTITUTIONS.find((i) => i.id === programme.institutionId);
              const campus = institution?.campuses.find((c) => c.id === programme.campusId);
              const inCompare = compare.includes(programme.id);
              const eligibility = profile.academics ? evaluateEligibility(programme, profile.academics) : undefined;
              // Rotate accent color per card for visual rhythm
              const accents = [
                { ring: "ring-brand/20", chip: "bg-brand/10 text-brand", grad: "from-brand/8 to-transparent" },
                { ring: "ring-success/20", chip: "bg-success/10 text-success", grad: "from-success/8 to-transparent" },
                { ring: "ring-gold/25", chip: "bg-gold/15 text-gold-foreground", grad: "from-gold/10 to-transparent" },
                { ring: "ring-info/20", chip: "bg-info/10 text-info", grad: "from-info/8 to-transparent" },
              ];
              const a = accents[idx % accents.length];

              return (
                <li
                  key={programme.id}
                  className={cn(
                    "group relative rounded-2xl border bg-surface p-5 shadow-sm ring-1 ring-transparent hover:shadow-md transition-all",
                    a.ring,
                  )}
                >
                  <div className={cn("absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r", a.grad, "opacity-70")}/>

                  <div className="flex items-start justify-between gap-2">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide", a.chip)}>
                      {programme.category}
                    </span>
                    <button
                      onClick={() => toggleSaved(programme.id)}
                      className="text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1 -m-1"
                      aria-label={`${t("saved.remove")} ${programme.name[lang]}`}
                    >
                      <BookmarkX className="h-4 w-4"/>
                    </button>
                  </div>

                  <Link
                    to="/programmes/$slug"
                    params={{ slug: programme.slug }}
                    className="mt-3 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                  >
                    <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                      {programme.name[lang]}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {institution?.name}
                    </p>
                  </Link>

                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5"/> {programme.durationYears}y</div>
                    <div className="flex items-center gap-1.5 truncate"><MapPin className="h-3.5 w-3.5"/> {campus?.region}</div>
                    <div className="flex items-center gap-1.5 col-span-2"><Calendar className="h-3.5 w-3.5"/>
                      {new Date(programme.applicationDeadline).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </dl>

                  {eligibility && (
                    <div className="mt-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                        eligibility.status === "ELIGIBLE" && "badge-eligible",
                        eligibility.status === "POTENTIALLY_ELIGIBLE" && "badge-potential",
                        eligibility.status === "NOT_ELIGIBLE" && "badge-not",
                        eligibility.status === "INCOMPLETE_INFORMATION" && "badge-incomplete",
                      )}>
                        {t(`eligibility.${eligibility.status}`)}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Link
                      to="/programmes/$slug"
                      params={{ slug: programme.slug }}
                      className="flex-1 inline-flex items-center justify-center gap-1 h-9 rounded-full bg-brand text-brand-foreground text-xs font-medium hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t("card.details")} <ArrowRight className="h-3.5 w-3.5"/>
                    </Link>
                    <button
                      onClick={() => toggleCompare(programme.id)}
                      disabled={!inCompare && compare.length >= 5}
                      aria-pressed={inCompare}
                      className={cn(
                        "inline-flex items-center gap-1 h-9 px-3 rounded-full border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        inCompare ? "border-brand text-brand bg-brand/10" : "hover:bg-muted",
                        !inCompare && compare.length >= 5 && "opacity-40 cursor-not-allowed",
                      )}
                    >
                      <GitCompareArrows className="h-3.5 w-3.5"/>
                      {inCompare ? t("saved.inCompare") : t("card.compare")}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
