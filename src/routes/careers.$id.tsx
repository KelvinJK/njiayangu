import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { CAREERS } from "@/data/careers";
import { PROGRAMMES } from "@/data/programmes";
import { INSTITUTIONS } from "@/data/institutions";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/careers/$id")({
  loader: ({ params }) => {
    const career = CAREERS.find((c) => c.id === params.id);
    if (!career) throw notFound();
    return { career };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Career not found — NjiaYangu" }, { name: "robots", content: "noindex" }] };
    const { career } = loaderData;
    const url = `https://njiayangu.lovable.app/careers/${params.id}`;
    return {
      meta: [
        { title: `${career.title.en} — Career pathway — NjiaYangu` },
        { name: "description", content: career.description.en.slice(0, 160) },
        { property: "og:title", content: `${career.title.en} — NjiaYangu` },
        { property: "og:description", content: career.description.en.slice(0, 200) },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Occupation",
            name: career.title.en,
            description: career.description.en,
            occupationalCategory: career.category,
            url,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <AppShell><div className="container-page py-16 text-center text-muted-foreground">Career not found.</div></AppShell>
  ),
  component: CareerDetail,
});

function CareerDetail() {
  const { career } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const matching = PROGRAMMES.filter((p) => p.careerIds.includes(career.id));

  return (
    <AppShell>
      <section className="container-page py-6 sm:py-10">
        <Link to="/careers" className="text-sm text-brand">← {t("nav.careers")}</Link>
        <h1 className="mt-3 text-2xl sm:text-3xl font-semibold">{career.title[lang]}</h1>
        <div className="text-sm text-muted-foreground">{career.category}</div>
        <p className="mt-3 text-muted-foreground max-w-2xl">{career.description[lang]}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {career.activities.length > 0 && (
            <div className="rounded-xl border bg-card p-4">
              <h2 className="font-semibold">{lang === "en" ? "Typical activities" : "Shughuli za kawaida"}</h2>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">{career.activities.map((a: { en: string; sw: string }, i: number) => <li key={i}>• {a[lang]}</li>)}</ul>
            </div>
          )}
          {career.industries.length > 0 && (
            <div className="rounded-xl border bg-card p-4">
              <h2 className="font-semibold">{lang === "en" ? "Industries in Tanzania" : "Sekta Tanzania"}</h2>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">{career.industries.map((a: { en: string; sw: string }, i: number) => <li key={i}>• {a[lang]}</li>)}</ul>
            </div>
          )}
          {career.technicalSkills.length > 0 && (
            <div className="rounded-xl border bg-card p-4">
              <h2 className="font-semibold">{lang === "en" ? "Technical skills" : "Ujuzi wa kitaalamu"}</h2>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">{career.technicalSkills.map((a: string, i: number) => <li key={i}>• {a}</li>)}</ul>
            </div>
          )}
          {career.transferableSkills.length > 0 && (
            <div className="rounded-xl border bg-card p-4">
              <h2 className="font-semibold">{lang === "en" ? "Transferable skills" : "Ujuzi wa jumla"}</h2>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">{career.transferableSkills.map((a: { en: string; sw: string }, i: number) => <li key={i}>• {a[lang]}</li>)}</ul>
            </div>
          )}
          {career.registration && (
            <div className="rounded-xl border bg-card p-4 md:col-span-2">
              <h2 className="font-semibold">{lang === "en" ? "Professional registration" : "Usajili wa kitaalamu"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{career.registration[lang]}</p>
            </div>
          )}
          {career.entrepreneurship && (
            <div className="rounded-xl border bg-card p-4 md:col-span-2">
              <h2 className="font-semibold">{lang === "en" ? "Entrepreneurship" : "Ujasiriamali"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{career.entrepreneurship[lang]}</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="font-semibold">{lang === "en" ? "Matching programmes" : "Kozi zinazolingana"}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {matching.map((p) => {
              const inst = INSTITUTIONS.find((i) => i.id === p.institutionId);
              return (
                <Link key={p.id} to="/programmes/$slug" params={{ slug: p.slug }} className="rounded-lg border bg-card p-3 hover:border-brand">
                  <div className="text-sm font-medium">{p.name[lang]}</div>
                  <div className="text-xs text-muted-foreground">{inst?.name}</div>
                </Link>
              );
            })}
            {matching.length === 0 && <div className="text-sm text-muted-foreground">—</div>}
          </div>
        </div>

        <div className="mt-8 rounded-xl border bg-accent p-4 flex items-start gap-3 text-sm">
          <ShieldCheck className="h-5 w-5 text-brand shrink-0 mt-0.5" />
          <div>
            <div>{t("common.official.source")}: <a href={career.source.url} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{career.source.title}</a></div>
            <div className="text-xs text-muted-foreground mt-1">{t("common.last.verified")}: {new Date(career.lastVerified).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB")}</div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
