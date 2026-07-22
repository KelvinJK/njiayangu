import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About NjiaYangu" },
      { name: "description", content: "NjiaYangu is an independent guidance platform helping Tanzanian Form Six leavers find eligible university programmes, financing and careers." },
      { property: "og:title", content: "About NjiaYangu" },
      { property: "og:description", content: "Independent guidance for Tanzanian Form Six leavers." },
    ],
  }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  return (
    <AppShell>
      <section className="container-page py-8 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-semibold">{lang === "en" ? "About NjiaYangu" : "Kuhusu NjiaYangu"}</h1>
        <div className="mt-4 space-y-4 text-muted-foreground">
          <p>{lang === "en"
            ? "NjiaYangu (Kiswahili for “my path”) helps Form Six leavers in Tanzania discover university and college programmes that match their combination and grades — and understand exactly why."
            : "NjiaYangu ni jukwaa linalowasaidia wahitimu wa Kidato cha Sita nchini Tanzania kugundua kozi za vyuo zinazolingana na mchepuo na alama zao — na kuelewa sababu."}</p>
          <p>{lang === "en"
            ? "Eligibility results on NjiaYangu are computed from published requirements using deterministic rules — not by an AI making its own decisions. AI is only used to explain those verified rules in plain language."
            : "Ustahili unahesabiwa kutokana na masharti yaliyochapishwa kwa kutumia sheria za wazi — si AI kuamua yenyewe. AI hutumika tu kueleza masharti hayo kwa lugha rahisi."}</p>
          <p>{lang === "en"
            ? "NjiaYangu is an independent guidance service. It is not a government platform unless a formal partnership is announced."
            : "NjiaYangu ni huduma huru ya mwongozo. Sio jukwaa la serikali isipokuwa ushirikiano rasmi utakapotangazwa."}</p>
        </div>
        <div className="mt-8 rounded-xl border bg-accent p-4 flex items-start gap-3 text-sm">
          <ShieldCheck className="h-5 w-5 text-brand shrink-0 mt-0.5" />
          <div className="text-muted-foreground">
            <div className="font-medium text-foreground mb-1">{lang === "en" ? "Important disclaimers" : "Tahadhari muhimu"}</div>
            <ul className="space-y-1 list-disc pl-4">
              <li>{lang === "en" ? "Eligibility is based on information you provide and requirements stored on the platform." : "Ustahili unategemea taarifa unazotoa na masharti yaliyohifadhiwa."}</li>
              <li>{lang === "en" ? "Final admission decisions are made by the respective institution." : "Uamuzi wa mwisho wa udahili unafanywa na chuo husika."}</li>
              <li>{lang === "en" ? "Final loan and scholarship decisions are made by HESLB or the respective provider." : "Uamuzi wa mkopo au ufadhili unafanywa na HESLB au mtoa huduma husika."}</li>
              <li>{lang === "en" ? "Always verify with the official source before submitting an application." : "Thibitisha na chanzo rasmi kabla ya kutuma maombi."}</li>
            </ul>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
