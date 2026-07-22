// Illustrative Tanzanian institution list. Presented as sample data — verify
// with the official institution website before relying on it.

export interface Institution {
  id: string;
  name: string;
  short: string;
  type: "public" | "private";
  region: string;
  city: string;
  website: string;
  campuses: { id: string; name: string; region: string }[];
  about: { en: string; sw: string };
}

export const INSTITUTIONS: Institution[] = [
  {
    id: "udsm",
    name: "University of Dar es Salaam",
    short: "UDSM",
    type: "public",
    region: "Dar es Salaam",
    city: "Dar es Salaam",
    website: "https://www.udsm.ac.tz",
    campuses: [
      { id: "main", name: "Mwalimu Nyerere Mlimani Campus", region: "Dar es Salaam" },
      { id: "mubs", name: "UDSM Business School", region: "Dar es Salaam" },
    ],
    about: {
      en: "The oldest and largest public university in Tanzania, offering a wide range of undergraduate programmes.",
      sw: "Chuo kikuu cha umma kikubwa na cha kwanza nchini Tanzania, kinatoa kozi mbalimbali za shahada ya kwanza.",
    },
  },
  {
    id: "sua",
    name: "Sokoine University of Agriculture",
    short: "SUA",
    type: "public",
    region: "Morogoro",
    city: "Morogoro",
    website: "https://www.sua.ac.tz",
    campuses: [{ id: "main", name: "Main Campus, Morogoro", region: "Morogoro" }],
    about: {
      en: "Leading agricultural, veterinary and natural resources university.",
      sw: "Chuo kikuu kinachoongoza katika kilimo, mifugo na maliasili.",
    },
  },
  {
    id: "muhas",
    name: "Muhimbili University of Health and Allied Sciences",
    short: "MUHAS",
    type: "public",
    region: "Dar es Salaam",
    city: "Dar es Salaam",
    website: "https://www.muhas.ac.tz",
    campuses: [{ id: "main", name: "Muhimbili Campus", region: "Dar es Salaam" }],
    about: {
      en: "Tanzania's leading health sciences university (medicine, pharmacy, nursing, dentistry).",
      sw: "Chuo kikuu kinachoongoza kwa sayansi za afya (udaktari, famasia, uuguzi, meno).",
    },
  },
  {
    id: "udom",
    name: "University of Dodoma",
    short: "UDOM",
    type: "public",
    region: "Dodoma",
    city: "Dodoma",
    website: "https://www.udom.ac.tz",
    campuses: [{ id: "main", name: "Chimwaga Campus", region: "Dodoma" }],
    about: {
      en: "A large public university in the capital, offering programmes across most disciplines.",
      sw: "Chuo kikuu kikubwa cha umma katika mji mkuu, kinatoa kozi za taaluma mbalimbali.",
    },
  },
  {
    id: "mzumbe",
    name: "Mzumbe University",
    short: "MU",
    type: "public",
    region: "Morogoro",
    city: "Mzumbe",
    website: "https://www.mzumbe.ac.tz",
    campuses: [
      { id: "main", name: "Main Campus, Mzumbe", region: "Morogoro" },
      { id: "dsm", name: "Dar es Salaam Campus", region: "Dar es Salaam" },
    ],
    about: {
      en: "Known for public administration, management and law programmes.",
      sw: "Kinajulikana kwa kozi za utawala wa umma, menejimenti na sheria.",
    },
  },
  {
    id: "ardhi",
    name: "Ardhi University",
    short: "ARU",
    type: "public",
    region: "Dar es Salaam",
    city: "Dar es Salaam",
    website: "https://www.aru.ac.tz",
    campuses: [{ id: "main", name: "Observation Hill", region: "Dar es Salaam" }],
    about: {
      en: "Specialises in lands, architecture, urban planning and environmental studies.",
      sw: "Kina utaalamu wa ardhi, ujenzi, mipango miji na mazingira.",
    },
  },
  {
    id: "nmaist",
    name: "Nelson Mandela African Institution of Science and Technology",
    short: "NM-AIST",
    type: "public",
    region: "Arusha",
    city: "Arusha",
    website: "https://www.nm-aist.ac.tz",
    campuses: [{ id: "main", name: "Tengeru Campus", region: "Arusha" }],
    about: {
      en: "Research-intensive science and engineering institution.",
      sw: "Chuo cha utafiti wa kina katika sayansi na uhandisi.",
    },
  },
  {
    id: "dit",
    name: "Dar es Salaam Institute of Technology",
    short: "DIT",
    type: "public",
    region: "Dar es Salaam",
    city: "Dar es Salaam",
    website: "https://www.dit.ac.tz",
    campuses: [{ id: "main", name: "Bibi Titi Campus", region: "Dar es Salaam" }],
    about: {
      en: "Technical institution offering diplomas and bachelor's in engineering fields.",
      sw: "Chuo cha ufundi kinachotoa stashahada na shahada za uhandisi.",
    },
  },
  {
    id: "iaa",
    name: "Institute of Accountancy Arusha",
    short: "IAA",
    type: "public",
    region: "Arusha",
    city: "Arusha",
    website: "https://www.iaa.ac.tz",
    campuses: [{ id: "main", name: "Njiro Campus", region: "Arusha" }],
    about: {
      en: "Specialised in accountancy, finance and business programmes.",
      sw: "Chuo maalumu cha uhasibu, fedha na biashara.",
    },
  },
  {
    id: "ifm",
    name: "Institute of Finance Management",
    short: "IFM",
    type: "public",
    region: "Dar es Salaam",
    city: "Dar es Salaam",
    website: "https://www.ifm.ac.tz",
    campuses: [{ id: "main", name: "Shaaban Robert Campus", region: "Dar es Salaam" }],
    about: {
      en: "Focused on finance, banking, insurance and computing.",
      sw: "Kimejikita katika fedha, benki, bima na kompyuta.",
    },
  },
  {
    id: "cbe",
    name: "College of Business Education",
    short: "CBE",
    type: "public",
    region: "Dar es Salaam",
    city: "Dar es Salaam",
    website: "https://www.cbe.ac.tz",
    campuses: [
      { id: "dsm", name: "Bibi Titi Campus", region: "Dar es Salaam" },
      { id: "dodoma", name: "Dodoma Campus", region: "Dodoma" },
    ],
    about: {
      en: "Business, accountancy and procurement education.",
      sw: "Elimu ya biashara, uhasibu na manunuzi.",
    },
  },
  {
    id: "sjut",
    name: "St. Joseph University in Tanzania",
    short: "SJUIT",
    type: "private",
    region: "Dar es Salaam",
    city: "Dar es Salaam",
    website: "https://www.sjuit.ac.tz",
    campuses: [{ id: "main", name: "Boko Campus", region: "Dar es Salaam" }],
    about: {
      en: "Private university offering engineering, health and computing.",
      sw: "Chuo binafsi kinachotoa uhandisi, afya na kompyuta.",
    },
  },
  {
    id: "ruco",
    name: "Ruaha Catholic University",
    short: "RUCU",
    type: "private",
    region: "Iringa",
    city: "Iringa",
    website: "https://www.rucu.ac.tz",
    campuses: [{ id: "main", name: "Iringa Campus", region: "Iringa" }],
    about: {
      en: "Private university offering law, business and social sciences.",
      sw: "Chuo binafsi kinachotoa sheria, biashara na sayansi za jamii.",
    },
  },
  {
    id: "sekomu",
    name: "Sebastian Kolowa Memorial University",
    short: "SEKOMU",
    type: "private",
    region: "Tanga",
    city: "Lushoto",
    website: "https://www.sekomu.ac.tz",
    campuses: [{ id: "main", name: "Lushoto Campus", region: "Tanga" }],
    about: {
      en: "Private university with strong education and social sciences programmes.",
      sw: "Chuo binafsi chenye kozi imara za elimu na sayansi za jamii.",
    },
  },
  {
    id: "smu",
    name: "St. Augustine University of Tanzania",
    short: "SAUT",
    type: "private",
    region: "Mwanza",
    city: "Mwanza",
    website: "https://www.saut.ac.tz",
    campuses: [
      { id: "main", name: "Malimbe Campus", region: "Mwanza" },
      { id: "arusha", name: "Arusha Centre", region: "Arusha" },
    ],
    about: {
      en: "One of the largest private universities in Tanzania.",
      sw: "Mojawapo ya vyuo vikuu vikubwa binafsi Tanzania.",
    },
  },
];

export const REGIONS = Array.from(new Set(INSTITUTIONS.flatMap((i) => i.campuses.map((c) => c.region)))).sort();
