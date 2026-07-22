import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { PROGRAMMES } from "@/data/programmes";
import { INSTITUTIONS } from "@/data/institutions";
import { CAREERS } from "@/data/careers";
import { X } from "lucide-react";
import { evaluate } from "@/lib/eligibility";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare programmes — NjiaYangu" },
      { name: "description", content: "Compare up to five Tanzanian university programmes side by side: eligibility, tuition, careers and application deadlines." },
      { property: "og:title", content: "Compare programmes — NjiaYangu" },
      { property: "og:description", content: "Side-by-side comparison of Tanzanian university programmes." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t, lang } = useI18n();
  const { compare, toggleCompare, clearCompare, profile } = useStore();

  const items = compare
    .map((id) => PROGRAMMES.find((p) => p.id === id))
    .filter(Boolean) as typeof PROGRAMMES;

  return (
    <AppShell>
      <section className="container-page py-6 sm:py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-semibold">{t("nav.compare")}</h1>
          {items.length > 0 && (
            <button onClick={clearCompare} className="text-sm text-muted-foreground hover:text-destructive">
              {lang === "en" ? "Clear all" : "Futa yote"}
            </button>
          )}
        </div>
        <p className="mt-2 text-muted-foreground text-sm">
          {lang === "en" ? `Up to 5 programmes. Currently ${items.length}/5.` : `Hadi kozi 5. Sasa ${items.length}/5.`}
        </p>

        {items.length === 0 && (
          <div className="mt-8 rounded-xl border bg-muted p-8 text-center text-sm text-muted-foreground">
            {lang === "en" ? "Add programmes from " : "Ongeza kozi kutoka "} <Link to="/programmes" className="text-brand">{t("nav.programmes")}</Link>.
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 border-b bg-muted font-medium text-muted-foreground w-40">Attribute</th>
                  {items.map((p) => {
                    const inst = INSTITUTIONS.find((i) => i.id === p.institutionId);
                    return (
                      <th key={p.id} className="text-left p-3 border-b bg-muted font-medium min-w-[220px]">
                        <div className="flex items-start justify-between gap-2">
                          <Link to="/programmes/$slug" params={{ slug: p.slug }} className="text-brand hover:underline">
                            {p.name[lang]}
                          </Link>
                          <button onClick={() => toggleCompare(p.id)} className="text-muted-foreground hover:text-destructive">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-xs text-muted-foreground font-normal">{inst?.name}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="[&_td]:p-3 [&_td]:border-b [&_td]:align-top">
                <tr>
                  <td className="font-medium">Eligibility</td>
                  {items.map((p) => {
                    const el = profile.academics ? evaluate(p, profile.academics) : undefined;
                    return <td key={p.id}>{el ? t(`eligibility.${el.status}`) : "—"}</td>;
                  })}
                </tr>
                <tr>
                  <td className="font-medium">Institution type</td>
                  {items.map((p) => {
                    const inst = INSTITUTIONS.find((i) => i.id === p.institutionId);
                    return <td key={p.id}>{inst?.type === "public" ? "Public" : "Private"}</td>;
                  })}
                </tr>
                <tr>
                  <td className="font-medium">Location</td>
                  {items.map((p) => {
                    const inst = INSTITUTIONS.find((i) => i.id === p.institutionId);
                    const cam = inst?.campuses.find((c) => c.id === p.campusId);
                    return <td key={p.id}>{cam?.region}</td>;
                  })}
                </tr>
                <tr>
                  <td className="font-medium">Duration</td>
                  {items.map((p) => <td key={p.id}>{p.durationYears} years</td>)}
                </tr>
                <tr>
                  <td className="font-medium">Tuition / year</td>
                  {items.map((p) => <td key={p.id}>TZS {p.tuition.amount.toLocaleString()}</td>)}
                </tr>
                <tr>
                  <td className="font-medium">Min. points</td>
                  {items.map((p) => <td key={p.id}>{p.rule.minPoints}</td>)}
                </tr>
                <tr>
                  <td className="font-medium">Required subjects</td>
                  {items.map((p) => <td key={p.id}>{p.rule.requiredSubjects.join(", ") || "—"}</td>)}
                </tr>
                <tr>
                  <td className="font-medium">Deadline</td>
                  {items.map((p) => <td key={p.id}>{new Date(p.applicationDeadline).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB")}</td>)}
                </tr>
                <tr>
                  <td className="font-medium">HESLB eligible</td>
                  {items.map((p) => <td key={p.id}>{p.heslbEligible ? "Yes" : "No"}</td>)}
                </tr>
                <tr>
                  <td className="font-medium">Careers</td>
                  {items.map((p) => (
                    <td key={p.id}>
                      {p.careerIds.map((cid) => CAREERS.find((c) => c.id === cid)?.title[lang]).filter(Boolean).join(", ") || "—"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}
