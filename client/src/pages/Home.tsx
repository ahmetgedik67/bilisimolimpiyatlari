import { createAnswerUnlockAt, getAnswerSecondsLeft, isAnswerLocked as isAnswerLockActive } from "@/lib/answerLock";
import { ROBI_IMAGE, robiMessages } from "@/lib/robiGuide";
import { RobiImage } from "@/components/RobiImage";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Trace100Panel } from "@/components/Trace100Panel";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Compass,
  Flag,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  LockKeyhole,
  MapPinned,
  Play,
  RotateCcw,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type AgeBand = "5-6" | "7-8";

type ProgressState = {
  ageBand: AgeBand;
  completedMissionIds: string[];
  merakPuani: number;
};

const missionData = [
  {
    id: "iz-surme",
    number: "01",
    title: "İz sürme",
    label: "Akış ve sıra",
    detail: "Bir programın adımlarını, satır satır zihninde yürüt.",
    short: "Önce hangi adım?",
    challenge: "Son değer kaç olur?",
    code: "int x = 3;\nx = x + 2;\nprintf(\"%d\", x);",
    options: ["3", "4", "5", "6"],
    answer: "5",
    trace: [["başlangıç", "x = 3"], ["işlem", "x = 3 + 2"], ["son", "x = 5"]],
    icon: Route,
    tint: "blue",
  },
  {
    id: "bellek-kutulari",
    number: "02",
    title: "Bellek kutuları",
    label: "Değişkenler",
    detail: "Bir değerin nerede durduğunu ve ne zaman değiştiğini gör.",
    short: "Kutudaki sayı değişir.",
    challenge: "Ekranda hangi değer görünür?",
    code: "int puan = 7;\npuan = puan - 2;\nprintf(\"%d\", puan);",
    options: ["2", "5", "7", "9"],
    answer: "5",
    trace: [["başlangıç", "puan = 7"], ["işlem", "puan = 7 - 2"], ["son", "puan = 5"]],
    icon: FlaskConical,
    tint: "green",
  },
  {
    id: "karar-kapilari",
    number: "03",
    title: "Karar kapıları",
    label: "Koşullar",
    detail: "`if` ile programın hangi yola gideceğine karar ver.",
    short: "Hangi yol açılır?",
    challenge: "Program hangi harfi yazar?",
    code: "int n = 9;\nif (n > 10) {\n  printf(\"A\");\n} else {\n  printf(\"B\");\n}",
    options: ["A", "B", "9", "Hiçbiri"],
    answer: "B",
    trace: [["değer", "n = 9"], ["kontrol", "9 > 10 → yanlış"], ["dal", "else → B"]],
    icon: Compass,
    tint: "coral",
  },
  {
    id: "tekrar-parkuru",
    number: "04",
    title: "Tekrar parkuru",
    label: "Döngüler",
    detail: "Sayaçla birlikte tekrar eden adımları izle ve sonucu bul.",
    short: "Her turda ne olur?",
    challenge: "Üç tur sonunda ekrana ne yazılır?",
    code: "int toplam = 2;\nfor (int i = 1; i <= 3; i++) {\n  toplam = toplam + i;\n}\nprintf(\"%d\", toplam);",
    options: ["6", "8", "9", "12"],
    answer: "8",
    trace: [["başlangıç", "toplam = 2"], ["i = 1", "toplam = 3"], ["i = 2", "toplam = 5"], ["i = 3", "toplam = 8"]],
    icon: RotateCcw,
    tint: "yellow",
  },
  {
    id: "dizi-kiyisi",
    number: "05",
    title: "Dizi kıyısı",
    label: "Diziler",
    detail: "Sıralı kutuların indekslerini kullanarak verinin izini sür.",
    short: "Sıra numarası önemlidir.",
    challenge: "İkinci kutunun değeri nedir?",
    code: "int a[3] = {2, 4, 6};\nprintf(\"%d\", a[1]);",
    options: ["2", "4", "6", "1"],
    answer: "4",
    trace: [["a[0]", "2"], ["a[1]", "4"], ["a[2]", "6"]],
    icon: MapPinned,
    tint: "blue",
  },
  {
    id: "kural-makinesi",
    number: "06",
    title: "Kural makinesi",
    label: "Fonksiyonlar",
    detail: "Bir kuralı küçük bir makineye dönüştür; girdi ve çıktıyı ayır.",
    short: "Kuralı tekrar kullan.",
    challenge: "Fonksiyon hangi sonucu verir?",
    code: "int ikiKat(int n) {\n  return n * 2;\n}\nprintf(\"%d\", ikiKat(4));",
    options: ["4", "6", "8", "16"],
    answer: "8",
    trace: [["girdi", "n = 4"], ["kural", "4 × 2"], ["çıktı", "8"]],
    icon: Sparkles,
    tint: "green",
  },
] as const;

const trialQuestions = [
  { id: "q1", prompt: "`int x = 4; x = x - 1;` sonrasında x kaçtır?", options: ["1", "3", "4", "5"], answer: "3" },
  { id: "q2", prompt: "`int a[3] = {2, 4, 6};` için `a[2]` kaçtır?", options: ["2", "3", "4", "6"], answer: "6" },
  { id: "q3", prompt: "`if (5 % 2 == 1)` koşulu doğru mudur?", options: ["Evet", "Hayır", "Derlenmez", "Bilinmez"], answer: "Evet" },
  { id: "q4", prompt: "`for (int i=0; i<2; i++)` gövdeyi kaç kez çalıştırır?", options: ["0", "1", "2", "3"], answer: "2" },
  { id: "q5", prompt: "`int kup(int n){ return n*n*n; }` için `kup(2)` sonucu nedir?", options: ["4", "6", "8", "16"], answer: "8" },
] as const;
const storageKey = "algoritma-atlasi-progress-v1";
const trialDurationSeconds = 300;
type MissionId = (typeof missionData)[number]["id"];

type TaskVariant = {
  challenge: string;
  code: string;
  options: readonly string[];
  answer: string;
  hints: readonly string[];
};

