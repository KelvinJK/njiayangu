import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { ExternalLink, ShieldCheck, AlertCircle, KeyRound, UserPlus, LogIn, RefreshCw } from "lucide-react";

const URL = "https://njiayangu.lovable.app/resources/heslb-portal-guide";

const FAQ = [
  {
    q: {
      en: "How do I create an OLAMS account for HESLB?",
      sw: "Nawezaje kufungua akaunti ya OLAMS kwa HESLB?",
    },
    a: {
      en: "Visit the official HESLB OLAMS portal, click 'Register / New Applicant', enter your Form Four (CSEE) index number exactly as it appears on your certificate, verify your NECTA details, then set a strong password and a working email you can access during the whole application window.",
      sw: "Tembelea tovuti rasmi ya HESLB OLAMS, bofya 'Register / New Applicant', andika namba ya mtihani wa Kidato cha Nne (CSEE) kama ilivyo kwenye cheti, thibitisha taarifa za NECTA, kisha weka nenosiri thabiti na barua pepe unayoweza kuifikia wakati wote wa maombi.",
    },
  },
  {
    q: {
      en: "The system says my NECTA details do not match — what should I do?",
      sw: "Mfumo unasema taarifa zangu za NECTA hazilingani — nifanye nini?",
    },
    a: {
      en: "This usually means the name, index number or year on your Form Four certificate differs from what NECTA has on file. Double-check every character (including spaces and hyphens), confirm the correct examination year, and if it still fails, contact NECTA to correct the record before HESLB can verify you.",
      sw: "Kwa kawaida hii inamaanisha jina, namba ya mtihani au mwaka kwenye cheti chako cha Kidato cha Nne hautofautiani na kilichopo NECTA. Angalia kila herufi (pamoja na nafasi na alama), thibitisha mwaka sahihi wa mtihani, na kama bado inashindikana, wasiliana na NECTA kurekebisha kabla HESLB haijakuthibitisha.",
    },
  },
  {
    q: {
      en: "I forgot my HESLB / OLAMS password. How do I reset it?",
      sw: "Nimesahau nenosiri langu la HESLB / OLAMS. Naliwezaje kulibadilisha?",
    },
    a: {
      en: "On the OLAMS login page, use the 'Forgot password' link and enter the email you registered with. A reset link is sent to that inbox; check your spam folder if you don't see it within a few minutes. If the email is no longer accessible, you must contact HESLB support directly.",
      sw: "Kwenye ukurasa wa kuingia OLAMS, tumia kiungo cha 'Forgot password' na uandike barua pepe uliyosajili nayo. Kiungo cha kubadilisha kitatumwa kwenye kikasha hicho; angalia folda ya spam kama hukioni. Ikiwa barua pepe haipatikani tena, lazima uwasiliane na HESLB moja kwa moja.",
    },
  },
  {
    q: {
      en: "The portal is very slow or times out during the application window",
      sw: "Portal ni ya polepole sana au inakatika wakati wa maombi",
    },
    a: {
      en: "Traffic peaks in the last week before the deadline. Apply early — ideally within the first two weeks of the window. Use a stable connection, avoid uploading over mobile data if possible, and complete one section at a time saving after each step so a timeout doesn't lose your progress.",
      sw: "Watu wengi hutumia mfumo katika wiki ya mwisho. Omba mapema — ikiwezekana ndani ya wiki mbili za mwanzo. Tumia mtandao thabiti, epuka kupakia kupitia data ya simu ikiwezekana, na kamilisha sehemu moja kwa moja ukihifadhi baada ya kila hatua ili muda ukiisha usipoteze taarifa zako.",
    },
  },
  {
    q: {
      en: "Which documents must I have ready before I log in?",
      sw: "Vielelezo vipi lazima niwe nazo kabla ya kuingia?",
    },
    a: {
      en: "You need: CSEE (Form Four) certificate, ACSEE (Form Six) certificate or results slip, birth certificate, Tanzanian national ID or NIDA number for you and both parents/guardians, sponsor details, admission letter from the higher-education institution, and any death or disability certificates if applicable. Scan clean copies as PDFs under the size limit stated in the portal.",
      sw: "Unahitaji: cheti cha CSEE (Kidato cha Nne), cheti au matokeo ya ACSEE (Kidato cha Sita), cheti cha kuzaliwa, kitambulisho cha taifa au namba ya NIDA yako na ya wazazi/walezi wote wawili, taarifa za mdhamini, barua ya udahili kutoka chuoni, na vyeti vya kifo au ulemavu kama vinahusika. Nakili nakala safi kama PDF chini ya ukubwa ulioelezwa kwenye portal.",
    },
  },
];

