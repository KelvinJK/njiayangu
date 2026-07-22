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
  "common.loading": { en: "Loading", sw: "Inapakia" },
  "common.open": { en: "Open", sw: "Fungua" },

  "auth.signIn": { en: "Sign in", sw: "Ingia" },
  "auth.createAccount": { en: "Create account", sw: "Fungua akaunti" },
  "auth.forgot": { en: "Forgot password", sw: "Umesahau nywila" },
  "auth.sendReset": { en: "Send reset link", sw: "Tuma kiungo cha kurejesha" },
  "auth.email": { en: "Email address", sw: "Anwani ya barua pepe" },
  "auth.password": { en: "Password", sw: "Nywila" },
  "auth.fullName": { en: "Full name", sw: "Jina kamili" },
  "auth.google": { en: "Continue with Google", sw: "Endelea na Google" },
  "auth.or": { en: "or", sw: "au" },
  "auth.noAccount": { en: "Don't have an account?", sw: "Huna akaunti?" },
  "auth.haveAccount": { en: "Already have an account?", sw: "Una akaunti tayari?" },
  "auth.welcome": { en: "Welcome back", sw: "Karibu tena" },
  "auth.checkEmail": { en: "Check your email to confirm your account.", sw: "Angalia barua pepe yako kuthibitisha akaunti." },
  "auth.resetSent": { en: "Password reset link sent.", sw: "Kiungo cha kurejesha nywila kimetumwa." },
  "auth.subtitle": {
    en: "Save your results, track applications and get HESLB reminders across your devices.",
    sw: "Hifadhi matokeo yako, fuatilia maombi na upate vikumbusho vya HESLB kwenye vifaa vyako.",
  },
  "auth.disclaimer": {
    en: "By continuing you agree that final admission and financing decisions are made by the respective institutions and HESLB.",
    sw: "Kwa kuendelea unakubali kwamba uamuzi wa mwisho wa udahili na ufadhili unafanywa na vyuo husika na HESLB.",
  },
  "auth.already": { en: "You're already signed in.", sw: "Tayari umeingia." },
  "auth.gotoAccount": { en: "Go to my account", sw: "Nenda kwenye akaunti" },
  "auth.gotoHome": { en: "Go to home", sw: "Nenda mwanzo" },

  "account.title": { en: "My account", sw: "Akaunti yangu" },
  "account.profileSection": { en: "Profile", sw: "Wasifu" },
  "account.profileSub": { en: "How we contact and address you.", sw: "Jinsi tunavyowasiliana nawe." },
  "account.academic": { en: "Academic results", sw: "Matokeo ya masomo" },
  "account.academicSub": { en: "Your Form Six combination and grades power all recommendations.", sw: "Mchepuo na alama zako za Kidato cha Sita ndio msingi wa mapendekezo yote." },
  "account.updateAcademics": { en: "Update academics", sw: "Sasisha matokeo" },
  "account.notifications": { en: "Notifications", sw: "Arifa" },
  "account.notificationsSub": { en: "HESLB deadlines and application updates.", sw: "Tarehe za HESLB na taarifa za maombi." },
  "account.viewInbox": { en: "View inbox", sw: "Ona kikasha" },
  "account.saved": { en: "Saved programmes", sw: "Kozi zilizohifadhiwa" },
  "account.heslbReady": { en: "HESLB items ready", sw: "Vipengele vya HESLB tayari" },
  "account.combination": { en: "Combination", sw: "Mchepuo" },
  "account.signOut": { en: "Sign out", sw: "Toka" },
  "account.signedOut": { en: "Signed out.", sw: "Umetoka." },
  "account.save": { en: "Save changes", sw: "Hifadhi mabadiliko" },
  "account.phone": { en: "Phone number", sw: "Nambari ya simu" },
  "account.region": { en: "Region", sw: "Mkoa" },
  "account.selectRegion": { en: "Select region", sw: "Chagua mkoa" },
  "account.signInRequired": { en: "Sign in to view your account", sw: "Ingia kuona akaunti yako" },
  "account.signInRequiredSub": { en: "Your saved programmes, HESLB progress and notifications live here.", sw: "Kozi ulizohifadhi, maendeleo ya HESLB na arifa zipo hapa." },

  "sync.offline": { en: "Offline", sw: "Nje ya mtandao" },
  "sync.syncing": { en: "Syncing", sw: "Inasawazisha" },
  "sync.synced": { en: "Up to date", sw: "Imesawazishwa" },
  "sync.pending": { en: "Not synced", sw: "Haijasawazishwa" },
  "sync.error": { en: "Sync failed", sw: "Kusawazisha kumeshindwa" },
  "sync.now": { en: "Sync now", sw: "Sawazisha sasa" },

  "notif.title": { en: "Notifications", sw: "Arifa" },
  "notif.subtitle": { en: "HESLB, application and calendar reminders.", sw: "Vikumbusho vya HESLB, maombi na kalenda." },
  "notif.empty": { en: "You're all caught up.", sw: "Huna arifa mpya." },
  "notif.emptySub": { en: "We'll notify you here when new deadlines or updates arrive.", sw: "Tutakujulisha hapa tarehe mpya au taarifa zikija." },
  "notif.markAll": { en: "Mark all as read", sw: "Weka zote kuwa zimesomwa" },
  "notif.signInTitle": { en: "Sign in to see notifications", sw: "Ingia kuona arifa" },
  "notif.signInSub": { en: "Deadline and application alerts are tied to your account.", sw: "Arifa za tarehe na maombi zimefungamana na akaunti yako." },
  "notif.emailFooter": { en: "Important deadlines are also emailed to you.", sw: "Tarehe muhimu pia hutumwa kwenye barua pepe." },

  "saved.title": { en: "Saved programmes", sw: "Kozi zilizohifadhiwa" },
  "saved.subtitle": { en: "Quickly review, remove or compare the programmes you bookmarked.", sw: "Angalia, ondoa au linganisha kozi ulizohifadhi kwa haraka." },
  "saved.empty": { en: "No saved programmes yet", sw: "Bado hujahifadhi kozi" },
  "saved.emptySub": { en: "Tap the bookmark icon on any programme to save it for later.", sw: "Bofya alama ya alamisho kwenye kozi yoyote ili kuihifadhi." },
  "saved.browse": { en: "Browse programmes", sw: "Vinjari kozi" },
  "saved.remove": { en: "Remove", sw: "Ondoa" },
  "saved.addCompare": { en: "Add to compare", sw: "Ongeza kulinganisha" },
  "saved.inCompare": { en: "In compare", sw: "Iko kwenye kulinganisha" },
  "saved.compareAll": { en: "Compare selected", sw: "Linganisha zilizochaguliwa" },
  "saved.count": { en: "saved", sw: "zimehifadhiwa" },
  "saved.viewSaved": { en: "View saved programmes", sw: "Ona kozi zilizohifadhiwa" },
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