const missionVariants: Record<MissionId, readonly TaskVariant[]> = {
  "iz-surme": [
    { challenge: "Son değer kaç olur?", code: "int x = 3;\nx = x + 2;\nprintf(\"%d\", x);", options: ["3", "4", "5", "6"], answer: "5", hints: ["İlk satırdaki x değerini bir kenara yaz.", "İkinci satır x'in eski değerine kaç ekliyor?", "printf, ikinci satır bittikten sonra x'in taşıdığı değeri yazar."] },
    { challenge: "Son değer kaç olur?", code: "int x = 6;\nx = x - 3;\nprintf(\"%d\", x);", options: ["1", "3", "6", "9"], answer: "3", hints: ["x'in başlangıç değerini bul.", "İkinci satırdaki işlem çıkarma mı, toplama mı?", "İşlemden sonra x'in yeni değerini yazdırma satırına taşı."] },
    { challenge: "Son değer kaç olur?", code: "int x = 2;\nx = x * 4;\nprintf(\"%d\", x);", options: ["4", "6", "8", "10"], answer: "8", hints: ["Başlangıç değerini x kutusuna yerleştir.", "Yıldız işareti, x'i hangi sayıyla çarptığını gösterir.", "Son satır, güncellenmiş x değerini kullanır."] },
    { challenge: "Son değer kaç olur?", code: "int x = 9;\nx = x / 3;\nprintf(\"%d\", x);", options: ["3", "6", "9", "12"], answer: "3", hints: ["x kutusunun başlangıç değerini not et.", "Bölme işlemini x'in mevcut değeriyle uygula.", "printf satırında işlemden sonraki değer kullanılır."] },
    { challenge: "Son değer kaç olur?", code: "int x = 5;\nx = x + 2;\nx = x * 2;\nprintf(\"%d\", x);", options: ["7", "10", "12", "14"], answer: "14", hints: ["İlk güncellemeden sonra x için ara değer yaz.", "Çarpma, ilk güncellemenin sonucuna uygulanır.", "Satırları yukarıdan aşağıya sırayla izle."] },
  ],
  "bellek-kutulari": [
    { challenge: "Ekranda hangi değer görünür?", code: "int puan = 7;\npuan = puan - 2;\nprintf(\"%d\", puan);", options: ["2", "5", "7", "9"], answer: "5", hints: ["puan kutusunun ilk değerini yaz.", "İkinci atama önceki değeri korumaz; kutunun içini değiştirir.", "Yazdırma satırı güncel kutuyu okur."] },
    { challenge: "Ekranda hangi değer görünür?", code: "int puan = 4;\npuan = puan + 6;\nprintf(\"%d\", puan);", options: ["4", "6", "10", "12"], answer: "10", hints: ["İlk atama puan kutusunu hazırlar.", "İkinci satırdaki sağ tarafı önce hesapla.", "Sonra yeni sonucu puan kutusuna geri koy."] },
    { challenge: "Ekranda hangi iki değer görünür?", code: "int a = 8;\nint b = a;\na = a - 3;\nprintf(\"%d %d\", a, b);", options: ["5 5", "5 8", "8 5", "8 8"], answer: "5 8", hints: ["b değerini aldığı anda a kutusunda ne vardı?", "Sonraki satır yalnızca a kutusunu değiştirir.", "printf içindeki değişkenleri soldan sağa oku."] },
    { challenge: "Ekranda hangi değer görünür?", code: "int sayi = 3;\nsayi = sayi * 3;\nprintf(\"%d\", sayi);", options: ["3", "6", "9", "12"], answer: "9", hints: ["Sayi kutusunun başlangıç değerini yaz.", "Çarpma satırı yeni değeri doğrudan aynı kutuya koyar.", "Yazdırma en güncel sayi değerini kullanır."] },
    { challenge: "Ekranda hangi değer görünür?", code: "int kutu = 5;\nkutu = kutu + 4;\nkutu = kutu - 1;\nprintf(\"%d\", kutu);", options: ["4", "5", "8", "9"], answer: "8", hints: ["İlk işlemden sonraki değeri ara not olarak tut.", "Son işlem başlangıç değerine değil ara değere uygulanır.", "En son oluşan değeri yazdırma satırına götür."] },
  ],
  "karar-kapilari": [
    { challenge: "Program hangi harfi yazar?", code: "int n = 9;\nif (n > 10) {\n  printf(\"A\");\n} else {\n  printf(\"B\");\n}", options: ["A", "B", "9", "Hiçbiri"], answer: "B", hints: ["Önce n'nin sayısal değerini yerine koy.", "9'un 10'dan büyük olup olmadığını karşılaştır.", "Koşul yanlışsa else bloğu çalışır."] },
    { challenge: "Program hangi harfi yazar?", code: "int n = 12;\nif (n > 10) {\n  printf(\"A\");\n} else {\n  printf(\"B\");\n}", options: ["A", "B", "12", "Hiçbiri"], answer: "A", hints: ["n için ilk satırdaki değeri kullan.", "12 ile 10'u karşılaştır.", "Doğru koşulda ilk blok çalışır; else'e gidilmez."] },
    { challenge: "Program hangi harfi yazar?", code: "int n = 4;\nif (n % 2 == 0) {\n  printf(\"E\");\n} else {\n  printf(\"T\");\n}", options: ["E", "T", "4", "Hiçbiri"], answer: "E", hints: ["Önce 4'ün 2'ye bölümünden kalanı düşün.", "Koşul eşitlik işaretiyle sıfırı kontrol ediyor.", "Doğru olan bloktaki harfi seç."] },
    { challenge: "Program hangi harfi yazar?", code: "int sicaklik = 18;\nif (sicaklik >= 20) {\n  printf(\"A\");\n} else {\n  printf(\"B\");\n}", options: ["A", "B", "18", "Hiçbiri"], answer: "B", hints: ["Sıcaklık değerini karşılaştırmaya yerleştir.", "18'in 20'ye eşit veya büyük olup olmadığını kontrol et.", "Yanlış koşulda else bloğu çalışır."] },
    { challenge: "Program hangi harfi yazar?", code: "int n = 3;\nif (n != 0 && n < 5) {\n  printf(\"X\");\n} else {\n  printf(\"Y\");\n}", options: ["X", "Y", "3", "Hiçbiri"], answer: "X", hints: ["İki karşılaştırmayı ayrı ayrı değerlendir.", "&& iki koşulun da doğru olmasını ister.", "Her iki koşul doğruysa ilk blok çalışır."] },
  ],
  "tekrar-parkuru": [
    { challenge: "Döngü gövdesi kaç kez çalışır?", code: "for (int i = 0; i < 3; i++) {\n  printf(\"*\");\n}", options: ["2", "3", "4", "Sonsuz"], answer: "3", hints: ["i'nin hangi değerden başladığını yaz.", "Her turdan sonra i bir artar.", "Koşul yanlış olduğu ilk değerde döngü durur."] },
    { challenge: "Döngü gövdesi kaç kez çalışır?", code: "for (int i = 1; i <= 2; i++) {\n  printf(\"*\");\n}", options: ["1", "2", "3", "Sonsuz"], answer: "2", hints: ["Sayaç ilk turda hangi değerle başlar?", "Koşul eşitlik durumunu da kabul ediyor mu?", "Her turda i'nin aldığı değerleri tek tek listele."] },
    { challenge: "Döngü gövdesi kaç kez çalışır?", code: "for (int i = 1; i < 5; i += 2) {\n  printf(\"*\");\n}", options: ["1", "2", "3", "4"], answer: "2", hints: ["Sayaç her turda bir değil iki artıyor.", "Koşul doğruyken i'nin aldığı değerleri yaz.", "Bir sonraki değer sınırı geçtiğinde döngü durur."] },
    { challenge: "Ekrana kaç yıldız basılır?", code: "for (int i = 0; i <= 4; i += 2) {\n  printf(\"*\");\n}", options: ["2", "3", "4", "5"], answer: "3", hints: ["Sınır değeri koşulda dahil mi kontrol et.", "Sayaç her turda iki artıyor.", "Koşulu sağlayan sayaç değerlerini say."] },
    { challenge: "Program hangi değeri yazar?", code: "int toplam = 0;\nfor (int i = 1; i <= 3; i++) {\n  toplam = toplam + i;\n}\nprintf(\"%d\", toplam);", options: ["3", "5", "6", "9"], answer: "6", hints: ["Her turdaki i değerini sırala.", "Toplam kutusunu her turdan sonra güncelle.", "Döngü bittiğinde oluşan son toplamı yazdır."] },
  ],
  "dizi-kiyisi": [
    { challenge: "İkinci kutunun değeri nedir?", code: "int a[3] = {2, 4, 6};\nprintf(\"%d\", a[1]);", options: ["2", "4", "6", "1"], answer: "4", hints: ["Dizilerde ilk kutunun indeksinin kaç olduğunu hatırla.", "a[1] ikinci konumdaki kutuyu işaret eder.", "İkinci konumdaki sayıyı diziden bul."] },
    { challenge: "Üçüncü kutunun değeri nedir?", code: "int a[3] = {5, 7, 9};\nprintf(\"%d\", a[2]);", options: ["5", "7", "9", "2"], answer: "9", hints: ["İndeks sayımı sıfırdan başlar.", "a[2] üçüncü kutuyu işaret eder.", "Dizide üçüncü sıradaki sayıyı seç."] },
    { challenge: "İlk kutunun değeri nedir?", code: "int a[4] = {3, 6, 9, 12};\nprintf(\"%d\", a[0]);", options: ["0", "3", "6", "12"], answer: "3", hints: ["Dizi indeksleri sıfırdan başlar.", "a[0] ilk konumdaki kutuyu gösterir.", "İlk değeri dizinin içinden seç."] },
    { challenge: "Güncellenen kutuda hangi değer vardır?", code: "int a[3] = {2, 4, 6};\na[1] = a[1] + 2;\nprintf(\"%d\", a[1]);", options: ["2", "4", "6", "8"], answer: "6", hints: ["a[1] ikinci kutudur.", "İkinci kutudaki eski değere işlem uygula.", "printf güncellenmiş ikinci kutuyu okur."] },
    { challenge: "Son kutunun değeri nedir?", code: "int a[4] = {1, 5, 8, 11};\nprintf(\"%d\", a[3]);", options: ["1", "5", "8", "11"], answer: "11", hints: ["Dört kutuda indeksler 0'dan 3'e kadar gider.", "a[3] son kutuyu işaret eder.", "Son konumdaki değeri diziden bul."] },
  ],
  "kural-makinesi": [
    { challenge: "Fonksiyon hangi sonucu verir?", code: "int ikiKat(int n) {\n  return n * 2;\n}\nprintf(\"%d\", ikiKat(4));", options: ["4", "6", "8", "16"], answer: "8", hints: ["Fonksiyon çağrısındaki sayıyı n yerine yaz.", "return satırındaki işlemi yalnızca bu değerle hesapla.", "printf fonksiyonun döndürdüğü değeri yazar."] },
    { challenge: "Fonksiyon hangi sonucu verir?", code: "int ucKat(int n) {\n  return n * 3;\n}\nprintf(\"%d\", ucKat(3));", options: ["3", "6", "9", "12"], answer: "9", hints: ["Çağrıdaki 3, fonksiyon içindeki n olur.", "return satırında n hangi sayıyla çarpılıyor?", "Fonksiyonun sonucu printf'e gider."] },
    { challenge: "Fonksiyon hangi sonucu verir?", code: "int topla(int a, int b) {\n  return a + b;\n}\nprintf(\"%d\", topla(2, 5));", options: ["5", "7", "10", "25"], answer: "7", hints: ["İlk çağrı değeri a yerine, ikincisi b yerine gelir.", "return satırında iki parametre arasında hangi işlem var?", "Fonksiyonun döndürdüğü değeri seç."] },
    { challenge: "Fonksiyon hangi sonucu verir?", code: "int kare(int n) {\n  return n * n;\n}\nprintf(\"%d\", kare(4));", options: ["4", "8", "12", "16"], answer: "16", hints: ["Fonksiyon çağrısındaki değeri n yerine koy.", "Aynı n değeri iki kez çarpımda kullanılır.", "Return değerini printf satırına taşı."] },
    { challenge: "Fonksiyon hangi sonucu verir?", code: "int fark(int a, int b) {\n  return a - b;\n}\nprintf(\"%d\", fark(9, 4));", options: ["4", "5", "9", "13"], answer: "5", hints: ["Çağrıdaki ilk değer a parametresine gider.", "İkinci değer b parametresine gider.", "Return satırındaki çıkarma sırasını koru."] },
  ],
};

