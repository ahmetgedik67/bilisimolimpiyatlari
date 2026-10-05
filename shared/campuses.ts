export const BILFEN_CAMPUSES = [
  { key: "kosuyolu", name: "BİLFEN KOŞUYOLU İLKÖĞRETİM KURUMU" },
  { key: "camlica", name: "BİLFEN ÇAMLICA İLKÖĞRETİM KURUMU" },
  { key: "atasehir", name: "BİLFEN ATAŞEHİR İLKÖĞRETİM KURUMU" },
  { key: "bahcesehir", name: "BİLFEN BAHÇEŞEHİR İLKÖĞRETİM KURUMU" },
  { key: "yenisehir", name: "BİLFEN YENİŞEHİR İLKÖĞRETİM KURUMU" },
  { key: "kurtkoy", name: "BİLFEN KURTKÖY İLKÖĞRETİM KURUMU" },
  { key: "sancaktepe", name: "BİLFEN SANCAKTEPE İLKÖĞRETİM KURUMU" },
  { key: "cayyolu", name: "BİLFEN ÇAYYOLU İLKÖĞRETİM KURUMU" },
  { key: "halkali", name: "BİLFEN HALKALI İLKÖĞRETİM KURUMU" },
  { key: "kayseri", name: "BİLFEN KAYSERİ İLKÖĞRETİM KURUMU" },
  { key: "antalya", name: "BİLFEN ANTALYA İLKÖĞRETİM KURUMU" },
  { key: "bursa", name: "BİLFEN BURSA İLKÖĞRETİM KURUMU" },
  { key: "izmir-bornova", name: "BİLFEN İZMİR BORNOVA İLKÖĞRETİM KURUMU" },
  { key: "iskenderun", name: "BİLFEN İSKENDERUN İLKÖĞRETİM KURUMU" },
  { key: "guzelbahce", name: "BİLFEN GÜZELBAHÇE İLKÖĞRETİM KURUMU" },
  { key: "cukurambar", name: "BİLFEN ÇUKURAMBAR İLKÖĞRETİM KURUMU" },
  { key: "maslak", name: "BİLFEN MASLAK İLKÖĞRETİM KURUMU" },
  { key: "ankara-oran", name: "BİLFEN ANKARA ORAN İLKÖĞRETİM KURUMU" },
  { key: "esensehir", name: "BİLFEN ESENŞEHİR İLKÖĞRETİM KURUMU" },
] as const;

export type BilfenCampusKey = (typeof BILFEN_CAMPUSES)[number]["key"];
export const BILFEN_CAMPUS_KEYS = BILFEN_CAMPUSES.map(campus => campus.key) as [BilfenCampusKey, ...BilfenCampusKey[]];
export const STUDENT_GRADE_LEVELS = ["5", "6", "7"] as const;
export const STUDENT_TRACKS = ["explorer", "innovator", "designer"] as const;
export type StudentGradeLevel = (typeof STUDENT_GRADE_LEVELS)[number];
export type StudentTrack = (typeof STUDENT_TRACKS)[number];

export const STUDENT_TRACK_LABELS: Record<StudentTrack, string> = {
  explorer: "Explorer",
  innovator: "Innovator",
  designer: "Designer",
};
