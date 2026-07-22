import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { INSTITUTIONS } from "@/data/institutions";
import { PROGRAMMES } from "@/data/programmes";
import { MapPin, Globe, Landmark } from "lucide-react";

export const Route = createFileRoute("/institutions")({
  head: () => ({
    meta: [
      { title: "University Institutions in Tanzania — NjiaYangu" },
      { name: "description", content: "Browse Tanzanian universities and colleges including UDSM, SUA, MUHAS, Mzumbe and Ardhi, with programme counts, regions and official links." },
      { property: "og:title", content: "Tanzanian Universities & Colleges — NjiaYangu" },
      { property: "og:description", content: "Directory of Tanzanian universities and colleges offering undergraduate programmes." },
      { property: "og:url", content: "https://njiayangu.lovable.app/institutions" },
    ],
    links: [{ rel: "canonical", href: "https://njiayangu.lovable.app/institutions" }],
  }),
  component: InstitutionsPage,
});

function InstitutionsPage() {
  const { t, lang } = useI18n();
  return (
    <AppShell>
      <section className="container-page py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold">{t("nav.institutions")}</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          {lang === "en" ? `${INSTITUTIONS.length} institutions in the current dataset.` : `Vyuo ${INSTITUTIONS.length} kwenye takwimu za sasa.`}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INSTITUTIONS.map((i) => {
            const progCount = PROGRAMMES.filter((p) => p.institutionId === i.id).length;
            return (
              <div key={i.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold">{i.name}</h2>
                    <div className="text-xs text-muted-foreground">{i.short}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full border">
                    {i.type === "public" ? "Public" : "Private"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{i.about[lang]}</p>
                <dl className="mt-3 text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {i.region}</div>
                  <div className="flex items-center gap-1"><Landmark className="h-3.5 w-3.5" /> {i.campuses.length} campus{i.campuses.length > 1 ? "es" : ""}</div>
                  <div className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> <a href={i.website} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{i.website.replace(/^https?:\/\//, "")}</a></div>
                </dl>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs">{progCount} programmes</span>
                  <Link to="/programmes" search={{ q: i.short }} className="text-sm text-brand">
                    Programmes →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