function parseProgress(raw: string | null): ProgressState {
  const fallback: ProgressState = { ageBand: "5-6", completedMissionIds: [], merakPuani: 0 };
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    if (parsed.ageBand !== "5-6" && parsed.ageBand !== "7-8") return fallback;
    return {
      ageBand: parsed.ageBand,
      completedMissionIds: Array.isArray(parsed.completedMissionIds)
        ? parsed.completedMissionIds.filter((item): item is string => typeof item === "string")
        : [],
      merakPuani: typeof parsed.merakPuani === "number" ? parsed.merakPuani : 0,
    };
  } catch {
    return fallback;
  }
}

function MissionSeal({ completed }: { completed: boolean }) {
  return completed ? (
    <span className="mission-seal mission-seal--done" aria-label="Tamamlandı">
      <Check aria-hidden="true" size={13} /> tamam
    </span>
  ) : (
    <span className="mission-seal">keşfet</span>
  );
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<ProgressState>({ ageBand: "5-6", completedMissionIds: [], merakPuani: 0 });
  const [activeMissionId, setActiveMissionId] = useState<MissionId>("iz-surme");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hintStep, setHintStep] = useState(-1);
  const [taskVariantIndex, setTaskVariantIndex] = useState<Record<MissionId, number>>(() => Object.fromEntries(missionData.map((mission) => [mission.id, 0])) as Record<MissionId, number>);
  const [notice, setNotice] = useState("Robi ile izini kendin kur; gerektiğinde ipucu iste.");
  const [missionStartedAt, setMissionStartedAt] = useState(() => Date.now());
  const [answerUnlockAt, setAnswerUnlockAt] = useState(() => createAnswerUnlockAt(Date.now()));
  const [answerNowMs, setAnswerNowMs] = useState(() => Date.now());
  const [trialOpen, setTrialOpen] = useState(false);
  const [trialStartedAt, setTrialStartedAt] = useState<number | null>(null);
  const [trialAnswers, setTrialAnswers] = useState<Record<string, string>>({});
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [trialResult, setTrialResult] = useState<{ correct: number; wrong: number; blank: number; netMilli: number; durationSeconds: number } | null>(null);
  const hasHydrated = useRef(false);
  const answerLockedRef = useRef(true);

  const profileQuery = trpc.learning.profile.useQuery(undefined, { enabled: isAuthenticated });
  const saveMission = trpc.learning.completeMission.useMutation({ onSuccess: () => profileQuery.refetch() });
  const saveAgeBand = trpc.learning.setAgeBand.useMutation();
  const saveTrial = trpc.learning.submitTrial.useMutation({ onSuccess: () => profileQuery.refetch() });

  useEffect(() => {
    setProgress(parseProgress(window.localStorage.getItem(storageKey)));
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!profileQuery.data) return;
    const serverCompleted = parseProgress(profileQuery.data.profile.completedMissionIds);
    setProgress({
      ageBand: profileQuery.data.profile.ageBand,
      completedMissionIds: serverCompleted.completedMissionIds,
      merakPuani: profileQuery.data.profile.merakPuani,
    });
  }, [profileQuery.data]);

  useEffect(() => {
    setSelectedAnswer(null);
    setHintStep(-1);
    setMissionStartedAt(Date.now());
    armAnswerLock();
  }, [activeMissionId, taskVariantIndex[activeMissionId]]);

  useEffect(() => {
    if (answerNowMs >= answerUnlockAt) {
      answerLockedRef.current = false;
      return;
    }
    const intervalId = window.setInterval(() => setAnswerNowMs(Date.now()), 250);
    return () => window.clearInterval(intervalId);
  }, [answerNowMs, answerUnlockAt]);

  useEffect(() => {
    if (!trialOpen || !trialStartedAt || trialResult) return;
    const intervalId = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [trialOpen, trialStartedAt, trialResult]);

  useEffect(() => {
    if (hasHydrated.current) window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress]);

  const activeMission = missionData.find((mission) => mission.id === activeMissionId) ?? missionData[0];
  const activeTaskOptions = missionVariants[activeMission.id];
  const activeTask = activeTaskOptions[taskVariantIndex[activeMission.id] % activeTaskOptions.length];
  const completedCount = progress.completedMissionIds.filter((id) => missionData.some((mission) => mission.id === id)).length;
  const isQuizCorrect = selectedAnswer === "8";
  const isQuizAnswered = selectedAnswer !== null;
  const isActiveQuizCorrect = selectedAnswer === activeTask.answer;
  const earnedBadgeCount = profileQuery.data?.badges.length ?? 0;
  const latestTrial = profileQuery.data?.results.find(result => result.activityType === "trial");
  const trialSecondsLeft = trialStartedAt ? Math.max(0, trialDurationSeconds - Math.floor((nowMs - trialStartedAt) / 1000)) : trialDurationSeconds;
  const trialMinutes = String(Math.floor(trialSecondsLeft / 60)).padStart(2, "0");
  const trialSeconds = String(trialSecondsLeft % 60).padStart(2, "0");
  const answerSecondsLeft = getAnswerSecondsLeft(answerUnlockAt, answerNowMs);
  const isAnswerLocked = isAnswerLockActive(answerUnlockAt, answerNowMs);

  const nextMission = useMemo(
    () => missionData.find((mission) => !progress.completedMissionIds.includes(mission.id)),
    [progress.completedMissionIds],
  );

  function isAvailable(missionId: string) {
    const index = missionData.findIndex((mission) => mission.id === missionId);
    return index === 0 || progress.completedMissionIds.includes(missionData[index - 1].id);
  }

  function armAnswerLock() {
    const now = Date.now();
    answerLockedRef.current = true;
    setAnswerNowMs(now);
    setAnswerUnlockAt(createAnswerUnlockAt(now));
  }

  function chooseAgeBand(ageBand: AgeBand) {
    setProgress((current) => ({ ...current, ageBand }));
    setNotice(ageBand === "5-6" ? "Rota, daha kısa örnekler ve somut izlerle ayarlandı." : "Rota, çok adımlı iz sürme ve sınav ritmi için ayarlandı.");
    if (isAuthenticated) saveAgeBand.mutate({ ageBand });
  }

  function completeMission(missionId: MissionId) {
    const missionIndex = missionData.findIndex((mission) => mission.id === missionId);
    const newlyUnlocked = missionData[missionIndex + 1];
    const wasAlreadyCompleted = progress.completedMissionIds.includes(missionId);
    armAnswerLock();
    if (!wasAlreadyCompleted) {
      setProgress((current) => ({
        ...current,
        completedMissionIds: [...current.completedMissionIds, missionId],
        merakPuani: current.merakPuani + 15,
      }));
    }
    setNotice(newlyUnlocked ? `Rota ilerledi: ${newlyUnlocked.title} durağı açıldı.` : "Tüm rota mühürlendi. Deneme üssüne geçebilirsin.");
    if (isAuthenticated && !wasAlreadyCompleted) saveMission.mutate({ missionId, durationSeconds: Math.max(1, Math.round((Date.now() - missionStartedAt) / 1000)), isCorrect: true });
    if (newlyUnlocked) setActiveMissionId(newlyUnlocked.id);
  }

  function recordTraceStep(stepId: string) {
    setProgress((current) => current.completedMissionIds.includes(stepId)
      ? current
      : { ...current, completedMissionIds: [...current.completedMissionIds, stepId], merakPuani: current.merakPuani + 2 });
  }

  function submitAnswer(answer: string) {
    if (answerLockedRef.current || selectedAnswer !== null) return;
    answerLockedRef.current = true;
    setSelectedAnswer(answer);
    if (answer === activeTask.answer) {
      completeMission(activeMission.id);
    } else {
      if (isAuthenticated) saveMission.mutate({ missionId: activeMission.id, durationSeconds: Math.max(1, Math.round((Date.now() - missionStartedAt) / 1000)), isCorrect: false });
      const variants = missionVariants[activeMission.id];
      setTaskVariantIndex((current) => ({ ...current, [activeMission.id]: (current[activeMission.id] + 1) % variants.length }));
      setSelectedAnswer(null);
      setHintStep(-1);
      setMissionStartedAt(Date.now());
      armAnswerLock();
      setNotice("Bu örnek henüz kapanmadı. Aynı kural yeni değerlerle geldi; ilk ipucundan başlayıp yeniden dene.");
    }
  }

  function startTrial() {
    setTrialAnswers({});
    setTrialResult(null);
    const startedAt = Date.now();
    setTrialStartedAt(startedAt);
    setNowMs(startedAt);
    setTrialOpen(true);
  }

  function finishTrial() {
    if (trialResult) return;
    const correct = trialQuestions.filter(question => trialAnswers[question.id] === question.answer).length;
    const wrong = trialQuestions.filter(question => trialAnswers[question.id] && trialAnswers[question.id] !== question.answer).length;
    const blank = trialQuestions.length - correct - wrong;
    const netMilli = Math.round((correct - wrong / 3) * 1000);
    const durationSeconds = Math.min(trialDurationSeconds, Math.max(1, Math.round((Date.now() - (trialStartedAt ?? Date.now())) / 1000)));
    const result = { correct, wrong, blank, netMilli, durationSeconds };
    setTrialResult(result);
    setTrialStartedAt(null);
    setNotice(`Mini deneme tamamlandı: ${correct} doğru, ${wrong} yanlış, ${blank} boş.`);
    if (isAuthenticated) saveTrial.mutate({ correctCount: correct, wrongCount: wrong, blankCount: blank, durationSeconds });
  }

  useEffect(() => {
    if (trialOpen && trialStartedAt && trialSecondsLeft === 0 && !trialResult) finishTrial();
  }, [trialOpen, trialStartedAt, trialSecondsLeft, trialResult]);

  return (
    <div className="atlas-app">
      <a href="#ana-gorev" className="skip-link">Ana göreve geç</a>

      <header className="atlas-topbar">
        <a className="atlas-brand" href="#baslangic" aria-label="Algoritma Atlası başlangıç">
          <img src="/assets/bilfen-logo.png" alt="Bilfen Eğitim Kurumları" className="bilfen-logo" />
          <span>
            <strong>Bilişim Teknolojileri Bölümü</strong>
            <small>Algoritma Atlası · ortaokul rota defteri</small>
          </span>
        </a>

        <div className="topbar-actions">
          <a className="topbar-link" href="#rota">Atlas rotası</a>
          <a className="topbar-link topbar-link--course" href="/konu-anlatimi">Dersler</a>
          <a className="topbar-link topbar-link--science" href="/bilim-zeka">Bilim ve Zekâ</a>
          <a className="topbar-link" href="#kaynaklar">Araştırma notu</a>
          {isAuthenticated ? (
            <a className="learner-chip" href="/giris"><ShieldCheck size={15} /> {user?.name ?? "Hesabım"}</a>
          ) : (
            <a className="login-button" href="/giris">Giriş <ArrowUpRight size={15} /></a>
          )}
        </div>
      </header>

      <main id="baslangic">
        <section className="atlas-hero">
          <div className="hero-ink">
            <span className="eyebrow"><Compass size={14} /> Bilfen Eğitim Kurumları · Bilişim Teknolojileri Bölümü</span>
            <h1>C dilini ezberleme.<br /><em>İzini sür.</em></h1>
            <p>
              C programlama ve algoritmik düşünme için kısa keşif görevleri. Önce örneği incele,
              sonra kararını ver; kuralı en son adlandır.
            </p>
            <div className="hero-actions">
              <a href="#ana-gorev" className="primary-action">İlk göreve başla <ChevronRight size={17} /></a>
              <a href="#yaklasim" className="quiet-action">Nasıl çalışır? <ArrowUpRight size={15} /></a>
            </div>
            <div className="hero-facts" aria-label="Hazırlık kapsamı">
              <span><Clock3 size={15} /> 90 dk sınav ritmi</span>
              <span><Target size={15} /> 5–6 ve 7–8 rotası</span>
              <span><Code2 size={15} /> C ile kod okuma</span>
            </div>
          </div>
          <div className="hero-map" role="img" aria-label="Algoritma Atlası için soyut keşif haritası görseli">
            <img src="/assets/robi.jpeg" alt="" />
            <aside className="hero-robi" aria-label="Robi ders rehberi">
              <RobiImage src={ROBI_IMAGE} alt="Robi, Bilfen Bilişim Teknolojileri Bölümü ders rehberi" loading="eager" />
              <div>
                <span>{robiMessages.hero.label}</span>
                <strong>{robiMessages.hero.title}</strong>
                <p>{robiMessages.hero.body}</p>
              </div>
            </aside>
            <div className="map-stamp"><Flag size={16} /> rota 01<br /><b>başlangıç kampı</b></div>
          </div>
        </section>

        <section className="atlas-ribbon" aria-label="Öğrenme durumu">
          <p role="status"><Sparkles size={16} /> {notice}</p>
          <div>
            <span><strong>{completedCount}</strong> / 6 durak</span>
            <span><strong>{progress.merakPuani}</strong> merak puanı</span>
            {isAuthenticated ? <span className="save-state">hesabına kaydediliyor</span> : <span className="save-state">bu tarayıcıda saklanıyor</span>}
          </div>
        </section>

        <section className="setup-section" aria-labelledby="seviye-baslik">
          <div>
            <span className="eyebrow eyebrow--ink">Rota ayarı</span>
            <h2 id="seviye-baslik">Hangi patikadan ilerliyorsun?</h2>
            <p>Temel kavramlar aynı; örneklerin uzunluğu, ipuçlarının ayrıntısı ve deneme temposu yaş bandına göre değişir.</p>
          </div>
          <div className="age-switch" role="group" aria-label="Sınıf grubu seçimi">
            {(["5-6", "7-8"] as AgeBand[]).map((band) => (
              <button key={band} onClick={() => chooseAgeBand(band)} className={progress.ageBand === band ? "is-selected" : ""} aria-pressed={progress.ageBand === band}>
                <span>{band}</span>. sınıf
                <small>{band === "5-6" ? "kısa örnekler" : "derin iz sürme"}</small>
              </button>
            ))}
          </div>
        </section>

        <section id="rota" className="atlas-layout">
          <aside className="route-rail" aria-label="Atlas rotası">
            <div className="rail-heading">
              <span>atlas rotası</span>
              <strong>{completedCount < 6 ? `sırada: ${nextMission?.title ?? "deneme üssü"}` : "tüm duraklar açık"}</strong>
            </div>
            <ol className="mission-list">
              {missionData.map((mission, index) => {
                const Icon = mission.icon;
                const completed = progress.completedMissionIds.includes(mission.id);
                const available = isAvailable(mission.id);
                const active = mission.id === activeMission.id;
                return (
                  <li key={mission.id} className={`${active ? "is-active" : ""} ${completed ? "is-completed" : ""} ${!available ? "is-locked" : ""}`}>
                    <button
                      onClick={() => available && setActiveMissionId(mission.id)}
                      disabled={!available}
                      aria-current={active ? "step" : undefined}
                    >
                      <span className="mission-index">{completed ? <Check size={13} /> : mission.number}</span>
                      <span className="mission-copy"><b>{mission.title}</b><small>{mission.label}</small></span>
                      {available ? <Icon size={16} /> : <LockKeyhole size={15} />}
                    </button>
                    {index < missionData.length - 1 && <i className="route-line" aria-hidden="true" />}
                  </li>
                );
              })}
            </ol>
            <div className="rail-note"><CircleHelp size={16} /><span>Her durak, bir sonraki kavramın anahtarını verir. Kilitler ceza değil, sıralama işaretidir.</span></div>
          </aside>

          <div className="lesson-area" id="ana-gorev">
            <div className="lesson-head">
              <div>
                <span className="eyebrow eyebrow--ink">{activeMission.number} / {activeMission.label}</span>
                <h2>{activeMission.title}</h2>
                <p>{activeMission.detail}</p>
              </div>
              <MissionSeal completed={progress.completedMissionIds.includes(activeMission.id)} />
            </div>

            <article className="mission-brief">
              <div className={`brief-icon brief-icon--${activeMission.tint}`}><activeMission.icon size={25} /></div>
              <div>
                <span>Robi'nin bugünkü işareti</span>
                <h3>{activeMission.short}</h3>
                <p>İşaretleri takip et. Durağın mühürü, yalnızca görevin doğru cevabıyla açılır.</p>
              </div>
              <span className="outline-action outline-action--static">{progress.completedMissionIds.includes(activeMission.id) ? <><Check size={16} /> Tamamlandı</> : <><Play size={15} /> Görev bekliyor</>}</span>
            </article>

            {activeMission.id === "iz-surme" ? (
              <Trace100Panel
                isAuthenticated={isAuthenticated}
                savedCompletedIds={progress.completedMissionIds}
                onStepCompleted={recordTraceStep}
                onRouteCompleted={() => completeMission("iz-surme")}
              />
            ) : (
            <div className="silent-task-stage">
              <aside className="silent-guide" aria-label="Rota rehberi">
                <span className="silent-guide__label">{robiMessages.task.label}</span>
                <RobiImage src={ROBI_IMAGE} alt="Robi, görev sırasında öğrenciyi yönlendiren ders rehberi" />
                <strong>{robiMessages.task.title}</strong>
                <p>{robiMessages.task.body}</p>
              </aside>
            <article className="code-mission" aria-labelledby="gorev-baslik">
              <div className="code-mission__header">
                <div>
                  <span className="eyebrow eyebrow--coral">Etkin görev / C ile iz sürme</span>
                  <h3 id="gorev-baslik">{activeTask.challenge}</h3>
                </div>
                <div className="task-coordinates"><span className="difficulty-tag"><Target size={14} /> {progress.ageBand === "5-6" ? "temel rota" : "yarışma rotası"}</span><small>c · kuzeydoğu / {activeMission.number}</small></div>
              </div>

              <div className="code-grid">
                  <pre aria-label="C kodu örneği"><code>{activeTask.code}</code></pre>

                <div className="trace-panel">
                  <span className="trace-label">Robi'nin iz sürme alanı</span>
                  <p>İpucu sonucu söylemez; yalnızca bakman gereken satırı işaret eder.</p>
                  <button className="trace-toggle" onClick={() => setHintStep((current) => Math.min(current + 1, activeTask.hints.length - 1))} aria-expanded={hintStep >= 0} disabled={hintStep >= activeTask.hints.length - 1}>
                    {hintStep < 0 ? "İpucu al" : hintStep === activeTask.hints.length - 1 ? "İpuçları açık" : "Bir ipucu daha"} <ChevronRight size={15} />
                  </button>
                  {hintStep >= 0 && (
                    <ol className="trace-steps" aria-label="Kademeli görev ipuçları">
                      {activeTask.hints.slice(0, hintStep + 1).map((hint, index) => <li key={hint}><span>ipucu {index + 1}</span><b>{hint}</b></li>)}
                    </ol>
                  )}
                </div>
              </div>

              <div className="answer-zone">
                <div>
                  <span className="answer-label">Tahminini seç</span>
                  <p id="answer-lock-status" className={`answer-wait ${isAnswerLocked ? "answer-wait--locked" : "answer-wait--ready"}`} role="status">
                    <Clock3 size={14} />
                    {isAnswerLocked ? <><b>{answerSecondsLeft} sn</b> düşünme süresi: seçenekler birazdan açılacak.</> : <>Seçenekler açık. Tek bir cevap işaretle.</>}
                  </p>
                </div>
                <div className="answer-buttons" role="group" aria-label="Olası program çıktıları">
                  {activeTask.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => submitAnswer(option)}
                      disabled={isAnswerLocked}
                      className={selectedAnswer === option ? (option === activeTask.answer ? "is-correct" : "is-wrong") : ""}
                      aria-pressed={selectedAnswer === option}
                      aria-describedby="answer-lock-status"
                    >{option}</button>
                  ))}
                </div>
              </div>

              {isQuizAnswered && (
                <div className={`feedback-note ${isActiveQuizCorrect ? "feedback-note--success" : "feedback-note--hint"}`} role="status">
                  {isActiveQuizCorrect ? <Check size={18} /> : <Lightbulb size={18} />}
                  <div><strong>{isActiveQuizCorrect ? "İz tamamlandı." : "Bir örnek daha var."}</strong><span>{isActiveQuizCorrect ? "Kuralı kendi izinden çıkardın. Sıradaki durağın yolu artık açık." : "Çözüm sana hemen verilmedi. İstersen İzi gör seçeneğiyle adımları karşılaştır ve yeniden dene."}</span></div>
                </div>
              )}
            </article>
            </div>
            )}
          </div>

          <aside className="field-notes" aria-label="Alan notları">
            <div className="notes-card notes-card--dark">
              <span className="eyebrow">C belleği</span>
              <h3><code>for</code> bir sayaçla aynı adımı tekrarlar.</h3>
              <p>Parantez içindeki üç bölüm sırasıyla başlangıç, devam koşulu ve güncellemedir.</p>
            </div>
            <img src="/assets/robi.jpeg" alt="Değişken değerlerini temsil eden renkli kavanozlar" className="notes-image" />
            <div className="notes-card">
              <span className="eyebrow eyebrow--ink">Sınav notu</span>
              <p>İSBO şartnamesinde ortaokul bilgisayar ön elemesi 25, 1. aşaması 30 çoktan seçmeli sorudur; iki aşamada da süre 90 dakikadır. Bu alan sınavın resmî kopyası değildir. <a href="#kaynaklar">[1]</a></p>
            </div>
          </aside>
        </section>

        <section id="yaklasim" className="method-section">
          <div className="method-copy">
            <span className="eyebrow eyebrow--ink">Öğrenme döngüsü</span>
            <h2>Yanıt, son değil; yeni bir örneğin başlangıcı.</h2>
            <p>Silent Teacher’dan esinlenen yapı, öğrencinin yanıtını “doğru/yanlış” etiketiyle kapatmak yerine bir sonraki örneği seçmek için kullanır. C derslerinde bu, değişkenlerin değerini, koşulun dalını veya döngünün her turunu görünür yapmak demektir.</p>
          </div>
          <div className="cycle-grid">
            {[{ icon: Lightbulb, n: "01", t: "Tahmin et", p: "Örneği oku, kuralı henüz isimlendirme." }, { icon: Compass, n: "02", t: "İzi gör", p: "Değer, dal veya sayaç değişimini izle." }, { icon: BookOpen, n: "03", t: "Kuralı kur", p: "Yeni bağlamda aynı mantığı uygula." }, { icon: Trophy, n: "04", t: "Durağı aç", p: "Bir sonraki problem aracına geç." }].map((item) => {
              const Icon = item.icon;
              return <article key={item.n}><span>{item.n}</span><Icon size={20} /><h3>{item.t}</h3><p>{item.p}</p></article>;
            })}
          </div>
        </section>

        <section className="exam-section">
          <div className="exam-card">
            <div><span className="eyebrow eyebrow--coral">Deneme üssü / canlı alıştırma</span><h2>Bilgiyi değil, çözüm ritmini de çalış.</h2><p>Bu beş soruluk mini set, C kodunu izleme ve kısa algoritma kararları için hazırlanmıştır. Dört seçenekli alıştırmada net, üç yanlışın bir doğruyu götürdüğü resmî değerlendirme kuralına göre gösterilir. [1]</p></div>
            <div id="deneme-ussu" className="exam-callout"><div className="exam-robi"><RobiImage src={ROBI_IMAGE} alt="Robi, mini deneme rehberi" /><p><b>{robiMessages.exam.title}</b>{robiMessages.exam.body}</p></div><div className="exam-schematic" aria-hidden="true"><span>5</span><i /><span>3 yanlış</span><i /><span>net</span></div><button className="primary-action" onClick={startTrial}><Play size={16} /> Mini denemeyi aç</button></div>
          </div>
          {trialOpen && <article className="trial-card" aria-labelledby="trial-title">
            <div className="trial-head"><div><span className="eyebrow eyebrow--ink">Olimpiyat tipi uygulama / 5 soru</span><h3 id="trial-title">Bir soruyu boş bırakmak da bilinçli bir stratejidir.</h3><p>Yanıtlamadığın sorular sonuçta ayrı görünür. Önce tüm soruları oku; emin olmadığını boş bırakabilirsin.</p></div><span className={`timer-chip ${trialSecondsLeft <= 60 ? "timer-chip--urgent" : ""}`}><Clock3 size={14} /> {trialResult ? `${String(Math.floor(trialResult.durationSeconds / 60)).padStart(2, "0")}:${String(trialResult.durationSeconds % 60).padStart(2, "0")} kullanıldı` : `${trialMinutes}:${trialSeconds} kaldı`}</span></div>
            <ol className="trial-questions">
              {trialQuestions.map((question, index) => <li key={question.id}>
                <span className="trial-number">{String(index + 1).padStart(2, "0")}</span>
                <div><p>{question.prompt}</p><div className="trial-options" role="group" aria-label={`Soru ${index + 1} seçenekleri`}>{question.options.map(option => <button key={option} disabled={Boolean(trialResult)} onClick={() => setTrialAnswers(current => ({ ...current, [question.id]: option }))} className={trialAnswers[question.id] === option ? "is-selected" : ""} aria-pressed={trialAnswers[question.id] === option}>{option}</button>)}</div></div>
              </li>)}
            </ol>
            <div className="trial-footer"><div><strong>{Object.keys(trialAnswers).length} / 5</strong><span>işaretlenen soru</span></div><button className="primary-action" onClick={finishTrial} disabled={saveTrial.isPending || Boolean(trialResult)}>Denemeyi bitir <ChevronRight size={17} /></button></div>
            {trialResult && <div className="trial-result" role="status"><div><span>mini deneme sonucu</span><strong>{(trialResult.netMilli / 1000).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} net</strong></div><p><b>{trialResult.correct}</b> doğru · <b>{trialResult.wrong}</b> yanlış · <b>{trialResult.blank}</b> boş<br /><small>{String(Math.floor(trialResult.durationSeconds / 60)).padStart(2, "0")}:{String(trialResult.durationSeconds % 60).padStart(2, "0")} çözüm süresi</small></p><small>{isAuthenticated ? "Sonucun ve eriştiğin rozetler hesabına kaydedildi." : "Sonucun bu tarayıcıda görüntüleniyor. Giriş yaptığında rozet ve sonuç geçmişini hesabında saklayabilirsin."}</small></div>}
          </article>}
          <div className="achievement-strip"><div><Trophy size={17} /><span><b>{earnedBadgeCount}</b> kalıcı rozet</span></div>{latestTrial ? <div><Target size={17} /><span>Son kaydedilen deneme: <b>{(latestTrial.netMilli / 1000).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} net</b></span></div> : <div><Target size={17} /><span>İlk deneme sonucunu henüz kaydetmedin.</span></div>}</div>
          <p className="independence-note"><GraduationCap size={17} /> Algoritma Atlası, İSBO ve TÜBİTAK tarafından işletilen ya da onaylanan bir sistem değildir. Kamuya açık yarışma yapısı ve konu çerçevesinden yararlanan bağımsız bir eğitim prototipidir.</p>
        </section>

        <section id="kaynaklar" className="sources-section">
          <div><span className="eyebrow">Kaynaklar ve kapsam</span><h2>Rota, duyuru yerine araştırma notuna dayanır.</h2><p>Sayısal sınav bilgileri resmî İSBO şartnamesinden; aşamalı olimpiyat çerçevesi TÜBİTAK’ın program sayfasından; C dersi konu kümeleri ise açık ortaokul bilgisayar eğitim sayfasından doğrulayıcı kaynak olarak alınmıştır.</p></div>
          <ol>
            <li><span>[1]</span><a href="https://istanbul.meb.gov.tr/isbo/assets/dosyalar/sartname_2026.pdf" target="_blank" rel="noreferrer">İstanbul Bilim Olimpiyatları 2025–2026 Ön Eleme ve 1. Aşama Şartnamesi <ArrowUpRight size={14} /></a></li>
            <li><span>[2]</span><a href="https://bilimolimpiyatlari.tubitak.gov.tr/tr/ulusal-bilim-olimpiyatlari" target="_blank" rel="noreferrer">TÜBİTAK Ulusal Bilim Olimpiyatları <ArrowUpRight size={14} /></a></li>
            <li><span>[3]</span><a href="https://akademi.izbo.org.tr/OrtaokulBilgisayar" target="_blank" rel="noreferrer">İZBO Akademi — Ortaokul Bilgisayar <ArrowUpRight size={14} /></a></li>
          </ol>
        </section>
      </main>
    </div>
  );
}
