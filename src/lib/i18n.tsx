import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "sw";

type Dict = Record<string, { en: string; sw: string }>;

const dict: Dict = {
  "app.name": { en: "NjiaYangu", sw: "NjiaYangu" },
  "app.tagline": {
    en: "Your path after Form Six",
    sw: "Njia yako baada ya Kidato cha Sita",
  },
  "nav.home": { en: "Home", sw: "Mwanzo" },
  "nav.find": { en: "Find My Courses", sw: "Tafuta Kozi Zangu" },
  "nav.programmes": { en: "Programmes", sw: "Kozi" },
  "nav.careers": { en: "Careers", sw: "Kazi" },
  "nav.institutions": { en: "Institutions", sw: "Vyuo" },
  "nav.heslb": { en: "HESLB Guide", sw: "Mwongozo wa HESLB" },
  "nav.scholarships": { en: "Scholarships", sw: "Ufadhili" },
  "nav.calendar": { en: "Calendar", sw: "Kalenda" },
  "nav.resources": { en: "Resources", sw: "Rasilimali" },
  "nav.about": { en: "About", sw: "Kuhusu" },
  "nav.contact": { en: "Contact", sw: "Wasiliana" },
  "nav.compare": { en: "Compare", sw: "Linganisha" },

  "home.hero.title": {
    en: "Discover What You Can Study After Form Six",
    sw: "Gundua Unachoweza Kusomea Baada ya Kidato cha Sita",
  },
  "home.hero.sub": {
    en: "Enter your combination and grades to find eligible programmes, institutions, financing guidance and career pathways.",
    sw: "Ingiza mchepuo na alama zako ili kupata kozi zinazokufaa, vyuo, mwongozo wa ufadhili na njia za kazi.",
  },
  "home.cta.find": { en: "Find My Courses", sw: "Tafuta Kozi Zangu" },
  "home.cta.heslb": { en: "Prepare for HESLB", sw: "Jitayarishe kwa HESLB" },
  "home.alerts": { en: "Current application alerts", sw: "Matangazo ya sasa" },
  "home.heslb.deadline": { en: "HESLB deadline", sw: "Tarehe ya mwisho ya HESLB" },
  "home.popular": { en: "Popular combinations", sw: "Michepuo maarufu" },
  "home.careers": { en: "Career categories", sw: "Aina za kazi" },
  "home.verified": { en: "Recently verified programmes", sw: "Kozi zilizohakikiwa hivi karibuni" },
  "home.scholarships": { en: "Scholarships open now", sw: "Ufadhili unaopatikana sasa" },
  "home.how": { en: "How NjiaYangu works", sw: "Jinsi NjiaYangu inavyofanya kazi" },
  "home.how.1": { en: "Enter your combination & grades", sw: "Ingiza mchepuo na alama zako" },
  "home.how.1d": {
    en: "Tell us your Form Six subjects and results.",
    sw: "Tuambie masomo na matokeo yako ya Kidato cha Sita.",
  },
  "home.how.2": { en: "See eligible programmes", sw: "Ona kozi zinazokufaa" },
  "home.how.2d": {
    en: "We match your results to verified programme requirements.",
    sw: "Tunalinganisha matokeo yako na masharti yaliyothibitishwa.",
  },
  "home.how.3": { en: "Compare & plan", sw: "Linganisha na panga" },
  "home.how.3d": {
    en: "Compare institutions, tuition, careers and deadlines.",
    sw: "Linganisha vyuo, ada, kazi na tarehe za mwisho.",
  },
  "home.how.4": { en: "Prepare HESLB & applications", sw: "Andaa HESLB na maombi" },
  "home.how.4d": {
    en: "Use the checklist to be ready before official deadlines.",
    sw: "Tumia orodha kujiandaa kabla ya tarehe rasmi za mwisho.",
  },
  "home.official": {
    en: "Information on this platform is based on published requirements from TCU, NACTE, HESLB and participating institutions. Verify with the official source before applying.",
    sw: "Taarifa katika jukwaa hili zinatokana na masharti yaliyochapishwa na TCU, NACTE, HESLB na vyuo. Thibitisha kupitia chanzo rasmi kabla ya kutuma maombi.",
  },

  "eligibility.ELIGIBLE": { en: "Eligible", sw: "Unafaa" },
  "eligibility.POTENTIALLY_ELIGIBLE": { en: "Potentially eligible", sw: "Huenda unafaa" },
  "eligibility.NOT_ELIGIBLE": { en: "Not eligible", sw: "Haufai kwa sasa" },
  "eligibility.INCOMPLETE_INFORMATION": { en: "More info needed", sw: "Taarifa hazitoshi" },

  "card.match": { en: "Preference match", sw: "Ulinganifu" },
  "card.save": { en: "Save", sw: "Hifadhi" },
  "card.saved": { en: "Saved", sw: "Imehifadhiwa" },
  "card.compare": { en: "Compare", sw: "Linganisha" },
  "card.details": { en: "View details", sw: "Angalia zaidi" },
  "card.deadline": { en: "Deadline", sw: "Tarehe ya mwisho" },
  "card.duration": { en: "Duration", sw: "Muda" },
  "card.points": { en: "Min. points", sw: "Alama za chini" },
  "card.heslb": { en: "HESLB eligible", sw: "Inafaa HESLB" },
  "card.verified": { en: "Verified", sw: "Imethibitishwa" },

  "find.step": { en: "Step", sw: "Hatua" },
  "find.next": { en: "Continue", sw: "Endelea" },
  "find.back": { en: "Back", sw: "Rudi" },
  "find.results": { en: "Show my results", sw: "Onyesha matokeo" },
  "find.reset": { en: "Start over", sw: "Anza upya" },

  "disclaimer.short": {
    en: "Final admission decisions are made by each institution. Verify with the official source before applying.",
    sw: "Uamuzi wa mwisho wa udahili unafanywa na kila chuo. Thibitisha na chanzo rasmi kabla ya kutuma maombi.",
  },
  "disclaimer.heslb": {
    en: "HESLB and the respective financing provider make the final loan or scholarship decision. Applications must be completed through the official HESLB system.",
    sw: "HESLB na mtoa ufadhili husika hufanya uamuzi wa mwisho wa mkopo au ufadhili. Maombi lazima yakamilishwe kupitia mfumo rasmi wa HESLB.",
  },

  "common.language": { en: "Language", sw: "Lugha" },
  "common.en": { en: "English", sw: "Kiingereza" },
  "common.sw": { en: "Kiswahili", sw: "Kiswahili" },
  "common.official.source": { en: "Official source", sw: "Chanzo rasmi" },
  "common.last.verified": { en: "Last verified", sw: "Imethibitishwa mwisho" },
  "common.programme": { en: "Programme", sw: "Kozi" },
  "common.institution": { en: "Institution", sw: "Chuo" },
  "common.region": { en: "Region", sw: "Mkoa" },
  "common.apply": { en: "Apply", sw: "Omba" },
};

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("nj.lang") : null;
    if (saved === "en" || saved === "sw") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("nj.lang", l);
  };

  const t = (key: string) => dict[key]?.[lang] ?? key;

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

// Helper for bilingual objects
export function bi<T extends { en: string; sw: string }>(obj: T, lang: Lang): string {
  return obj[lang];
}
