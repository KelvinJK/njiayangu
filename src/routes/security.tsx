import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/security")({
  component: SecurityPage,
  head: () => ({
    meta: [
      { title: "Security · NjiaYangu" },
      { name: "description", content: "Security practices, account safety and vulnerability reporting for the NjiaYangu platform." },
      { property: "og:title", content: "Security · NjiaYangu" },
      { property: "og:description", content: "How NjiaYangu keeps your account safe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SecurityPage() {
  const { lang } = useI18n();
  const isSw = lang === "sw";

  return (
    <AppShell>
      <div className="container-page py-8 md:py-12 max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand">
            {isSw ? "Usalama na Sera" : "Security & Policies"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSw ? "Jinsi tunavyolinda akaunti yako na taarifa zako." : "How we protect your account and data."}
          </p>
        </header>

        <div className="space-y-6 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "1. Ulinzi wa akaunti" : "1. Account protection"}
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{isSw ? "Nywila zimesimbwa kwa hashing salama (bcrypt/argon)" : "Passwords are hashed with secure algorithms (bcrypt/argon)"}</li>
              <li>{isSw ? "Ingia kwa Google OAuth kwa usalama zaidi" : "Sign in with Google OAuth for stronger security"}</li>
              <li>{isSw ? "Tumia nywila yenye herufi 8+ pamoja na namba na alama" : "Use a password of 8+ characters with numbers and symbols"}</li>
              <li>{isSw ? "Toka nje ukitumia kifaa cha pamoja" : "Sign out when using shared devices"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "2. Ulinzi wa taarifa" : "2. Data protection"}
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>{isSw ? "Muunganisho umesimbwa kwa TLS/HTTPS" : "All traffic is encrypted via TLS/HTTPS"}</li>
              <li>{isSw ? "Row Level Security (RLS) hulinda kila akaunti" : "Row Level Security (RLS) isolates each account"}</li>
              <li>{isSw ? "Nakala rudufu za kila siku za hifadhidata" : "Daily database backups"}</li>
              <li>{isSw ? "Ufikiaji wa ndani unadhibitiwa na kuandikwa" : "Internal access is controlled and audited"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "3. Sera ya matumizi salama" : "3. Acceptable use policy"}
            </h2>
            <p className="text-muted-foreground">
              {isSw
                ? "Usitumie jukwaa hili kuwasilisha taarifa za uongo, kuiga mtu mwingine, au kujaribu kuvunja mifumo yetu. Akaunti zinazokiuka zitasitishwa."
                : "Do not submit false information, impersonate others, or attempt to breach our systems. Violating accounts will be suspended."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "4. Ripoti udhaifu wa usalama" : "4. Report a vulnerability"}
            </h2>
            <p className="text-muted-foreground">
              {isSw
                ? "Ukigundua tatizo la usalama, tafadhali tuwasiliane kupitia ukurasa wa Mawasiliano kabla ya kulishiriki hadharani. Tunathamini watafiti wanaowajibika."
                : "If you find a security issue, please contact us via the Contact page before disclosing publicly. We appreciate responsible researchers."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "5. Vidakuzi na hifadhi ya kifaa" : "5. Cookies & local storage"}
            </h2>
            <p className="text-muted-foreground">
              {isSw
                ? "Tunatumia hifadhi ya ndani ya kivinjari (localStorage) kwa lugha upendayo, kozi ulizohifadhi na kufanya kazi bila mtandao. Hatutumii vidakuzi vya utangazaji."
                : "We use browser localStorage for your language, saved programmes and offline support. We do not use advertising cookies."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {isSw ? "6. Kanusho" : "6. Disclaimer"}
            </h2>
            <p className="text-muted-foreground">
              {isSw
                ? "Uamuzi wa mwisho wa udahili na ufadhili unafanywa na taasisi rasmi (TCU, NACTE, HESLB na vyuo). Thibitisha kupitia vyanzo rasmi kabla ya kutuma maombi."
                : "Final admission and financing decisions are made by the official bodies (TCU, NACTE, HESLB and institutions). Always verify via official sources before applying."}
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
