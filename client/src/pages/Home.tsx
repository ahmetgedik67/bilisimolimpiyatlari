import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  Compass,
  Eye,
  Lightbulb,
  LockKeyhole,
  RefreshCw,
  Repeat,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { RobiImage } from "@/components/RobiImage";
import { ROBI_IMAGE } from "@/lib/robiGuide";

/**
 * Bilfen C Yolu — hiç bilmeyen bir öğrenciyi öğretmen gibi adım adım İSBO'ya
 * hazırlayan interaktif öğrenme yolu. İlerleme yalnızca tarayıcıda (localStorage)
 * saklanır; sunucu bağımlılığı yoktur.
 */

type CourseStep = {
  title: string;
  body: string;
  code?: string;
};

type CourseQuiz = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

type Chapter = {
  id: string;
  no: string;
  title: string;
  label: string;
  tagline: string;
  icon: typeof Compass;
  steps: CourseStep[];
  quiz: CourseQuiz;
};

const CHAPTERS: Chapter[] = [
  {
    id: "bilgisayar-nasil-dusunur",
    no: "01",
    title: "Bilgisayar nasıl düşünür?",
    label: "algoritma",
    tagline: "Bilgisayar, yalnızca verdiğin talimatları sırayla yapar.",
    icon: Compass,
    steps: [
      {
        title: "Bilgisayar, yalnızca verilen talimatları yapar.",
        body:
          "Sen okula giderken kafanda bir plan vardır: kalk, giyin, kahvaltı yap, çık. Bilgisayar da tam böyledir — ona verdiğin talimatları sırayla, tek tek uygular. Bu adım adım talimat listesine ALGORİTMA denir. Program yazmak, bu listeyi bilgisayarın anlayacağı dille (bizde C) yazmaktır.",
      },
      {
        title: "Talimatlar kesin olmalı.",
        body:
          "\"Biraz topla\" dersen bilgisayar ne yapacağını bilemez; o, \"5 topla\" gibi kesin talimat bekler. Belirsizliği yorumlayamaz — anlayamazsa durur ya da hata verir. Bu yüzden iyi bir programcı, talimatlarını bir öğretmen kadar net kurar.",
      },
      {
        title: "Sıra kritiktir.",
        body:
          "Önce çorbayı iç, sonra pişir demek olur mu? Olmaz. Bilgisayar da talimatları VERDİĞİN SIRAYLA uygular; sırayı bozarsan sonuç bozulur. Bu sitedeki her soruda ilk bakacağın şey sıra olacak: kodu yukarıdan aşağıya, satır satır okuyacağız.",
      },
    ],
    quiz: {
      question: "Hangisi bilgisayar için anlaşılır bir talimattır?",
      options: ["Biraz bekle", "3 saniye bekle", "Mümkünse bekle"],
      answer: "3 saniye bekle",
      explanation:
        "Bilgisayar kesin değerlerle çalışır: \"3 saniye\" ne demek bellidir. \"Biraz\" ve \"mümkünse\" belirsizdir; bilgisayar bunu yorumlayamaz. Algoritma yazarken her talimatı bir makine gibi kesin kur.",
    },
  },
  {
    id: "ilk-program",
    no: "02",
    title: "İlk C programın",
    label: "printf",
    tagline: "main programın kapısıdır; printf ekrana yazar.",
    icon: Code2,
    steps: [
      {
        title: "Her C programı main ile başlar.",
        code: '#include <stdio.h>\n\nint main() {\n  printf("Merhaba Bilfen\\n");\n  return 0;\n}',
        body:
          "Satır satır okuyalım: 1. satır, ekrana yazı yazdırma aracını programa getirir. main() ise programın KAPISIDIR — çalıştırılan her program buradan başlar. Süslü parantezler { } kapının içini, yani yapılacak işleri belirtir.",
      },
      {
        title: "printf ekrana yazar.",
        body:
          "printf(\"...\") dediğinde tırnak içindeki yazı AYNEN ekrana çıkar. \\n ise \"bir alt satıra geç\" anlamına gelir. En sondaki noktalı virgül (;) cümlenin bittiğini söyler — Türkçedeki nokta gibi. Unutursan program derlenmez; bu, yeni başlayanların 1 numaralı hatasıdır.",
      },
      {
        title: "return 0 = her şey yolunda.",
        body:
          "Program sonunda 0 döndürmek \"sorunsuz bitti\" demektir. Şimdilik her programın sonunda göreceğin bir selamlaşma gibi düşün; sınav sorularında genellikle yok sayılır.",
      },
    ],
    quiz: {
      question: 'printf("5 + 3\\n"); çalışınca ekrana ne yazılır?',
      options: ["8", "5 + 3", "Hata verir"],
      answer: "5 + 3",
      explanation:
        "printf tırnak içindeki metni AYNEN yazar; hesap yapmaz. Bilgisayara \"5 + 3 yaz\" demiş olursun, \"topla\" değil. Tırnak işareti, metin ile işlem arasındaki çizgidir — İSBO sorularında bu ayrımı gören öğrenci yarısını kazanır.",
    },
  },
  {
    id: "degiskenler",
    no: "03",
    title: "Kutular: değişkenler",
    label: "int ve atama",
    tagline: "Atamada önce sağ taraf hesaplanır, sonra kutuya koyulur.",
    icon: BookOpen,
    steps: [
      {
        title: "Değişken, üstü yazılı bir kutudur.",
        body:
          "int x = 7; dersen \"x adında tam sayı (int) bir kutu aç, içine 7 koy\" demiş olursun. Kutunun etiketi isimdir; içindeki değer değişebilir — o yüzden adı DEĞİŞKEN. Değeri her değiştirdiğinde eskisi kaybolur; kutuda yalnız en güncel değer yaşar.",
      },
      {
        title: "Atama: önce sağ taraf, sonra kutuya koy.",
        code: 'int x = 7;\nx = x + 4;\nprintf("%d", x);',
        body:
          "2. satır garip görünebilir: \"x'e x+4'ü koy\". Bilgisayar önce SAĞ TARAFI hesaplar: kutudaki 7'yi alır, 4 ekler → 11. Sonra sonucu x kutusuna yazar. Eski 7 kaybolur; kutuda artık 11 var. İşte \"iz sürme\" demek, bu kutuları her satırda güncel tutmak demektir.",
      },
      {
        title: "%d kutudaki değeri ekrana getirir.",
        body:
          "printf(\"%d\", x) derken \"%d\" kutucuğuna \"buraya x'in güncel değerini yaz\" demiş olursun. Yani ekranda 11 görünür. %d = ondalık (decimal) tam sayı demektir; şimdilik tek format bu.",
      },
    ],
    quiz: {
      question: "Bu kodun çıktısı ne olur?",
      options: ["20", "7", "Hata verir"],
      answer: "7",
      explanation:
        "int y = x; satırı, x'in O ANKİ değeri olan 7'yi y kutusuna KOPYALAR. Sonra x = 20 olsa bile y'nin kutusu değişmez; kopya asıldan bağımsızdır. İSBO'nun en sevdiği tuzaklardan biri tam olarak budur.",
    },
  },
  {
    id: "kosullar",
    no: "04",
    title: "Karar kapıları",
    label: "if ve else",
    tagline: "Zincirde yalnızca İLK doğru koşulun bloğu çalışır.",
    icon: Eye,
    steps: [
      {
        title: "if bir kapıdır: koşul doğruysa açılır.",
        body:
          "if (s > 10) { ... } dersen, parantez içindeki karşılaştırma DOĞRU ise süslü parantez içindeki talimatlar çalışır. Yanlışsa blok atlanır — içine hiç girilmez, sanki yazılmamış gibi.",
      },
      {
        title: "else-if zinciri tek kapı açar.",
        code: 'int s = 12;\nif (s > 20) {\n  printf("A");\n} else if (s > 10) {\n  printf("B");\n} else {\n  printf("C");\n}',
        body:
          "Bilgisayar kapıları YUKARIDAN AŞAĞIYA sırayla kontrol eder. s = 12 için: 12 > 20 yanlış → ilk kapı kapalı. 12 > 10 doğru → B yazılır ve zincir DURUR. Aşağıdaki else'e hiç bakılmaz. Bir koşul yakalandığında diğerleri artık önemsizdir — İSBO'nun \"A/B/AB hangisi?\" soruları bu kuralı test eder.",
      },
      {
        title: "Karşılaştırma işaretlerini tanı.",
        body:
          "> büyüktür, < küçüktür, >= büyük-eşit, <= küçük-eşit, == eşit mi?, != eşit değil mi? Dikkat: == İKİ tane eşittir; tek = ise \"kutuya koy\" (atama) demektir. Bu ikisini karıştırmak en klasik hatalardandır.",
      },
    ],
    quiz: {
      question: "Aynı kodda s = 5 olsaydı çıktı ne olurdu?",
      options: ["A", "B", "C"],
      answer: "C",
      explanation:
        "5 > 20 yanlış, 5 > 10 yanlış; tüm kapılar kapalı. Böyle zamanlar için else (YOKSA) bloğu vardır: C yazılır. Aynı yapı, farklı değerlerle üç farklı yol izler — bunu görmek, koşul sorularının anahtarıdır.",
    },
  },
  {
    id: "donguler",
    no: "05",
    title: "Döngüler: aynı işi tekrarlamak",
    label: "for",
    tagline: "Başlangıç, koşul, güncelleme — ve her turu tek tek izlemek.",
    icon: Repeat,
    steps: [
      {
        title: "for üç parçadan oluşur.",
        body:
          "for (başlangıç; koşul; güncelleme). Örnek: for (int i = 1; i <= 3; i++) — \"i'yi 1'den başlat; i, 3'ten küçük ya da eşit olduğu SÜRECE dön; her tur sonunda i'yi 1 artır.\" Bilgisayar aynı satırı defalarca çalıştırabilir; gücü buradan gelir.",
      },
      {
        title: "Döngüyü tur tur izle.",
        code: 'int toplam = 0;\nfor (int i = 1; i <= 3; i++) {\n  toplam = toplam + i;\n}\nprintf("%d", toplam);',
        body:
          "Tur 1: i = 1 → toplam = 0 + 1 = 1.\nTur 2: i = 2 → toplam = 1 + 2 = 3.\nTur 3: i = 3 → toplam = 3 + 3 = 6.\nSonra i = 4 olur; koşul 4 <= 3 YANLIŞ → döngü durur. Ekranda 6 görünür. Döngü sorularında her turu ayrı bir satır olarak yazmak, hatasız çözümün sırrıdır.",
      },
      {
        title: "Koşuldaki sınır sonucu değiştirir.",
        body:
          "i <= 3 mü, i < 3 mü? İlki 3 tur döner, ikincisi 2. Bu küçük fark cevabı tamamen değiştirir — sınav sorularında en çok bu sınır oyunu sorulur. Koşulu her zaman SON TUR için ayrıca kontrol et: \"i = 3'te koşul hâlâ doğru mu?\"",
      },
    ],
    quiz: {
      question: "Bu kodun çıktısı ne olur?",
      options: ["4", "8", "16", "24"],
      answer: "16",
      explanation:
        "carpim her turda 2 ile çarpılır: 1 → 2 → 4 → 8 → 16 (4 tur). Dikkat: i'nin kendisi işleme girmez; yalnız tur sayar. 4 tur = 2'nin 4. kuvveti = 16. Döngüde \"sayaç tur sayar, işlemin içine girmek zorunda değildir\" — bunu görmek kritiktir.",
    },
  },
  {
    id: "sinav-provasi",
    no: "06",
    title: "Sınav provası: hepsi bir arada",
    label: "hepsi bir arada",
    tagline: "Beş aracını birleştirip gerçek sınav sorusunu çöz.",
    icon: Wrench,
    steps: [
      {
        title: "Artık beş aracın var.",
        body:
          "1) SIRA (adım adım yürütme), 2) printf (ekrana yazma), 3) DEĞİŞKEN (kutu), 4) KOŞUL (kapı), 5) DÖNGÜ (tekrar). İSBO'daki kod sorularının çoğu bu beş aracı birleştirir ve tek bir şey sorar: \"Kod çalışınca ekrana ne yazar?\"",
      },
      {
        title: "Yöntem: kutuları güncel tut.",
        body:
          "Kodu okurken her değişkenin GÜNCEL değerini yanına yaz: a = 2, sonra a = 5... Satır satır ilerle; eski değere asla dönme. Döngüde her turu AYRI bir satır olarak yaz. Bu yöntemle hiçbir İSBO kod sorusu senden kaçıamaz.",
      },
      {
        title: "Öğrendiklerin, sınav sorularının ta kendisi.",
        body:
          "Atölyedeki her soruda önce soruyu Ayıştır, sonra İzle aşamasında bu yöntemi kullanacaksın. Hazırsan aşağıdaki soruyu çöz — bu, gerçek bir İSBO tarzı soru!",
      },
    ],
    quiz: {
      question: "Bu kodun çıktısı ne olur?",
      options: ["BÜYÜK", "KÜÇÜK", "Hata verir"],
      answer: "BÜYÜK",
      explanation:
        "İzleyelim: a = 2 başlar. Tur 1: i = 0 → a = 2 + 0 = 2. Tur 2: i = 1 → a = 2 + 1 = 3. Tur 3: i = 2 → a = 3 + 2 = 5. i = 3'te koşul i < 3 bozulur, döngü durur. a = 5 ve 5 > 4 doğru → BÜYÜK yazılır. Tebrikler — döngü + koşul + değişkeni tek soruda kullandın!",
    },
  },
] as const;

