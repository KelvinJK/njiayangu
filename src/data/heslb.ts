export interface ChecklistItem {
  id: string;
  label: { en: string; sw: string };
  description?: { en: string; sw: string };
  category: "documents" | "eligibility" | "process" | "review";
}

export const HESLB_ACADEMIC_YEAR = "2026/2027";

export const HESLB_CHECKLIST: ChecklistItem[] = [
  { id: "form-six-cert", label: { en: "Form Six certificate (or provisional results)", sw: "Cheti cha Kidato cha Sita (au matokeo ya muda)" }, category: "documents" },
  { id: "form-four-cert", label: { en: "Form Four certificate", sw: "Cheti cha Kidato cha Nne" }, category: "documents" },
  { id: "birth-cert", label: { en: "Birth certificate", sw: "Cheti cha kuzaliwa" }, category: "documents" },
  { id: "national-id", label: { en: "NIDA / national identification number", sw: "Nambari ya kitambulisho cha NIDA" }, category: "documents" },
  { id: "admission-letter", label: { en: "Admission letter from an eligible institution", sw: "Barua ya udahili kutoka chuo kinachostahili" }, category: "eligibility" },
  { id: "parent-death-cert", label: { en: "Death certificate(s) if applicable (deceased parent)", sw: "Cheti cha kifo (mzazi aliyefariki, kama inatumika)" }, category: "documents" },
  { id: "parent-ids", label: { en: "Parents' / guardians' identification", sw: "Vitambulisho vya wazazi/walezi" }, category: "documents" },
  { id: "sponsorship-letter", label: { en: "Local government sponsorship / recommendation letter", sw: "Barua ya udhamini kutoka serikali ya mtaa" }, category: "documents" },
  { id: "means-test", label: { en: "Complete HESLB means testing questionnaire honestly", sw: "Jaza fomu ya vigezo vya HESLB kwa ukweli" }, category: "process" },
  { id: "bank-account", label: { en: "Have or open a bank account in your name", sw: "Fungua au uwe na akaunti ya benki kwa jina lako" }, category: "process" },
  { id: "olams-account", label: { en: "Create an OLAMS account on the HESLB portal", sw: "Fungua akaunti kwenye mfumo wa OLAMS wa HESLB" }, category: "process" },
  { id: "upload-docs", label: { en: "Upload all required documents on OLAMS", sw: "Pakia nyaraka zote zinazohitajika kwenye OLAMS" }, category: "process" },
  { id: "review-details", label: { en: "Review every entry before final submission", sw: "Kagua kila taarifa kabla ya kutuma" }, category: "review" },
  { id: "print-confirmation", label: { en: "Print the confirmation slip after submission", sw: "Chapisha risiti ya uthibitisho baada ya kutuma" }, category: "review" },
];

export const HESLB_STEPS: { en: string; sw: string }[] = [
  { en: "Get admission to a HESLB-eligible institution.", sw: "Pata udahili katika chuo kinachostahili HESLB." },
  { en: "Prepare all required documents (checklist below).", sw: "Andaa nyaraka zote zinazohitajika (orodha hapa chini)." },
  { en: "Create an account on the official HESLB portal at www.heslb.go.tz.", sw: "Fungua akaunti kwenye tovuti rasmi ya HESLB (www.heslb.go.tz)." },
  { en: "Fill in the means testing questionnaire truthfully.", sw: "Jaza fomu ya vigezo vya HESLB kwa ukweli." },
  { en: "Upload documents and submit before the deadline.", sw: "Pakia nyaraka na tuma kabla ya tarehe ya mwisho." },
  { en: "Track the status of your application on OLAMS.", sw: "Fuatilia hali ya maombi kupitia OLAMS." },
];

export const HESLB_MISTAKES: { en: string; sw: string }[] = [
  { en: "Submitting without a valid admission letter.", sw: "Kutuma bila barua halali ya udahili." },
  { en: "Mismatched names across birth certificate, ID and admission letter.", sw: "Majina yasiyofanana kwenye cheti cha kuzaliwa, kitambulisho na barua ya udahili." },
  { en: "Unclear or cropped scans of documents.", sw: "Nakala za nyaraka zisizoeleweka au zilizokatwa." },
  { en: "Waiting until the last day to submit.", sw: "Kusubiri hadi siku ya mwisho kutuma." },
  { en: "Not saving the confirmation slip.", sw: "Kutohifadhi risiti ya uthibitisho." },
];

export const HESLB_FAQ: { q: { en: string; sw: string }; a: { en: string; sw: string } }[] = [
  {
    q: { en: "Am I guaranteed a loan if I qualify academically?", sw: "Je, nitapata mkopo hakika kama nafaulu kitaaluma?" },
    a: {
      en: "No. HESLB uses means testing in addition to academic eligibility, and awards depend on annual budget.",
      sw: "Hapana. HESLB hutumia vigezo vya kifedha pamoja na masharti ya kitaaluma, na kiwango hutegemea bajeti ya mwaka.",
    },
  },
  {
    q: { en: "Can I apply before I receive my admission letter?", sw: "Naweza kuomba kabla ya kupata barua ya udahili?" },
    a: {
      en: "You can prepare documents in advance but final submission requires a valid admission letter.",
      sw: "Unaweza kuandaa nyaraka mapema lakini kutuma kunahitaji barua ya udahili halali.",
    },
  },
];
