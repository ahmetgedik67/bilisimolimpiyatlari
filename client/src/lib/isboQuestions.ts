/**
 * İSBO Soru Atölyesi veri katmanı.
 *
 * İki soru seti vardır:
 *  - ISBO_EXAM_QUESTIONS (isboExamQuestions.ts): İstanbul Bilim Olimpiyatları
 *    2024 ortaokul bilgisayar ön eleme soruları; soru görselleri formdan
 *    alınmıştır (client/public/assets/isbo/q01..q25.png). Çözümler "önerilen
 *    çözüm" niteliğindedir.
 *  - ISBO_DRILL_QUESTIONS (bu dosya): konu ve beceri yapısından esinlenen
 *    özgün alıştırma soruları.
 *
 * Her soru beş aşamada incelenir: Oku → Ayıştır → İzle (animasyon) →
 * Yorumla → Yanıtla.
 */

export type AnimationKind =
  | "counter"
  | "binary"
  | "flow"
  | "grid"
  | "trace"
  | "sequence"
  | "sets"
  | "swap"
  | "graph"
  | "table";

/** Graf animasyonu için sabit düğüm/kenar tanımı. */
export type GraphSpec = {
  nodes: Array<{ id: string; x: number; y: number }>;
  edges: Array<{ a: string; b: string; w: number }>;
};

export type TableRow = { cells: string[]; state?: "ok" | "no" | "hi" };

export type AnimationSpec = {
  kind: AnimationKind;
  heading: string;
  /** trace: satır satır kod */
  codeLines?: string[];
  /** graph: sabit şebeke */
  graph?: GraphSpec;
  /** table: adım adım açılan tablo satırları */
  rows?: TableRow[];
  /** sequence: sabit şerit hücreleri */
  cells?: string[];
  /** sets: iki küme */
  setA?: string[];
  setB?: string[];
  setLabels?: [string, string];
  /** swap: hedef dizilim */
  target?: string[];
};

export type AnimStep = {
  label: string;
  note: string;
  vars?: Array<{ name: string; value: string; highlight?: boolean }>;
  /** counter animasyonu için */
  boxLabel?: string;
  boxValue?: string;
  boxDelta?: string;
  /** binary animasyonu için */
  bits?: Array<{ bit: string; role: "left" | "right" | "out" }>;
  binaryNote?: string;
  /** flow animasyonu için */
  flowState?: "true" | "false";
  flowLeft?: string;
  flowRight?: string;
  /** grid animasyonu için */
  grid?: { cols: number; robot: number; trail: number[] };
  /** trace animasyonu için: aktif satır (0 tabanlı) ve birikimli çıktı */
  line?: number;
  output?: string;
  /** sequence animasyonu için: vurgulanan hücre indeksleri */
  active?: number[];
  /** sets animasyonu için: kümelerde vurgulanan indeksler */
  hiA?: number[];
  hiB?: number[];
  /** swap animasyonu için: o andaki dizilim, seçili ve yerleşmiş indeksler */
  tokens?: string[];
  hi?: number[];
  lock?: number[];
  /** graph animasyonu için: rota düğümleri, rota kenar indeksleri, toplam */
  pathNodes?: string[];
  pathEdges?: number[];
  total?: string;
};

export type IsboPhase = {
  id: "oku" | "ayistir" | "izle" | "yorumla" | "yanitla";
  title: string;
  body: string;
  /** ayıştır aşamasındaki bilgi kartları */
  cards?: Array<{ label: string; value: string }>;
};

export type IsboQuestion = {
  id: string;
  number: string;
  topic: string;
  skill: string;
  /** gerçek sınav sorularında soru görselinin public yolu */
  image?: string;
  /** sorunun ait olduğu bölüm/ortak açıklama grubu */
  section?: string;
  /** bölüm sorularının ortak giriş metni (formdaki [a-b] açıklamaları) */
  sectionNote?: string;
  /** kısa Türkçe özet; asıl soru metni görselde ya da code alanındadır */
  prompt: string;
  code?: string;
  options: string[];
  /** şıkların okunabilir içerikleri (görselden çözümlenmiş metin) */
  optionNotes?: string[];
  answer: string;
  explanation: string;
  animation: AnimationSpec;
  animSteps: AnimStep[];
  phases: IsboPhase[];
};

