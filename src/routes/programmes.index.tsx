import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { PROGRAMMES, PROGRAMME_CATEGORIES } from "@/data/programmes";
import { INSTITUTIONS } from "@/data/institutions";
import { ProgrammeCard } from "@/components/site/ProgrammeCard";
import { evaluate } from "@/lib/eligibility";
import { Search } from "lucide-react";

const searchSchema = z.object({ q: z.string().optional(), category: z.string().optional() });

export const Route = createFileRoute("/programmes/")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Explore Programmes — NjiaYangu" },
      { name: "description", content: "Browse verified Tanzanian university programmes by category, institution and eligibility requirements." },
      { property: "og:title", content: "Explore Programmes — NjiaYangu" },
      { property: "og:description", content: "Browse Tanzanian university programmes by category and institution." },
    ],
  }),
  component: ProgrammesPage,
});

function ProgrammesPage() {
  const { t, lang } = useI18n();
  const s = Route.useSearch();
  const { profile } = useStore();
  const [q, setQ] = useState(s.q ?? "");
  const [category, setCategory] = useState(s.category ?? "");

  const list = useMemo(() => {
    return PROGRAMMES.filter((p) => {
      if (category && p.category !== category) return false;
      if (q) {
        const inst = INSTITUTIONS.find((i) => i.id === p.institutionId);
        const hay = `${p.name.en} ${p.name.sw} ${inst?.name ?? ""} ${p.category}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [q, category]);

  return (
    <AppShell>
      <section className="container-page py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold">{t("nav.programmes")}</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          {lang === "en"
            ? `${PROGRAMMES.length} programmes across ${PROGRAMME_CATEGORIES.length} categories.`
            : `${PROGRAMMES.length} kozi kwenye makundi ${PROGRAMME_CATEGORIES.length}.`}
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === "en" ? "Search programmes or institutions" : "Tafuta kozi au chuo"} className="w-full h-11 pl-9 pr-3 rounded-md border bg-surface" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 px-3 rounded-md border bg-surface">
            <option value="">{lang === "en" ? "All categories" : "Makundi yote"}</option>
            {PROGRAMME_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => {
            const eligibility = profile.academics ? evaluate(p, profile.academics) : undefined;
            return <ProgrammeCard key={p.id} programme={p} eligibility={eligibility} />;
          })}
        </div>

        {list.length === 0 && (
          <div className="mt-8 rounded-xl border bg-muted p-8 text-center text-sm text-muted-foreground">
            {lang === "en" ? "No programmes match your filter." : "Hakuna kozi zinazokidhi vichujio."}
          </div>
        )}
      </section>
    </AppShell>
  );
}
