import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/scholarships")({
  head: () => ({
    meta: [
      { title: "Scholarships — NjiaYangu" },
      { name: "description", content: "Scholarships and financing schemes for Tanzanian students: HESLB, Mastercard Foundation, MOFCOM, Commonwealth and more." },
      { property: "og:title", content: "Scholarships — NjiaYangu" },
      { property: "og:description", content: "Financing opportunities for Tanzanian students." },
    ],
  }),
  component: Page,
});

const statusMeta = {
  open: { en: "Open now", sw: "Inapatikana sasa", cls: "badge-eligible" },
  upcoming: { en: "Upcoming", sw: "Inakuja", cls: "badge-potential" },
  closed: { en: "Closed", sw: "Imefungwa", cls: "badge-not" },
} as const;

function Page() {
  const { t, lang } = useI18n();
  return (
    <AppShell>
      <section className="container-page py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold">{t("nav.scholarships")}</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCHOLARSHIPS.map((s) => (
            <div key={s.id} className="rounded-xl border bg-card p-4 flex flex-col">
              <div className="flex items-start justify-between">
                <div className="text-xs text-muted-foreground">{s.provider}</div>
                <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-medium", statusMeta[s.status].cls)}>
                  {statusMeta[s.status][lang]}
                </span>
              </div>
              <h2 className="mt-1 font-semibold">{s.name[lang]}</h2>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{s.eligibility[lang]}</p>
              <dl className="mt-3 text-xs text-muted-foreground space-y-1">
                <div>{lang === "en" ? "Level" : "Kiwango"}: {s.level}</div>
                <div>{lang === "en" ? "Opens" : "Yafunguliwa"}: {new Date(s.opens).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB")}</div>
                <div>{t("card.deadline")}: {new Date(s.deadline).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB")}</div>
              </dl>
              <a href={s.applicationUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm text-brand font-medium">
                {t("common.apply")} <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <div className="mt-2 text-[10px] text-muted-foreground">
                {t("common.official.source")}: <a href={s.source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{s.source.title}</a>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">{t("disclaimer.heslb")}</p>
      </section>
    </AppShell>
  );
}