/** Özgün alıştırma seti: İSBO konu yapısından esinlenen 5 soru. */
export const ISBO_DRILL_QUESTIONS: IsboQuestion[] = [
  {
    id: "isbo-01",
    number: "A1",
    topic: "Değişkenler",
    skill: "Atama kurallarını izleme",
    prompt:
      "Aşağıdaki C programı çalıştırıldığında ekrana hangi değer yazılır?\n\nNot: Değişkenler her satırda güncellenir; eski değer korunmaz.",
    code: "int x = 7;\nx = x + 4;\nx = x / 2;\nprintf(\"%d\", x);",
    options: ["2", "5", "6", "7", "11"],
    answer: "5",
    explanation:
      "x=7 → 7+4=11 → 11/2=5 (tam sayı bölmesi). Tam sayı bölmesi küsuratı atar; bu yüzden cevap 5,5 değil 5'tir.",
    animation: { kind: "counter", heading: "Kutu animasyonu: x kutusu satır satır değişiyor" },
    animSteps: [
      { label: "1. satır", note: "int x = 7 — x kutusu oluşur, içine 7 konur.", boxLabel: "x", boxValue: "7", vars: [{ name: "x", value: "7", highlight: true }] },
      { label: "2. satır", note: "x = x + 4 — sağ taraf önce hesaplanır: 7+4=11, sonra kutuya yazılır.", boxLabel: "x", boxValue: "11", boxDelta: "+4", vars: [{ name: "x", value: "7 → 11", highlight: true }] },
      { label: "3. satır", note: "x = x / 2 — int bölme: 11/2=5 (küsurat .5 atılır).", boxLabel: "x", boxValue: "5", boxDelta: "÷2", vars: [{ name: "x", value: "11 → 5", highlight: true }] },
      { label: "4. satır", note: "printf — kutudaki son değer ekrana yazılır.", boxLabel: "x", boxValue: "5", vars: [{ name: "çıktı", value: "5", highlight: true }] },
    ],
    phases: [
      { id: "oku", title: "Soruyu oku", body: "Önce metnin tamamını bir kez oku; soruda senden ne istendiğini (ekrana yazılan değer) belirle. 'Not' satırı, atamaların üst üste yazıldığını söylüyor." },
      { id: "ayistir", title: "Bilgiyi ayıştır", body: "Soruyu parçalara ayır: verilenler, işlem sırası, çıktı. Burada verilenler x=7 ve iki atama; istenen ise printf'in yazdığı değer.", cards: [ { label: "Verilen", value: "x = 7" }, { label: "İşlemler", value: "+4, ÷2" }, { label: "İstenen", value: "printf çıktısı" } ] },
      { id: "izle", title: "Kodu izle", body: "Animasyonda x kutusunun her satırda nasıl değiştiğini izle. Dikkat: x = x + 4'te önce sağ taraf (7+4) hesaplanır, sonra sonuç kutuya yazılır." },
      { id: "yorumla", title: "Yorumla", body: "Kritik adım 11/2. C dilinde iki tam sayının bölümü tam sayıdır: 5.5 değil 5. Yarışmalarda en sık tuzak budur; seçeneklerde 5.5 yerine 6 gibi 'yuvarlanmış' değerler olur." },
      { id: "yanitla", title: "Yanıtla ve gerekçelendir", body: "Cevabını seçmeden önce yüksek sesle gerekçelendir: '7, +4 ile 11, ÷2 ile 5.' Sonra işaretle ve açıklamayla karşılaştır." },
    ],
  },
  {
    id: "isbo-02",
    number: "A2",
    topic: "Sayı sistemleri",
    skill: "İkilik ↔ onluk dönüşüm",
    prompt:
      "İkili sayı sisteminde 1011 sayısının onluk karşılığı kaçtır?\n\nNot: Her basamağın bir ağırlığı vardır; soldan sağa 8, 4, 2, 1.",
    options: ["9", "11", "12", "13", "14"],
    answer: "11",
    explanation:
      "1×8 + 0×4 + 1×2 + 1×1 = 8+2+1 = 11. Yalnız 1 olan basamağın ağırlıkları toplanır; 0'lık basamak katkı vermez.",
    animation: { kind: "binary", heading: "Basamak animasyonu: her bitin ağırlığı ve katkısı" },
    animSteps: [
      { label: "Basamak 1", note: "En soldaki bit 1. Ağırlığı 8. Katkı: 1×8=8.", bits: [ { bit: "1", role: "left" }, { bit: "0", role: "right" }, { bit: "1", role: "right" }, { bit: "1", role: "right" } ], binaryNote: "Toplam: 8" },
      { label: "Basamak 2", note: "İkinci bit 0. Ağırlığı 4. Katkı: 0×4=0.", bits: [ { bit: "0", role: "out" }, { bit: "1", role: "left" }, { bit: "0", role: "right" }, { bit: "1", role: "right" } ], binaryNote: "Toplam: 8" },
      { label: "Basamak 3", note: "Üçüncü bit 1. Ağırlığı 2. Katkı: 1×2=2.", bits: [ { bit: "0", role: "out" }, { bit: "0", role: "out" }, { bit: "1", role: "left" }, { bit: "1", role: "right" } ], binaryNote: "Toplam: 8+2=10" },
      { label: "Basamak 4", note: "Son bit 1. Ağırlığı 1. Katkı: 1×1=1.", bits: [ { bit: "0", role: "out" }, { bit: "0", role: "out" }, { bit: "1", role: "out" }, { bit: "1", role: "left" } ], binaryNote: "Toplam: 8+2+1=11" },
    ],
    phases: [
      { id: "oku", title: "Soruyu oku", body: "Soru ikilikten onluğa dönüşüm istiyor. 'Not' satırı ağırlıkları veriyor: 8, 4, 2, 1. Bu ipucu sayıyı okurken kullanılmalı." },
      { id: "ayistir", title: "Bilgiyi ayıştır", body: "Verilen: 1011₂. İstenen: onluk değer. Yöntem: her 1 bitin ağırlığını topla. Seçeneklerde 9, 13, 14 gibi tuzaklar var — yanlış ağırlık dizilimlerinin ürünleri.", cards: [ { label: "Verilen", value: "1011₂" }, { label: "Ağırlıklar", value: "8·4·2·1" }, { label: "İstenen", value: "onluk değer" } ] },
      { id: "izle", title: "Basamakları izle", body: "Animasyon bitleri soldan sağa işaretler; her adımda yalnız bir bit 'aktif'. 0'lık basamaklar sönük kalır — katkıları yoktur." },
      { id: "yorumla", title: "Yorumla", body: "1011₂ için katkılar 8+2+1=11. Peki 1101₂ olsaydı? 8+4+1=13 olurdu. Yöntem aynı: 1 olan basamakların ağırlıklarını topla. Bunu içselleştiren öğrenci tüm ikilik sorularını bir formülle çözer." },
      { id: "yanitla", title: "Yanıtla ve gerekçelendir", body: "'8+2+1=11' cümlesini kur, sonra seç. Doğru cevap 11." },
    ],
  },
  {
    id: "isbo-03",
    number: "A3",
    topic: "Koşullar",
    skill: "Çok kollu if-else akışı",
    prompt:
      "Programın çıktısı nedir?\n\nNot: Yalnız ilk doğru koşulun bloğu çalışır; diğerleri atlanır.",
    code: "int s = 12;\nif (s > 20) {\n  printf(\"A\");\n} else if (s > 10) {\n  printf(\"B\");\n} else {\n  printf(\"C\");\n}",
    options: ["A", "B", "C", "AB", "ABC"],
    answer: "B",
    explanation:
      "s=12: s>20 yanlış (ilk dal atlanır), s>10 doğru → yalnız 'B' yazılır. Çok kollu if-else'te ilk doğru koşul çalışır ve zincir biter.",
    animation: { kind: "flow", heading: "Akış şeması: karar kapılarından geçiş" },
    animSteps: [
      { label: "Başlangıç", note: "s = 12. Akış ilk kapıya gelir.", flowState: "true", flowLeft: "s > 20", flowRight: "s > 10", vars: [{ name: "s", value: "12", highlight: true }] },
      { label: "Kapı 1", note: "12 > 20 mi? Hayır → else if dalına iner.", flowState: "false", flowLeft: "s > 20", flowRight: "s > 10", vars: [{ name: "s>20", value: "yanlış", highlight: true }] },
      { label: "Kapı 2", note: "12 > 10 mu? Evet → bu blok çalışır.", flowState: "true", flowLeft: "s > 10", flowRight: "else", vars: [{ name: "s>10", value: "doğru", highlight: true }] },
      { label: "Çıktı", note: "printf(\"B\") çalışır; else bloğu hiç değerlendirilmez.", flowState: "true", flowLeft: "printf B", flowRight: "else C", vars: [{ name: "çıktı", value: "B", highlight: true }] },
    ],
    phases: [
      { id: "oku", title: "Soruyu oku", body: "Soru bir akış sorusu: hangi blok çalışacak? 'Not' satırı kritik: yalnız ilk doğru koşul çalışır. AB ya da BC gibi seçenekler bu kuralı bilmeyenlere göre tasarlanmıştır." },
      { id: "ayistir", title: "Bilgiyi ayıştır", body: "Verilen: s=12. Kapılar: s>20, s>10, else. İstenen: ekrana yazan harf. Seçeneklerdeki 'AB', 'ABC' kombinasyonları zincirin kuralını test eder.", cards: [ { label: "Verilen", value: "s = 12" }, { label: "Kapılar", value: ">20, >10, else" }, { label: "İstenen", value: "tek harf çıktı" } ] },
      { id: "izle", title: "Akışı izle", body: "Animasyonda top kapılardan geçer: Kapı 1'den 'hayır' yolu, Kapı 2'den 'evet' yolu. else bloğu topa hiç ulaşmaz." },
      { id: "yorumla", title: "Yorumla", body: "s=22 olsaydı 'A' yazardı (ilk kapıdan geçer, zincir biter). s=5 olsaydı her iki koşul da yanlış olurdu → 'C'. Aynı yapı üç farklı değerle üç farklı sonuç üretir — bu genellik yarışmaların sevdiği yorumlama biçimidir." },
      { id: "yanitla", title: "Yanıtla ve gerekçelendir", body: "'12>20 yanlış, 12>10 doğru, ilk doğru blok çalışır' de; sonra B'yi işaretle." },
    ],
  },
  {
    id: "isbo-04",
    number: "A4",
    topic: "Döngüler",
    skill: "Sayaç ve birikimli toplam izleme",
    prompt:
      "Döngü bittiğinde toplam kaçtır?\n\nNot: Döngü gövdesi i = 1, 2, 3 değerleri için çalışır; i = 4'te koşul bozulur.",
    code: "int toplam = 0;\nfor (int i = 1; i <= 3; i++) {\n  toplam = toplam + i;\n}\nprintf(\"%d\", toplam);",
    options: ["3", "6", "9", "10", "12"],
    answer: "6",
    explanation:
      "Turlar: i=1 → toplam=1; i=2 → toplam=3; i=3 → toplam=6. i=4'te koşul 4<=3 yanlış olur, döngü durur. Sonuç 6.",
    animation: { kind: "counter", heading: "Sayaç animasyonu: i tur tur ilerliyor, toplam birikiyor" },
    animSteps: [
      { label: "Başlangıç", note: "toplam=0, i henüz yok. Döngü ilk turu hazırlar.", boxLabel: "toplam", boxValue: "0", vars: [ { name: "toplam", value: "0" }, { name: "i", value: "—" } ] },
      { label: "Tur 1", note: "i=1: toplam = 0+1 = 1. Sayaç 2'ye geçer.", boxLabel: "toplam", boxValue: "1", boxDelta: "+1", vars: [ { name: "toplam", value: "1", highlight: true }, { name: "i", value: "1" } ] },
      { label: "Tur 2", note: "i=2: toplam = 1+2 = 3. Sayaç 3'e geçer.", boxLabel: "toplam", boxValue: "3", boxDelta: "+2", vars: [ { name: "toplam", value: "3", highlight: true }, { name: "i", value: "2" } ] },
      { label: "Tur 3", note: "i=3: toplam = 3+3 = 6. Sayaç 4'e geçer.", boxLabel: "toplam", boxValue: "6", boxDelta: "+3", vars: [ { name: "toplam", value: "6", highlight: true }, { name: "i", value: "3" } ] },
      { label: "Dur", note: "i=4: koşul 4<=3 yanlış → döngü biter, printf 6 yazar.", boxLabel: "toplam", boxValue: "6", vars: [ { name: "toplam", value: "6", highlight: true }, { name: "i", value: "4 (durdurdu)" } ] },
    ],
    phases: [
      { id: "oku", title: "Soruyu oku", body: "Soruda döngünün kaç tur döneceği 'Not' satırında ipuçlanmış: i=1,2,3. Görev, toplamın tur tur nasıl biriktiğini takip etmek." },
      { id: "ayistir", title: "Bilgiyi ayıştır", body: "Verilen: toplam=0, i=1'den başlar, koşul i<=3. Gövde: toplam += i. Tuzaklar: 3 (yalnız son i), 9 (çarpım karışımı), 10 (sınırı aşan sayım).", cards: [ { label: "Başlangıç", value: "toplam=0, i=1" }, { label: "Turlar", value: "i = 1..3" }, { label: "İstenen", value: "döngü sonundaki toplam" } ] },
      { id: "izle", title: "Turları izle", body: "Animasyonda toplam kutusu her turda büyür: 0→1→3→6. Sayaç i ise 1→2→3→4 gider; 4'te koşul kırılır ve döngü durur." },
      { id: "yorumla", title: "Yorumla", body: "Genelleme: 1'den n'e kadar toplam n(n+1)/2'dir. n=3 için 6. Bu formülü bilen öğrenci döngüyü tur tur saymadan da sonucu kontrol edebilir — iki yöntemin aynı sonucu vermesi en güçlü doğrulamadır." },
      { id: "yanitla", title: "Yanıtla ve gerekçelendir", body: "'1+2+3=6, i=4'te durdu' cümlesiyle işaretle: 6." },
    ],
  },
  {
    id: "isbo-05",
    number: "A5",
    topic: "Robot komutları",
    skill: "Adım adım yol planlama",
    prompt:
      "Robot ızgarada başlangıç karesinden aşağıdaki programı uygular. Program bittiğinde robot hangi karededir?\n\nNot: Robot aşağı dönük başlar; R bir sağa dönüş, F bir kare ileri gitme komutudur.",
    code: "F\nR\nF\nL\nF",
    options: ["(1,0)", "(1,1)", "(2,0)", "(2,1)", "(1,2)"],
    answer: "(2,1)",
    explanation:
      "F: aşağı 1 kare → (1,0). R: robot sağa döner. F: sağa 1 kare → (1,1). L: robot tekrar aşağı döner. F: aşağı 1 kare → (2,1). İz: (1,0),(1,1),(2,1); son kare (2,1).",
    animation: { kind: "grid", heading: "Izgara animasyonu: robotun adım adım yürüyüşü" },
    animSteps: [
      { label: "Başlangıç", note: "Robot (0,0)'da, aşağı dönük.", grid: { cols: 3, robot: 0, trail: [] } },
      { label: "F", note: "Aşağı 1 kare → (1,0).", grid: { cols: 3, robot: 3, trail: [0] } },
      { label: "R", note: "Sağa döner; artık sağa yürür.", grid: { cols: 3, robot: 3, trail: [0, 3] } },
      { label: "F", note: "Sağa 1 kare → (1,1).", grid: { cols: 3, robot: 4, trail: [0, 3] } },
      { label: "L", note: "Sola döner; tekrar aşağı yürür.", grid: { cols: 3, robot: 4, trail: [0, 3, 4] } },
      { label: "F", note: "Aşağı 1 kare → (2,1). Program biter.", grid: { cols: 3, robot: 7, trail: [0, 3, 4, 7] } },
    ],
    phases: [
      { id: "oku", title: "Soruyu oku", body: "Robot sorularında ilk iş yönü belirlemektir: robot AŞAĞI dönük başlıyor. R sağa dönüş, L sola dönüş; F ise dönük olduğu yöne bir kare götürür." },
      { id: "ayistir", title: "Bilgiyi ayıştır", body: "Program: F, R, F, L, F — 5 komut. Verilen: başlangıç (0,0), yön aşağı. İstenen: son kare. Seçenekler (satır,kolon) çiftleridir; iz takibi yapılmadan işaret yapılmamalı.", cards: [ { label: "Başlangıç", value: "(0,0), yön ↓" }, { label: "Program", value: "F R F L F" }, { label: "İstenen", value: "son kare" } ] },
      { id: "izle", title: "Yürüyüşü izle", body: "Animasyonda robotun arkasında iz kalır: (1,0) → dönüş → (1,1) → dönüş → (2,1). Her adımda yön oku değişir; iz hiç silinmez." },
      { id: "yorumla", title: "Yorumla", body: "Dönüşler robotu hareket ettirmez; yalnız sonraki F'lerin yönünü değiştirir. Bu ayrımı kaçıran öğrenci R ve L'yi adım sayar. Yanlış seçenekler tam da bu hatanın ürünleridir (ör. (1,2) sağa iki adım sayanlar için)." },
      { id: "yanitla", title: "Yanıtla ve gerekçelendir", body: "İz (1,0),(1,1),(2,1) — robot (2,1) karesinde durur. Seç: (2,1)." },
    ],
  },
];
