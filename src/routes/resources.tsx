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
    {
      icon: ClipboardCheck,
      title: "HESLB — OLAMS loan application portal",
      url: "https://olams.heslb.go.tz/",
      cta: { en: "Open OLAMS login", sw: "Fungua OLAMS" },
      note: { en: "Direct login and application page for HESLB student loans.", sw: "Ukurasa wa moja kwa moja wa kuingia na kuomba mkopo wa HESLB." },
    },
    {
      icon: Landmark,
      title: "TCU — Undergraduate admission portal (OAS)",
      url: "https://oas.tcu.go.tz/",
      cta: { en: "Open TCU OAS", sw: "Fungua TCU OAS" },
      note: { en: "Central admission system for degree programmes in Tanzania.", sw: "Mfumo wa pamoja wa udahili wa shahada Tanzania." },
    },
    {
      icon: BookOpen,
      title: "NACTE — Online application system",
      url: "https://oas.nacte.go.tz/",
      cta: { en: "Open NACTE OAS", sw: "Fungua NACTE OAS" },
      note: { en: "Applications for diploma and technical programmes.", sw: "Maombi ya stashahada na kozi za ufundi." },
    },
    {
      icon: FileText,
      title: "NECTA — Results portal (matokeo)",
      url: "https://matokeo.necta.go.tz/",
      cta: { en: "Check results", sw: "Angalia matokeo" },
      note: { en: "Official CSEE / ACSEE results and certificate verification.", sw: "Matokeo rasmi ya CSEE / ACSEE na uthibitisho wa vyeti." },
    },
  ];
  return (
    <AppShell>
      <section className="container-page py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold">Resources</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          {lang === "en"
            ? "Direct links to the exact pages you need — application portals and results, not just homepages."
            : "Viungo vya moja kwa moja kwenye kurasa unazohitaji — portal za maombi na matokeo, si kurasa kuu tu."}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border bg-card p-4 hover:border-brand flex gap-3"
            >
              <r.icon className="h-6 w-6 text-brand shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{r.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{r.note[lang]}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand">
                  {r.cta[lang]} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <div className="mt-1 text-xs text-muted-foreground break-all">{r.url}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 rounded-xl border bg-accent p-4 text-sm">
          <div className="font-medium">
            {lang === "en" ? "Stuck on HESLB login?" : "Umekwama kuingia HESLB?"}
          </div>
          <p className="mt-1 text-muted-foreground">
            {lang === "en"
              ? "Read our step-by-step OLAMS guide — registration, NECTA verification and password reset."
              : "Soma mwongozo wetu wa OLAMS — usajili, uhakiki wa NECTA na kubadilisha nenosiri."}
          </p>
          <Link to="/resources/heslb-portal-guide" className="mt-2 inline-block text-brand font-medium">
            → {lang === "en" ? "Open the HESLB portal guide" : "Fungua mwongozo wa OLAMS"}
          </Link>
        </div>

        <div className="mt-6 text-sm">
          <Link to="/find-my-courses" className="text-brand font-medium">
            → {lang === "en" ? "Start your programme match" : "Anza kutafuta kozi zako"}
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
