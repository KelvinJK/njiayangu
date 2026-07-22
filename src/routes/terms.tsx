import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Use — NjiaYangu" },
      { name: "description", content: "Rules for using NjiaYangu: acceptable use, disclaimers about admissions and HESLB decisions, account responsibilities and liability limits." },
      { property: "og:title", content: "Terms of Use — NjiaYangu" },
      { property: "og:description", content: "Terms governing use of NjiaYangu's guidance platform for Tanzanian Form Six leavers." },
      { property: "og:url", content: "https://njiayangu.lovable.app/terms" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://njiayangu.lovable.app/terms" }],
  }),
});

function TermsPage() {
  const { lang } = useI18n();
  const isSw = lang === "sw";

  return (
    <AppShell>
      <div className="container-page py-8 md:py-12 max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand">
            {isSw ? "Masharti ya Matumizi" : "Terms of Use"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSw ? "Ilihuishwa mwisho: Julai 2026" : "Last updated: July 2026"}
          </p>
        </header>

        <div className="space-y-6 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "1. Kukubali masharti" : "1. Acceptance"}
            </h2>
            <p className="text-muted-foreground">
              {isSw
                ? "Kwa kutumia NjiaYangu, unakubali masharti haya. Kama huyakubali, tafadhali usitumie jukwaa hili."
                : "By using NjiaYangu, you agree to these terms. If you do not agree, please do not use the platform."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "2. Huduma tunayotoa" : "2. What we provide"}
            </h2>
            <p className="text-muted-foreground">
              {isSw
                ? "Jukwaa hili linatoa mwongozo wa kielimu tu — kozi zinazoweza kukufaa, taarifa za vyuo na maandalizi ya HESLB. Sisi si taasisi rasmi ya udahili."
                : "The platform provides educational guidance only — potentially eligible programmes, institution info and HESLB preparation. We are not an official admissions body."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "3. Wajibu wako" : "3. Your responsibilities"}
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{isSw ? "Toa taarifa sahihi za alama zako" : "Provide accurate academic information"}</li>
              <li>{isSw ? "Linda nywila yako" : "Keep your password confidential"}</li>
              <li>{isSw ? "Thibitisha taarifa zote na chanzo rasmi" : "Verify all information against official sources"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "4. Ukomo wa dhima" : "4. Limitation of liability"}
            </h2>
            <p className="text-muted-foreground">
              {isSw
                ? "NjiaYangu haiwajibiki kwa uamuzi wa udahili au ufadhili unaofanywa na taasisi rasmi. Tumia jukwaa hili kama mwongozo tu."
                : "NjiaYangu is not liable for admission or financing decisions made by official institutions. Use this platform as guidance only."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "5. Mabadiliko" : "5. Changes"}
            </h2>
            <p className="text-muted-foreground">
              {isSw
                ? "Tunaweza kubadilisha masharti haya mara kwa mara. Toleo la sasa litakuwa kwenye ukurasa huu."
                : "We may update these terms from time to time. The current version is always shown on this page."}
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