export const Route = createFileRoute("/resources/heslb-portal-guide")({
  head: () => ({
    meta: [
      { title: "HESLB Login & OLAMS Portal Guide — NjiaYangu" },
      {
        name: "description",
        content:
          "Step-by-step guide to HESLB OLAMS: create your account, verify NECTA details, reset your password, and fix common login errors during the application window.",
      },
      { property: "og:title", content: "HESLB Login & OLAMS Portal Guide" },
      {
        property: "og:description",
        content:
          "Create an OLAMS account, verify NECTA details, reset passwords and troubleshoot HESLB login problems.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q.en,
            acceptedAnswer: { "@type": "Answer", text: f.a.en },
          })),
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const isSw = lang === "sw";

  return (
    <AppShell>
      <article className="container-page py-8 md:py-12 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/resources" className="hover:underline">
            {isSw ? "Rasilimali" : "Resources"}
          </Link>{" "}
          / <span className="text-foreground">{isSw ? "Mwongozo wa OLAMS" : "HESLB portal guide"}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand">
            {isSw ? "Mwongozo wa Kuingia HESLB (OLAMS)" : "HESLB Login & OLAMS Portal Guide"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {isSw
              ? "Namna ya kufungua akaunti ya OLAMS, kuthibitisha taarifa za NECTA, kubadilisha nenosiri na kutatua matatizo ya kawaida ya kuingia wakati wa dirisha la maombi ya HESLB."
              : "How to create an OLAMS account, verify NECTA details, reset your password, and troubleshoot common login errors during the HESLB application window."}
          </p>
        </header>

        <div className="rounded-xl border bg-accent p-4 flex items-start gap-3 text-sm mb-8">
          <ShieldCheck className="h-5 w-5 text-brand shrink-0 mt-0.5" />
          <div className="text-muted-foreground">
            <div className="font-medium text-foreground mb-1">
              {isSw ? "Kumbuka" : "Important"}
            </div>
            <p>
              {isSw
                ? "NjiaYangu ni jukwaa huru la mwongozo. Portal rasmi ya HESLB ni ya HESLB — hifadhi anwani rasmi na epuka viungo vya SMS/WhatsApp visivyothibitika."
                : "NjiaYangu is an independent guide. The official HESLB portal is run by HESLB — bookmark the official address and avoid unverified SMS/WhatsApp links."}
            </p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 mb-10">
          <Step icon={<UserPlus className="h-5 w-5" />} title={isSw ? "1. Fungua akaunti" : "1. Register"}>
            {isSw
              ? "Nenda tovuti rasmi ya HESLB OLAMS. Chagua 'New Applicant', andika namba ya CSEE, thibitisha taarifa za NECTA, weka nenosiri thabiti."
              : "Go to the official HESLB OLAMS portal. Choose 'New Applicant', enter your CSEE index number, verify NECTA details, and set a strong password."}
          </Step>
          <Step icon={<LogIn className="h-5 w-5" />} title={isSw ? "2. Ingia" : "2. Sign in"}>
            {isSw
              ? "Tumia namba ya CSEE au barua pepe uliyosajili. Kama unashindwa kuingia baada ya majaribio 3, subiri dakika kadhaa kabla ya kujaribu tena."
              : "Use your CSEE number or the registered email. If you fail 3 times, wait a few minutes before trying again to avoid a temporary lockout."}
          </Step>
          <Step icon={<KeyRound className="h-5 w-5" />} title={isSw ? "3. Sahau nenosiri?" : "3. Forgot password?"}>
            {isSw
              ? "Bofya 'Forgot password'. Kiungo cha kubadilisha kitatumwa kwa barua pepe uliyosajili. Angalia folda ya spam."
              : "Click 'Forgot password'. A reset link is sent to your registered email. Check your spam folder if it doesn't arrive quickly."}
          </Step>
          <Step icon={<RefreshCw className="h-5 w-5" />} title={isSw ? "4. NECTA haifanani?" : "4. NECTA mismatch?"}>
            {isSw
              ? "Angalia jina, namba na mwaka kwa umakini. Kama bado inakosea, wasiliana na NECTA kurekebisha rekodi kabla ya HESLB."
              : "Check name, number and year carefully. If it still fails, contact NECTA to correct the record before HESLB can verify you."}
          </Step>
        </section>

        <h2 className="text-2xl font-semibold mb-4">
          {isSw ? "Maswali yanayoulizwa mara kwa mara" : "Frequently asked questions"}
        </h2>
        <div className="space-y-6">
          {FAQ.map((f, i) => (
            <div key={i} className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold text-foreground flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                {f.q[lang]}
              </h3>
              <p className="mt-2 text-muted-foreground text-[15px] leading-relaxed">{f.a[lang]}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border bg-card p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-medium">{isSw ? "Umeshaanza maombi?" : "Started your application?"}</div>
            <div className="text-sm text-muted-foreground">
              {isSw ? "Fuatilia hatua zote kwenye mwongozo wetu wa HESLB." : "Track every step in our HESLB checklist."}
            </div>
          </div>
          <Link to="/heslb" className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium">
            {isSw ? "Fungua orodha ya HESLB" : "Open HESLB checklist"}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </AppShell>
  );
}

function Step({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 text-brand">{icon}<span className="font-semibold text-foreground">{title}</span></div>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