const STORAGE_KEY = "bilfen-c-yolu-progress";

type ProgressState = { completedChapterIds: string[] };

function parseProgress(raw: string | null): ProgressState {
  try {
    if (!raw) return { completedChapterIds: [] };
    const parsed = JSON.parse(raw) as { completedChapterIds?: unknown };
    if (!Array.isArray(parsed.completedChapterIds)) return { completedChapterIds: [] };
    return { completedChapterIds: parsed.completedChapterIds.filter((id): id is string => typeof id === "string") };
  } catch {
    return { completedChapterIds: [] };
  }
}

export default function Home() {
  const [progress, setProgress] = useState<ProgressState>({ completedChapterIds: [] });
  const [activeChapterId, setActiveChapterId] = useState<string>(CHAPTERS[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [notice, setNotice] = useState("Hoş geldin! Hiç bilmeden başlamak serbest — Robi her adımda yanında.");
  const hasHydrated = useRef(false);

  useEffect(() => {
    const parsed = parseProgress(window.localStorage.getItem(STORAGE_KEY));
    setProgress(parsed);
    const firstOpen = CHAPTERS.find((chapter) => !parsed.completedChapterIds.includes(chapter.id)) ?? CHAPTERS[0];
    setActiveChapterId(firstOpen.id);
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (hasHydrated.current) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const activeIndex = CHAPTERS.findIndex((chapter) => chapter.id === activeChapterId);
  const activeChapter = CHAPTERS[activeIndex] ?? CHAPTERS[0];
  const isChapterCompleted = progress.completedChapterIds.includes(activeChapter.id);
  const isStepRevealed = (index: number) => index <= stepIndex || isChapterCompleted;
  const isLastStep = stepIndex >= activeChapter.steps.length - 1;
  const completedCount = progress.completedChapterIds.length;
  const isCourseDone = completedCount >= CHAPTERS.length;

  function goToChapter(id: string) {
    setActiveChapterId(id);
    setStepIndex(0);
    setPicked(null);
  }

  function revealNextStep() {
    setStepIndex((current) => Math.min(current + 1, activeChapter.steps.length - 1));
  }

  function pickAnswer(option: string) {
    if (picked) return;
    setPicked(option);
    if (option === activeChapter.quiz.answer) {
      const wasCompleted = progress.completedChapterIds.includes(activeChapter.id);
      if (!wasCompleted) {
        setProgress((current) => ({ ...current, completedChapterIds: [...current.completedChapterIds, activeChapter.id] }));
        const next = CHAPTERS[activeIndex + 1];
        setNotice(next ? `Bölüm ${activeChapter.no} tamam! Bölüm ${next.no} açıldı: ${next.title}.` : "Tüm bölümler tamam! Gerçek İSBO sorularına geçmeye hazırsın.");
      }
    } else {
      setNotice("Olmadı — sorun değil. Açıklamayı oku, öğretmen gibi sana adımı adımı anlatıyor; sonra yeniden dene.");
    }
  }

  function retryQuiz() {
    setPicked(null);
  }

  return (
    <div className="atlas-app">
      <header className="atlas-topbar">
        <a className="atlas-brand" href="#kurs" aria-label="C Yolu başlangıç">
          <img src={`${import.meta.env.BASE_URL}assets/bilfen-logo.png`} alt="Bilfen Eğitim Kurumları" className="bilfen-logo" />
          <span>
            <strong>Bilişim Teknolojileri Bölümü</strong>
            <small>C Yolu · sıfırdan öğrenme rotası</small>
          </span>
        </a>

        <div className="topbar-actions">
          <a className="topbar-link" href="#bolumler">Bölümler</a>
          <a className="topbar-link topbar-link--isbo" href={`${import.meta.env.BASE_URL}isbo-atolyesi`}>İSBO Atölyesi</a>
          <a className="topbar-link topbar-link--science" href={`${import.meta.env.BASE_URL}bilim-zeka`}>Bilim ve Zekâ</a>
          <a className="topbar-link" href={`${import.meta.env.BASE_URL}giris`} title="Öğretmen ve yönetici girişi"><ShieldCheck size={14} /> Yönetici</a>
        </div>
      </header>

      <main id="kurs">
        <section className="course-hero">
          <div>
            <span className="eyebrow">Bilfen Eğitim Kurumları · Bilişim Teknolojileri Bölümü</span>
            <h1>C dilini hiç bilmiyorsan<br /><em>doğru yerdesin.</em></h1>
            <p>
              Bu yol, sana bir öğretmen gibi adım adım ilerler: önce küçük bir fikir verir,
              sonra birlikte kodu okur, en sonunda seni tek başına bırakır. Hiç C bilmeyen
              bir öğrenci buradan İSBO sınav sorularına kadar yürüyebilir.
            </p>
            <div className="hero-actions">
              <a href="#bolumler" className="primary-action">1. bölümden başla <ChevronRight size={17} /></a>
              <a href={`${import.meta.env.BASE_URL}isbo-atolyesi`} className="quiet-action">İSBO Atölyesi'ne git <ArrowRight size={15} /></a>
            </div>
            <div className="hero-facts" aria-label="Yol özeti">
              <span><BookOpen size={15} /> 6 bölüm · sıfırdan</span>
              <span><Code2 size={15} /> her bölümde mini soru</span>
              <span><Wrench size={15} /> sonunda gerçek İSBO pratiği</span>
            </div>
          </div>
          <div className="hero-map" role="img" aria-label="C Yolu öğrenme rotası görseli">
            <img src={`${import.meta.env.BASE_URL}assets/robi.jpeg`} alt="" />
            <aside className="hero-robi" aria-label="Robi ders rehberi">
              <RobiImage src={ROBI_IMAGE} alt="Robi, C Yolu öğrenme rehberi" loading="eager" />
              <div>
                <span>ROBİ · DERS REHBERİ</span>
                <strong>Adım adım, birlikte.</strong>
                <p>Her bölümde önce sana anlatırım, sonra kodu birlikte okuruz; mini soruyu geçince bir sonraki bölüm açılır.</p>
              </div>
            </aside>
            <div className="map-stamp"><Compass size={16} /> yol 01<br /><b>sıfır öğrenci</b></div>
          </div>
        </section>

        <section className="atlas-ribbon" aria-label="İlerleme">
          <p role="status"><Sparkles size={16} /> {notice}</p>
          <div>
            <span><strong>{completedCount}</strong> / {CHAPTERS.length} bölüm</span>
            <span className="save-state">bu tarayıcıda saklanıyor</span>
          </div>
        </section>

        <section id="bolumler" className="atlas-layout">
          <aside className="route-rail" aria-label="Bölüm listesi">
            <div className="rail-heading">
              <span>öğrenme yolu</span>
              <strong>{isCourseDone ? "tüm bölümler tamam" : `sırada: ${CHAPTERS.find((c) => !progress.completedChapterIds.includes(c.id))?.title ?? "İSBO atölyesi"}`}</strong>
            </div>
            <ol className="mission-list">
              {CHAPTERS.map((chapter, index) => {
                const Icon = chapter.icon;
                const completed = progress.completedChapterIds.includes(chapter.id);
                const available = index === 0 || progress.completedChapterIds.includes(CHAPTERS[index - 1].id);
                const active = chapter.id === activeChapter.id;
                return (
                  <li key={chapter.id} className={`${active ? "is-active" : ""} ${completed ? "is-completed" : ""} ${!available ? "is-locked" : ""}`}>
                    <button
                      onClick={() => available && goToChapter(chapter.id)}
                      disabled={!available}
                      aria-current={active ? "step" : undefined}
                    >
                      <span className="mission-index">{completed ? <Check size={13} /> : chapter.no}</span>
                      <span className="mission-copy"><b>{chapter.title}</b><small>{chapter.label}</small></span>
                      {available ? <Icon size={16} /> : <LockKeyhole size={15} />}
                    </button>
                    {index < CHAPTERS.length - 1 && <i className="route-line" aria-hidden="true" />}
                  </li>
                );
              })}
            </ol>
            <div className="rail-note"><Lightbulb size={16} /><span>Bölümler sırayla açılır: her mini soru, bir sonraki bölümün anahtarıdır.</span></div>
          </aside>

          <div className="course-area">
            <div className="lesson-head">
              <div>
                <span className="eyebrow eyebrow--ink">BÖLÜM {activeChapter.no} · {activeChapter.label}</span>
                <h2>{activeChapter.title}</h2>
                <p>{activeChapter.tagline}</p>
              </div>
              <span className={`course-seal ${isChapterCompleted ? "is-done" : ""}`}>
                {isChapterCompleted ? <><Check size={15} /> tamam</> : "yolda"}
              </span>
            </div>

            <article className="course-steps">
              {activeChapter.steps.map((step, index) => (
                isStepRevealed(index) ? (
                  <div key={activeChapter.id + index} className={`course-step ${index === stepIndex && !isChapterCompleted ? "is-current" : ""}`}>
                    <span className="step-badge">{index + 1}</span>
                    <div>
                      <h3>{step.title}</h3>
                      {step.body.split("\n").map((line, lineIndex) => <p key={lineIndex}>{line}</p>)}
                      {step.code && (
                        <pre className="course-code" aria-label="C kodu örneği"><code>{step.code}</code></pre>
                      )}
                    </div>
                  </div>
                ) : null
              ))}
              {!isLastStep && (
                <button className="course-next" onClick={revealNextStep}>
                  Sıradaki adım <ChevronRight size={16} />
                </button>
              )}
            </article>

            {(isLastStep || isChapterCompleted) && (
              <article className="course-quiz" aria-label="Mini soru">
                <header>
                  <span className="eyebrow eyebrow--coral"><Lightbulb size={14} /> Sıra sende</span>
                  <h3>{activeChapter.quiz.question}</h3>
                </header>
                {activeChapter.quiz.question.includes("çıktı") || activeChapter.quiz.question.includes("ne olur") || activeChapter.quiz.question.includes("yazılır") ? null : null}
                <div className="course-options" role="group" aria-label="Cevap seçenekleri">
                  {activeChapter.quiz.options.map((option) => {
                    const isPicked = picked === option;
                    const isAnswer = option === activeChapter.quiz.answer;
                    const cls = isPicked ? (isAnswer ? "is-correct" : "is-wrong") : picked && isAnswer ? "is-answer" : "";
                    return (
                      <button key={option} disabled={Boolean(picked)} className={cls} onClick={() => pickAnswer(option)}>
                        {option}
                      </button>
                    );
                  })}
                </div>
                {picked && (
                  <div className={`course-feedback ${picked === activeChapter.quiz.answer ? "is-good" : "is-bad"}`} role="status">
                    <p>
                      <b>{picked === activeChapter.quiz.answer ? "Doğru! " : "Yakın ama değil. "}</b>
                      {activeChapter.quiz.explanation}
                    </p>
                    <div>
                      {picked !== activeChapter.quiz.answer && (
                        <button onClick={retryQuiz}><RefreshCw size={14} /> Yeniden dene</button>
                      )}
                      {picked === activeChapter.quiz.answer && activeIndex < CHAPTERS.length - 1 && (
                        <button className="course-advance" onClick={() => goToChapter(CHAPTERS[activeIndex + 1].id)}>
                          Bölüm {CHAPTERS[activeIndex + 1].no}'a geç <ArrowRight size={14} />
                        </button>
                      )}
                      {picked === activeChapter.quiz.answer && activeIndex === CHAPTERS.length - 1 && (
                        <a className="course-advance" href={`${import.meta.env.BASE_URL}isbo-atolyesi`}>
                          İSBO Atölyesi'ne geç <ArrowRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </article>
            )}

            {isCourseDone && (
              <article className="course-finish">
                <h3>Öğrenme yolunu bitirdin — sıra pratikte!</h3>
                <p>
                  Sıra, printf, değişken, koşul ve döngü… İSBO kod sorularının beş aracı artık sende.
                  Atölyede 2024 ön eleme sorularını Oku → Ayıştır → İzle → Yorumla → Yanıtla adımlarıyla
                  çözeceksin; her soruda az önce kullandığın kutuları güncel tutma yöntemi karşına çıkacak.
                </p>
                <a className="primary-action" href={`${import.meta.env.BASE_URL}isbo-atolyesi`}>İSBO Atölyesi'ne git <ArrowRight size={15} /></a>
              </article>
            )}
          </div>
        </section>

        <section className="course-note">
          <p>
            Bu öğrenme yolu, İSBO bilişim olimpiyatı hazırlığı için tasarlanmış özgün eğitim içeriğidir;
            sınavın resmî kopyası değildir. İlerlemen bu tarayıcıda saklanır.
          </p>
        </section>
      </main>
    </div>
  );
}
