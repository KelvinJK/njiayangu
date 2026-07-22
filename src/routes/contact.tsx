import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { Mail, MessageCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — NjiaYangu" },
      { name: "description", content: "Send feedback or questions to the NjiaYangu team." },
      { property: "og:title", content: "Contact — NjiaYangu" },
      { property: "og:description", content: "Reach the NjiaYangu team." },
    ],
  }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const category = String(fd.get("category") || "general");
    if (!name || !email || !message) return;
    setState("sending");
    setErrorMsg("");
    const { error } = await supabase.from("feedback").insert({
      name,
      email,
      message,
      category,
      user_id: user?.id ?? null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 300) : null,
    });
    if (error) {
      setState("error");
      setErrorMsg(error.message);
      return;
    }
    setState("sent");
    form.reset();
  }

  return (
    <AppShell>
      <section className="container-page py-8 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-semibold">{lang === "en" ? "Contact us" : "Wasiliana nasi"}</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          {lang === "en"
            ? "Send feedback, report an issue, or ask about a programme. Your message goes straight to the NjiaYangu admin inbox."
            : "Tuma maoni, ripoti tatizo, au uliza kuhusu kozi. Ujumbe wako unaenda moja kwa moja kwa msimamizi wa NjiaYangu."}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <Mail className="h-5 w-5 text-brand" />
            <div>
              <div className="font-medium text-sm">{lang === "en" ? "In-app inbox" : "Kikasha cha ndani"}</div>
              <div className="text-xs text-muted-foreground">
                {lang === "en" ? "Admins review every message" : "Wasimamizi husoma kila ujumbe"}
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-brand" />
            <div>
              <div className="font-medium text-sm">WhatsApp / SMS</div>
              <div className="text-xs text-muted-foreground">{lang === "en" ? "Coming soon" : "Inakuja hivi karibuni"}</div>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 rounded-xl border bg-card p-4 grid gap-3">
          <label className="text-sm">
            <span className="block mb-1 font-medium">{lang === "en" ? "Your name" : "Jina lako"}</span>
            <input name="name" required maxLength={80} className="w-full h-11 px-3 rounded-md border bg-surface" />
          </label>
          <label className="text-sm">
            <span className="block mb-1 font-medium">Email</span>
            <input name="email" required type="email" maxLength={120} defaultValue={user?.email ?? ""} className="w-full h-11 px-3 rounded-md border bg-surface" />
          </label>
          <label className="text-sm">
            <span className="block mb-1 font-medium">{lang === "en" ? "Category" : "Aina"}</span>
            <select name="category" defaultValue="general" className="w-full h-11 px-3 rounded-md border bg-surface">
              <option value="general">{lang === "en" ? "General feedback" : "Maoni ya jumla"}</option>
              <option value="bug">{lang === "en" ? "Report a bug" : "Ripoti tatizo"}</option>
              <option value="feature">{lang === "en" ? "Feature request" : "Ombi la kipengele"}</option>
              <option value="data">{lang === "en" ? "Programme / HESLB data issue" : "Tatizo la data ya kozi / HESLB"}</option>
              <option value="account">{lang === "en" ? "Account help" : "Msaada wa akaunti"}</option>
              <option value="other">{lang === "en" ? "Other" : "Nyingine"}</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="block mb-1 font-medium">{lang === "en" ? "Message" : "Ujumbe"}</span>
            <textarea name="message" required maxLength={1500} rows={5} className="w-full px-3 py-2 rounded-md border bg-surface" />
          </label>
          <button
            disabled={state === "sending"}
            className="h-11 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
            {lang === "en" ? "Send to admins" : "Tuma kwa wasimamizi"}
          </button>
          {state === "sent" && (
            <p className="text-sm text-success">
              {lang === "en" ? "Thanks — your message is in the admin inbox. We'll reply by email." : "Asante — ujumbe wako umepokelewa. Tutakujibu kwa barua pepe."}
            </p>
          )}
          {state === "error" && (
            <p className="text-sm text-destructive">
              {lang === "en" ? "Could not send: " : "Imeshindikana: "}{errorMsg}
            </p>
          )}
        </form>
      </section>
    </AppShell>
  );
}
