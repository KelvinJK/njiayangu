import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — NjiaYangu" },
      { name: "description", content: "Reach the NjiaYangu team for questions about programmes, HESLB or scholarships." },
      { property: "og:title", content: "Contact — NjiaYangu" },
      { property: "og:description", content: "Reach the NjiaYangu team." },
    ],
  }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const [sent, setSent] = useState(false);
  return (
    <AppShell>
      <section className="container-page py-8 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-semibold">{lang === "en" ? "Contact us" : "Wasiliana nasi"}</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          {lang === "en" ? "Send a question about a programme, institution or the HESLB checklist." : "Tuma swali kuhusu kozi, chuo au orodha ya HESLB."}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a href="mailto:hello@njiayangu.example" className="rounded-xl border bg-card p-4 hover:border-brand flex items-center gap-3">
            <Mail className="h-5 w-5 text-brand" />
            <div>
              <div className="font-medium text-sm">Email</div>
              <div className="text-xs text-muted-foreground">hello@njiayangu.example</div>
            </div>
          </a>
          <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-brand" />
            <div>
              <div className="font-medium text-sm">WhatsApp / SMS</div>
              <div className="text-xs text-muted-foreground">Coming soon</div>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="mt-6 rounded-xl border bg-card p-4 grid gap-3"
        >
          <label className="text-sm">
            <span className="block mb-1 font-medium">{lang === "en" ? "Your name" : "Jina lako"}</span>
            <input required maxLength={80} className="w-full h-11 px-3 rounded-md border bg-surface" />
          </label>
          <label className="text-sm">
            <span className="block mb-1 font-medium">Email</span>
            <input required type="email" maxLength={120} className="w-full h-11 px-3 rounded-md border bg-surface" />
          </label>
          <label className="text-sm">
            <span className="block mb-1 font-medium">{lang === "en" ? "Message" : "Ujumbe"}</span>
            <textarea required maxLength={1000} rows={5} className="w-full px-3 py-2 rounded-md border bg-surface" />
          </label>
          <button className="h-11 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium">
            {lang === "en" ? "Send" : "Tuma"}
          </button>
          {sent && <p className="text-sm text-success">{lang === "en" ? "Thanks — we'll get back to you." : "Asante — tutakujibu."}</p>}
        </form>
      </section>
    </AppShell>
  );
}
