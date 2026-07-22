import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { BookOpen, FileText, Landmark, ClipboardCheck, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — NjiaYangu" },
      { name: "description", content: "Official Tanzanian education resources: TCU, NACTE, HESLB, NECTA, and study guidance links." },
      { property: "og:title", content: "Resources — NjiaYangu" },
      { property: "og:description", content: "Official Tanzanian education resources and links." },
    ],
  }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const items = [
    { icon: Landmark, title: "TCU — Tanzania Commission for Universities", url: "https://www.tcu.go.tz", note: { en: "Central admission and undergraduate guidebook.", sw: "Udahili wa pamoja na mwongozo wa shahada za kwanza." } },
    { icon: BookOpen, title: "NACTE — National Council for Technical Education", url: "https://www.nacte.go.tz", note: { en: "Diploma / technical programme guidelines.", sw: "Miongozo ya stashahada na kozi za ufundi." } },
    { icon: ClipboardCheck, title: "HESLB — Higher Education Students' Loans Board", url: "https://www.heslb.go.tz", note: { en: "Loan applications, means testing and payments.", sw: "Maombi ya mkopo na malipo." } },
    { icon: FileText, title: "NECTA — Examination results", url: "https://www.necta.go.tz", note: { en: "Certificate and results verification.", sw: "Uthibitisho wa vyeti na matokeo." } },
  ];
  return (
    <AppShell>
      <section className="container-page py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold">Resources</h1>
        <p className="mt-2 text-muted-foreground text-sm">{lang === "en" ? "Official Tanzanian sources referenced by NjiaYangu." : "Vyanzo rasmi vinavyorejelewa na NjiaYangu."}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((r) => (
            <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border bg-card p-4 hover:border-brand flex gap-3">
              <r.icon className="h-6 w-6 text-brand shrink-0" />
              <div>
                <div className="font-medium flex items-center gap-1">{r.title} <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /></div>
                <div className="mt-1 text-sm text-muted-foreground">{r.note[lang]}</div>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-8 text-sm">
          <Link to="/find-my-courses" className="text-brand font-medium">→ {lang === "en" ? "Start your programme match" : "Anza kutafuta kozi zako"}</Link>
        </div>
      </section>
    </AppShell>
  );
}
