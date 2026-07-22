import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { PROGRAMMES } from "@/data/programmes";
import { INSTITUTIONS } from "@/data/institutions";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { HESLB_ACADEMIC_YEAR } from "@/data/heslb";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Application Calendar — NjiaYangu" },
      { name: "description", content: "Upcoming programme application windows, HESLB deadlines and scholarship dates for Tanzanian Form Six leavers." },
      { property: "og:title", content: "Application Calendar — NjiaYangu" },
      { property: "og:description", content: "Upcoming Tanzanian university and scholarship deadlines." },
    ],
  }),
  component: Page,
});

interface Ev { date: string; label: string; kind: "programme" | "scholarship" | "heslb"; url?: string; }

function Page() {
  const { t, lang } = useI18n();

  const events: Ev[] = [
    ...PROGRAMMES.flatMap((p) => {
      const inst = INSTITUTIONS.find((i) => i.id === p.institutionId);
      return [
        { date: p.applicationOpens, label: `${lang === "en" ? "Opens" : "Yafunguliwa"}: ${p.name[lang]} — ${inst?.short}`, kind: "programme" as const, url: `/programmes/${p.slug}` },
        { date: p.applicationDeadline, label: `${t("card.deadline")}: ${p.name[lang]} — ${inst?.short}`, kind: "programme" as const, url: `/programmes/${p.slug}` },
      ];
    }),
    ...SCHOLARSHIPS.flatMap((s) => [
      { date: s.opens, label: `${lang === "en" ? "Scholarship opens" : "Ufadhili wafunguliwa"}: ${s.name[lang]}`, kind: "scholarship" as const },
      { date: s.deadline, label: `${lang === "en" ? "Scholarship deadline" : "Tarehe ya ufadhili"}: ${s.name[lang]}`, kind: "scholarship" as const },
    ]),
    { date: `${HESLB_ACADEMIC_YEAR.split("/")[0]}-07-01`, label: "HESLB OLAMS application window opens (expected)", kind: "heslb" as const },
    { date: `${HESLB_ACADEMIC_YEAR.split("/")[0]}-09-30`, label: "HESLB application deadline (expected)", kind: "heslb" as const },
  ]
    .filter((e) => new Date(e.date) >= new Date("2026-01-01"))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <AppShell>
      <section className="container-page py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold">{t("nav.calendar")}</h1>
        <p className="mt-2 text-muted-foreground text-sm">{lang === "en" ? "Upcoming application, HESLB and scholarship dates." : "Tarehe za maombi, HESLB na ufadhili zinazokuja."}</p>
        <ol className="mt-6 divide-y border rounded-xl bg-card">
          {events.map((e, i) => (
            <li key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 sm:p-4">
              <div className="w-32 text-sm font-medium text-brand">{new Date(e.date).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
              <div className="flex-1 text-sm">{e.label}</div>
              <span className="text-xs px-2 py-0.5 rounded-full border capitalize">{e.kind}</span>
              {e.url && <Link to={e.url} className="text-sm text-brand">→</Link>}
            </li>
          ))}
        </ol>
      </section>
    </AppShell>
  );
}
