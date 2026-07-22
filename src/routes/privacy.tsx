import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy · NjiaYangu" },
      { name: "description", content: "How NjiaYangu collects, uses, stores and protects your personal data as a Form Six leaver in Tanzania." },
      { property: "og:title", content: "Privacy Policy · NjiaYangu" },
      { property: "og:description", content: "How NjiaYangu handles your personal data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function PrivacyPage() {
  const { lang } = useI18n();
  const isSw = lang === "sw";

  return (
    <AppShell>
      <div className="container-page py-8 md:py-12 max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand">
            {isSw ? "Sera ya Faragha" : "Privacy Policy"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSw ? "Ilihuishwa mwisho: Julai 2026" : "Last updated: July 2026"}
          </p>
        </header>

        <div className="prose prose-slate max-w-none space-y-6 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "1. Utangulizi" : "1. Introduction"}
            </h2>
            <p className="text-muted-foreground">
              {isSw
                ? "NjiaYangu ni jukwaa la kuwaongoza wahitimu wa Kidato cha Sita nchini Tanzania. Tunatunza faragha yako na tunatumia taarifa zako kwa madhumuni maalum tu ya kukusaidia kupata kozi, vyuo na ufadhili unaokufaa."
                : "NjiaYangu is a guidance platform for Tanzanian Form Six leavers. We respect your privacy and use your information only to help you find suitable programmes, institutions and financing."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "2. Taarifa tunazokusanya" : "2. Information we collect"}
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{isSw ? "Barua pepe na nenosiri (kwa akaunti)" : "Email and password (for accounts)"}</li>
              <li>{isSw ? "Mchepuo, alama za Kidato cha Sita na mkoa" : "Combination, Form Six grades and region"}</li>
              <li>{isSw ? "Kozi ulizohifadhi na maendeleo ya HESLB" : "Saved programmes and HESLB checklist progress"}</li>
              <li>{isSw ? "Lugha upendayo na mipangilio ya kifaa" : "Language preference and device settings"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "3. Jinsi tunavyotumia taarifa" : "3. How we use your data"}
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{isSw ? "Kukokotoa ustahiki wa kozi kutoka kwa alama zako" : "Compute programme eligibility from your grades"}</li>
              <li>{isSw ? "Kuhifadhi orodha ya kozi na maendeleo yako" : "Save your programme list and progress"}</li>
              <li>{isSw ? "Kutuma arifa za tarehe za mwisho na masasisho" : "Send deadline reminders and updates"}</li>
              <li>{isSw ? "Kuboresha ubora wa jukwaa" : "Improve the quality of the platform"}</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              {isSw ? "Hatuuzi wala kushiriki taarifa zako kwa watangazaji." : "We never sell or share your data with advertisers."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "4. Uhifadhi na usalama" : "4. Storage and security"}
            </h2>
            <p className="text-muted-foreground">
              {isSw
                ? "Taarifa zako huhifadhiwa kwenye seva salama zilizosimbwa. Tunatumia Row Level Security (RLS) ili mtumiaji aweze kufikia tu taarifa zake mwenyewe. Nywila hazitunzwi kama zilivyo — huwekwa siri kwa njia ya crypto (hashed)."
                : "Your data is stored on encrypted, secure servers. We use Row Level Security (RLS) so each user can only access their own data. Passwords are never stored in plain text — they are securely hashed."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "5. Haki zako" : "5. Your rights"}
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{isSw ? "Kuomba nakala ya taarifa zako" : "Request a copy of your data"}</li>
              <li>{isSw ? "Kurekebisha taarifa zisizo sahihi" : "Correct inaccurate information"}</li>
              <li>{isSw ? "Kufuta akaunti yako wakati wowote" : "Delete your account at any time"}</li>
              <li>{isSw ? "Kujiondoa kwenye arifa" : "Opt out of notifications"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "6. Watoto na wadogo" : "6. Minors"}
            </h2>
            <p className="text-muted-foreground">
              {isSw
                ? "Jukwaa hili linalenga wahitimu wa Kidato cha Sita (kwa kawaida umri wa miaka 17+). Ikiwa uko chini ya miaka 18, tumia jukwaa hili kwa idhini ya mzazi au mlezi."
                : "This platform is intended for Form Six leavers (typically 17+). If you are under 18, please use it with the consent of a parent or guardian."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "7. Wasiliana nasi" : "7. Contact us"}
            </h2>
            <p className="text-muted-foreground">
              {isSw
                ? "Kwa maswali kuhusu faragha, tuma barua pepe kupitia ukurasa wetu wa Mawasiliano."
                : "For privacy questions, reach us through our Contact page."}
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
