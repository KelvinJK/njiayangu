export interface Career {
  id: string;
  title: { en: string; sw: string };
  category: string;
  description: { en: string; sw: string };
  activities: { en: string; sw: string }[];
  industries: { en: string; sw: string }[];
  technicalSkills: string[];
  transferableSkills: { en: string; sw: string }[];
  registration?: { en: string; sw: string };
  relatedCareers: string[];
  entrepreneurship?: { en: string; sw: string };
  source: { title: string; url: string };
  lastVerified: string;
}

export const CAREERS: Career[] = [
  {
    id: "medical-doctor",
    title: { en: "Medical Doctor", sw: "Daktari wa Binadamu" },
    category: "Health",
    description: {
      en: "Diagnoses and treats illness in public or private health facilities.",
      sw: "Hutambua na kutibu magonjwa katika vituo vya afya vya umma au binafsi.",
    },
    activities: [
      { en: "Patient consultations", sw: "Kumhudumia mgonjwa" },
      { en: "Diagnosis and treatment planning", sw: "Utambuzi na mpango wa matibabu" },
      { en: "Community health work", sw: "Kazi za afya ya jamii" },
    ],
    industries: [
      { en: "Public hospitals", sw: "Hospitali za umma" },
      { en: "Private clinics", sw: "Kliniki binafsi" },
      { en: "NGOs", sw: "Mashirika yasiyo ya kiserikali" },
    ],
    technicalSkills: ["Clinical assessment", "Basic surgery", "Emergency care"],
    transferableSkills: [
      { en: "Empathy", sw: "Huruma" },
      { en: "Decision-making under pressure", sw: "Kufanya maamuzi kwenye shinikizo" },
    ],
    registration: { en: "Medical Council of Tanganyika (MCT)", sw: "Baraza la Madaktari Tanganyika (MCT)" },
    relatedCareers: ["surgeon", "public-health", "nurse"],
    source: { title: "Ministry of Health career guidance (illustrative)", url: "https://www.moh.go.tz" },
    lastVerified: "2026-05-15",
  },
  {
    id: "civil-engineer",
    title: { en: "Civil Engineer", sw: "Mhandisi wa Ujenzi" },
    category: "Engineering",
    description: {
      en: "Designs and supervises construction of buildings, roads and water works.",
      sw: "Anabuni na kusimamia ujenzi wa majengo, barabara na miundombinu ya maji.",
    },
    activities: [
      { en: "Site inspections", sw: "Ukaguzi wa maeneo ya kazi" },
      { en: "Structural design", sw: "Ubunifu wa miundo" },
    ],
    industries: [
      { en: "Construction firms", sw: "Kampuni za ujenzi" },
      { en: "Government works", sw: "Kazi za serikali" },
    ],
    technicalSkills: ["AutoCAD", "Structural analysis", "Project management"],
    transferableSkills: [{ en: "Problem-solving", sw: "Utatuzi wa matatizo" }],
    registration: { en: "Engineers Registration Board (ERB)", sw: "Bodi ya Usajili wa Wahandisi (ERB)" },
    relatedCareers: ["architect", "urban-planner"],
    entrepreneurship: {
      en: "Start a small contracting or consulting firm after registration and experience.",
      sw: "Anzisha kampuni ndogo ya ukandarasi au ushauri baada ya usajili na uzoefu.",
    },
    source: { title: "ERB career information (illustrative)", url: "https://www.erb.go.tz" },
    lastVerified: "2026-05-15",
  },
  {
    id: "software-engineer",
    title: { en: "Software Engineer", sw: "Mhandisi wa Programu" },
    category: "ICT",
    description: {
      en: "Builds software for businesses, government and mobile applications.",
      sw: "Anatengeneza programu kwa biashara, serikali na programu za simu.",
    },
    activities: [
      { en: "Writing code", sw: "Kuandika msimbo" },
      { en: "Working with product teams", sw: "Kufanya kazi na timu za bidhaa" },
    ],
    industries: [
      { en: "Fintech", sw: "Teknolojia ya fedha" },
      { en: "Telecoms", sw: "Mawasiliano ya simu" },
      { en: "Government digital services", sw: "Huduma za kidijitali za serikali" },
    ],
    technicalSkills: ["JavaScript", "Databases", "APIs", "Version control"],
    transferableSkills: [{ en: "Continuous learning", sw: "Kujifunza kila mara" }],
    relatedCareers: ["data-analyst", "network-admin"],
    entrepreneurship: {
      en: "Freelance app development or launch a SaaS product.",
      sw: "Kufanya kazi kama mtoa huduma huru au kuzindua bidhaa ya SaaS.",
    },
    source: { title: "COSTECH / TCRA career notes (illustrative)", url: "https://www.costech.or.tz" },
    lastVerified: "2026-05-20",
  },
  {
    id: "accountant",
    title: { en: "Accountant", sw: "Mhasibu" },
    category: "Business",
    description: {
      en: "Prepares and audits financial records for organisations.",
      sw: "Anaandaa na kukagua taarifa za fedha za mashirika.",
    },
    activities: [{ en: "Bookkeeping", sw: "Kutunza vitabu vya fedha" }, { en: "Financial reporting", sw: "Taarifa za fedha" }],
    industries: [
      { en: "Banks", sw: "Benki" },
      { en: "Audit firms", sw: "Kampuni za ukaguzi" },
      { en: "Government agencies", sw: "Taasisi za serikali" },
    ],
    technicalSkills: ["IFRS", "Excel / spreadsheet software", "Tax computation"],
    transferableSkills: [{ en: "Attention to detail", sw: "Umakini wa hali ya juu" }],
    registration: { en: "NBAA — National Board of Accountants and Auditors", sw: "NBAA — Bodi ya Wahasibu na Wakaguzi" },
    relatedCareers: ["auditor", "banker"],
    source: { title: "NBAA career information (illustrative)", url: "https://www.nbaa.go.tz" },
    lastVerified: "2026-05-18",
  },
  {
    id: "lawyer",
    title: { en: "Lawyer / Advocate", sw: "Wakili" },
    category: "Law",
    description: {
      en: "Represents clients and provides legal advice.",
      sw: "Anawakilisha wateja na kutoa ushauri wa kisheria.",
    },
    activities: [{ en: "Client consultation", sw: "Kumhudumia mteja" }, { en: "Court appearances", sw: "Mahakamani" }],
    industries: [
      { en: "Law firms", sw: "Kampuni za sheria" },
      { en: "Government legal offices", sw: "Ofisi za sheria za serikali" },
    ],
    technicalSkills: ["Legal research", "Contract drafting", "Case analysis"],
    transferableSkills: [{ en: "Communication", sw: "Mawasiliano" }],
    registration: { en: "Tanganyika Law Society", sw: "Chama cha Wanasheria Tanganyika" },
    relatedCareers: [],
    source: { title: "TLS information (illustrative)", url: "https://www.tls.or.tz" },
    lastVerified: "2026-05-18",
  },
  {
    id: "teacher",
    title: { en: "Secondary School Teacher", sw: "Mwalimu wa Sekondari" },
    category: "Education",
    description: {
      en: "Teaches secondary school subjects in public or private schools.",
      sw: "Anafundisha masomo ya sekondari katika shule za umma au binafsi.",
    },
    activities: [{ en: "Lesson delivery", sw: "Kufundisha darasani" }, { en: "Assessment & marking", sw: "Kutathmini na kusahihisha" }],
    industries: [
      { en: "Public schools", sw: "Shule za umma" },
      { en: "Private schools", sw: "Shule binafsi" },
    ],
    technicalSkills: ["Subject expertise", "Curriculum design"],
    transferableSkills: [{ en: "Public speaking", sw: "Kuzungumza hadharani" }],
    registration: { en: "Teachers Service Commission (TSC)", sw: "Tume ya Utumishi wa Walimu (TSC)" },
    relatedCareers: [],
    source: { title: "TSC career information (illustrative)", url: "https://www.tsc.go.tz" },
    lastVerified: "2026-05-15",
  },
  {
    id: "agronomist",
    title: { en: "Agronomist", sw: "Mtaalamu wa Kilimo" },
    category: "Agriculture",
    description: {
      en: "Advises on crop production and land management.",
      sw: "Anatoa ushauri kuhusu uzalishaji wa mazao na usimamizi wa ardhi.",
    },
    activities: [{ en: "Field trials", sw: "Majaribio ya shambani" }, { en: "Farmer training", sw: "Mafunzo kwa wakulima" }],
    industries: [{ en: "Agribusiness", sw: "Biashara ya kilimo" }, { en: "NGOs", sw: "Mashirika ya jamii" }],
    technicalSkills: ["Soil testing", "Crop protection", "Agri-extension"],
    transferableSkills: [{ en: "Fieldwork", sw: "Kazi za shambani" }],
    relatedCareers: ["entrepreneur"],
    entrepreneurship: {
      en: "Start a supply, seed or agro-processing business.",
      sw: "Anzisha biashara ya pembejeo, mbegu au usindikaji.",
    },
    source: { title: "Ministry of Agriculture (illustrative)", url: "https://www.kilimo.go.tz" },
    lastVerified: "2026-05-25",
  },
  {
    id: "journalist",
    title: { en: "Journalist", sw: "Mwandishi wa Habari" },
    category: "Media",
    description: {
      en: "Reports news for print, broadcast or digital media.",
      sw: "Anaandika habari kwa magazeti, redio, TV au mtandao.",
    },
    activities: [{ en: "Interviewing sources", sw: "Kuhoji vyanzo" }],
    industries: [{ en: "Newsrooms", sw: "Vyombo vya habari" }],
    technicalSkills: ["Reporting", "Editing", "Digital publishing"],
    transferableSkills: [{ en: "Storytelling", sw: "Kusimulia" }],
    relatedCareers: [],
    source: { title: "Media Council of Tanzania (illustrative)", url: "https://www.mct.or.tz" },
    lastVerified: "2026-05-15",
  },
  { id: "surgeon", title: { en: "Surgeon", sw: "Daktari wa Upasuaji" }, category: "Health", description: { en: "Performs surgical procedures.", sw: "Hufanya upasuaji." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: ["medical-doctor"], source: { title: "MCT (illustrative)", url: "https://www.mct.go.tz" }, lastVerified: "2026-05-15" },
  { id: "public-health", title: { en: "Public Health Officer", sw: "Afisa wa Afya ya Umma" }, category: "Health", description: { en: "Promotes community health and disease prevention.", sw: "Kuboresha afya ya jamii na kuzuia magonjwa." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "Ministry of Health (illustrative)", url: "https://www.moh.go.tz" }, lastVerified: "2026-05-15" },
  { id: "pharmacist", title: { en: "Pharmacist", sw: "Mfamasia" }, category: "Health", description: { en: "Dispenses medicines and advises on drug therapy.", sw: "Hutoa dawa na kushauri kuhusu matumizi ya dawa." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "Pharmacy Council (illustrative)", url: "https://www.pc.go.tz" }, lastVerified: "2026-05-15" },
  { id: "nurse", title: { en: "Registered Nurse", sw: "Muuguzi Aliyesajiliwa" }, category: "Health", description: { en: "Provides direct patient care in clinical settings.", sw: "Hutoa huduma za moja kwa moja kwa wagonjwa." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "Tanzania Nursing Council (illustrative)", url: "https://www.tnmc.go.tz" }, lastVerified: "2026-05-15" },
  { id: "urban-planner", title: { en: "Urban Planner", sw: "Mpangaji wa Miji" }, category: "Engineering", description: { en: "Plans land use for cities and towns.", sw: "Anapanga matumizi ya ardhi ya miji." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "PGA (illustrative)", url: "https://www.pgatanzania.or.tz" }, lastVerified: "2026-05-15" },
  { id: "architect", title: { en: "Architect", sw: "Mbunifu wa Majengo" }, category: "Engineering", description: { en: "Designs buildings and interior spaces.", sw: "Anabuni majengo na maeneo ya ndani." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "AQRB (illustrative)", url: "https://www.aqrb.go.tz" }, lastVerified: "2026-05-15" },
  { id: "electrical-engineer", title: { en: "Electrical Engineer", sw: "Mhandisi wa Umeme" }, category: "Engineering", description: { en: "Designs electrical systems and power infrastructure.", sw: "Anabuni mifumo ya umeme na miundombinu ya nishati." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "ERB (illustrative)", url: "https://www.erb.go.tz" }, lastVerified: "2026-05-15" },
  { id: "mechanical-engineer", title: { en: "Mechanical Engineer", sw: "Mhandisi wa Mitambo" }, category: "Engineering", description: { en: "Designs mechanical systems and manufacturing processes.", sw: "Anabuni mifumo ya mitambo na michakato ya utengenezaji." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "ERB (illustrative)", url: "https://www.erb.go.tz" }, lastVerified: "2026-05-15" },
  { id: "data-analyst", title: { en: "Data Analyst", sw: "Mchambuzi wa Data" }, category: "ICT", description: { en: "Analyses data to inform decisions.", sw: "Anachambua data kutoa maamuzi." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "COSTECH (illustrative)", url: "https://www.costech.or.tz" }, lastVerified: "2026-05-15" },
  { id: "network-admin", title: { en: "Network Administrator", sw: "Msimamizi wa Mtandao" }, category: "ICT", description: { en: "Maintains organisational networks.", sw: "Anasimamia mitandao ya kampuni." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "TCRA (illustrative)", url: "https://www.tcra.go.tz" }, lastVerified: "2026-05-15" },
  { id: "banker", title: { en: "Banker", sw: "Afisa Benki" }, category: "Business", description: { en: "Works in banking operations and customer service.", sw: "Anafanya kazi katika benki na huduma kwa wateja." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "BOT career info (illustrative)", url: "https://www.bot.go.tz" }, lastVerified: "2026-05-15" },
  { id: "auditor", title: { en: "Auditor", sw: "Mkaguzi" }, category: "Business", description: { en: "Reviews financial and operational records.", sw: "Hukagua taarifa za fedha na uendeshaji." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "NBAA (illustrative)", url: "https://www.nbaa.go.tz" }, lastVerified: "2026-05-15" },
  { id: "entrepreneur", title: { en: "Entrepreneur", sw: "Mfanyabiashara" }, category: "Business", description: { en: "Builds and runs their own business.", sw: "Anaanzisha na kuendesha biashara yake." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "SIDO (illustrative)", url: "https://www.sido.go.tz" }, lastVerified: "2026-05-15" },
  { id: "procurement-officer", title: { en: "Procurement Officer", sw: "Afisa Manunuzi" }, category: "Business", description: { en: "Manages purchasing and supplier relationships.", sw: "Husimamia manunuzi na uhusiano na wauzaji." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "PPRA (illustrative)", url: "https://www.ppra.go.tz" }, lastVerified: "2026-05-15" },
  { id: "veterinarian", title: { en: "Veterinarian", sw: "Daktari wa Mifugo" }, category: "Agriculture", description: { en: "Provides medical care for animals.", sw: "Hutoa huduma za matibabu kwa wanyama." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "VCT (illustrative)", url: "https://www.vct.go.tz" }, lastVerified: "2026-05-15" },
  { id: "economist", title: { en: "Economist", sw: "Mchumi" }, category: "Social Sciences", description: { en: "Analyses economic data and advises on policy.", sw: "Huchambua data ya uchumi na kushauri sera." }, activities: [], industries: [], technicalSkills: [], transferableSkills: [], relatedCareers: [], source: { title: "NBS / Ministry of Finance (illustrative)", url: "https://www.nbs.go.tz" }, lastVerified: "2026-05-15" },
];

export const CAREER_CATEGORIES = Array.from(new Set(CAREERS.map((c) => c.category))).sort();
