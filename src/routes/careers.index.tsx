import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { CAREERS, CAREER_CATEGORIES } from "@/data/careers";
import { PROGRAMMES } from "@/data/programmes";
import { cn } from "@/lib/utils";

const searchSchema = z.object({ category: z.string().optional() });

export const Route = createFileRoute("/careers/")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Careers — NjiaYangu" },
      { name: "description", content: "Explore Tanzanian career pathways: activities, industries, skills, professional registration, and related programmes." },
      { property: "og:title", content: "Careers — NjiaYangu" },
      { property: "og:description", content: "Explore Tanzanian career pathways connected to university programmes." },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  const { t, lang } = useI18n();
  const s = Route.useSearch();
  const [category, setCategory] = useState(s.category ?? "");
  const list = category ? CAREERS.filter((c) => c.category === category) : CAREERS;

  return (
    <AppShell>
      <section className="container-page py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold">{t("nav.careers")}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => setCategory("")} className={cn("px-3 h-9 rounded-full border text-sm", !category && "border-brand bg-brand text-brand-foreground")}>All</button>
          {CAREER_CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={cn("px-3 h-9 rounded-full border text-sm", category === c && "border-brand bg-brand text-brand-foreground")}>{c}</button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => {
            const progCount = PROGRAMMES.filter((p) => p.careerIds.includes(c.id)).length;
            return (
              <Link key={c.id} to="/careers/$id" params={{ id: c.id }} className="rounded-xl border bg-card p-4 hover:border-brand">
                <div className="text-xs text-muted-foreground">{c.category}</div>
                <h2 className="mt-1 font-semibold">{c.title[lang]}</h2>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.description[lang]}</p>
                <div className="mt-3 text-xs text-muted-foreground">{progCount} {lang === "en" ? "matching programmes" : "kozi zinazohusiana"}</div>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 text-xs text-muted-foreground">
          {lang === "en"
            ? "NjiaYangu does not guarantee employment. Salary information is not shown unless verified from official labour-market sources."
            : "NjiaYangu haitolei dhamana ya ajira. Taarifa za mishahara hazionyeshwi bila kuthibitishwa na vyanzo rasmi."}
        </div>
      </section>
    </AppShell>
  );
}
