export interface Scholarship {
  id: string;
  name: { en: string; sw: string };
  provider: string;
  eligibility: { en: string; sw: string };
  level: "Undergraduate" | "Postgraduate" | "Diploma";
  fields: string[];
  opens: string;
  deadline: string;
  documents: { en: string; sw: string }[];
  applicationUrl: string;
  status: "open" | "upcoming" | "closed";
  source: { title: string; url: string };
  lastVerified: string;
}

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "heslb-loan",
    name: { en: "HESLB Student Loan (Undergraduate)", sw: "Mkopo wa HESLB (Shahada ya Kwanza)" },
    provider: "Higher Education Students' Loans Board",
    eligibility: {
      en: "Tanzanian citizens admitted to eligible higher education institutions who meet HESLB means testing criteria.",
      sw: "Raia wa Tanzania waliodahiliwa katika vyuo vinavyostahili na kutimiza vigezo vya HESLB.",
    },
    level: "Undergraduate",
    fields: ["All eligible fields"],
    opens: "2026-07-01",
    deadline: "2026-09-30",
    documents: [
      { en: "Admission letter", sw: "Barua ya udahili" },
      { en: "Form Six certificate", sw: "Cheti cha Kidato cha Sita" },
      { en: "Birth certificate", sw: "Cheti cha kuzaliwa" },
      { en: "Guardian/parents' documents", sw: "Nyaraka za mzazi/mlezi" },
    ],
    applicationUrl: "https://www.heslb.go.tz",
    status: "upcoming",
    source: { title: "HESLB (illustrative)", url: "https://www.heslb.go.tz" },
    lastVerified: "2026-06-15",
  },
  {
    id: "mastercard",
    name: { en: "Mastercard Foundation Scholars Program", sw: "Ufadhili wa Mastercard Foundation" },
    provider: "Mastercard Foundation",
    eligibility: {
      en: "Academically talented but economically disadvantaged students from Africa.",
      sw: "Wanafunzi wenye vipaji na wenye uhitaji wa kifedha kutoka Afrika.",
    },
    level: "Undergraduate",
    fields: ["All"],
    opens: "2026-05-01",
    deadline: "2026-08-31",
    documents: [
      { en: "Academic transcripts", sw: "Nakala za matokeo" },
      { en: "Recommendation letters", sw: "Barua za mapendekezo" },
      { en: "Personal statement", sw: "Taarifa binafsi" },
    ],
    applicationUrl: "https://mastercardfdn.org",
    status: "open",
    source: { title: "Mastercard Foundation (illustrative)", url: "https://mastercardfdn.org" },
    lastVerified: "2026-06-10",
  },
  {
    id: "china-mofcom",
    name: { en: "China MOFCOM Scholarship", sw: "Ufadhili wa MOFCOM China" },
    provider: "Government of China",
    eligibility: { en: "Applicants seeking undergraduate/postgraduate study in China.", sw: "Waombaji wa masomo China." },
    level: "Undergraduate",
    fields: ["Engineering", "ICT", "Health"],
    opens: "2026-04-15",
    deadline: "2026-07-15",
    documents: [
      { en: "Passport copy", sw: "Nakala ya paspoti" },
      { en: "Academic certificates", sw: "Vyeti vya elimu" },
      { en: "Physical examination form", sw: "Fomu ya uchunguzi wa afya" },
    ],
    applicationUrl: "https://campuschina.org",
    status: "open",
    source: { title: "China MOFCOM (illustrative)", url: "https://campuschina.org" },
    lastVerified: "2026-06-01",
  },
  {
    id: "commonwealth",
    name: { en: "Commonwealth Shared Scholarship", sw: "Ufadhili wa Jumuiya ya Madola" },
    provider: "Commonwealth Scholarships Commission",
    eligibility: {
      en: "Students from developing Commonwealth countries who cannot afford UK study.",
      sw: "Wanafunzi kutoka nchi za Jumuiya ya Madola wasioweza kumudu masomo Uingereza.",
    },
    level: "Postgraduate",
    fields: ["All"],
    opens: "2026-06-01",
    deadline: "2026-10-15",
    documents: [
      { en: "Bachelor's transcript", sw: "Nakala ya shahada ya kwanza" },
      { en: "Two references", sw: "Marejeleo mawili" },
    ],
    applicationUrl: "https://cscuk.fcdo.gov.uk",
    status: "upcoming",
    source: { title: "CSC UK (illustrative)", url: "https://cscuk.fcdo.gov.uk" },
    lastVerified: "2026-06-10",
  },
  {
    id: "yes-fund",
    name: { en: "Young Entrepreneurs Scholarship (SIDO)", sw: "Ufadhili wa Wajasiriamali Vijana (SIDO)" },
    provider: "Small Industries Development Organisation",
    eligibility: { en: "Tanzanian youth pursuing business or agriculture-related programmes.", sw: "Vijana wa Tanzania wanaosoma kozi za biashara au kilimo." },
    level: "Undergraduate",
    fields: ["Business", "Agriculture"],
    opens: "2026-06-01",
    deadline: "2026-09-01",
    documents: [{ en: "Admission letter", sw: "Barua ya udahili" }, { en: "Business plan draft", sw: "Rasimu ya mpango wa biashara" }],
    applicationUrl: "https://www.sido.go.tz",
    status: "open",
    source: { title: "SIDO (illustrative)", url: "https://www.sido.go.tz" },
    lastVerified: "2026-06-01",
  },
];
