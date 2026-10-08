import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Compass,
  Lightbulb,
  MapPinned,
  Route,
} from "lucide-react";
import { ROBI_IMAGE, robiLessonPrompts, robiMessages } from "@/lib/robiGuide";
import { RobiImage } from "@/components/RobiImage";
import { Link } from "wouter";

const lessonUnits = [
  {
    id: "akis",
    no: "01",
    title: "Akış ve sıra",
    subtitle: "Kod, yukarıdan aşağıya yürür.",
    goal: "Bir değişkenin değerini her satırdan sonra güncelleyip printf satırına kadar taşıyabilmek.",
    code: 'int x = 4;\nx = x + 3;\nprintf("%d", x);',
    steps: ["Başlangıç değerini not et.", "İşlem satırının önceki değeri nasıl değiştirdiğini izle.", "Yalnızca en güncel değeri yazdır."],
    mistake: "Bir satırdaki yeni değeri, kodun önceki satırlarında varmış gibi kullanmak.",
  },
  {
    id: "degisken",
    no: "02",
    title: "Değişkenler ve atama",
    subtitle: "Kutudaki değer değişebilir.",
    goal: "Atamanın sağ tarafını önce hesaplayıp sonucu sol taraftaki değişkene koyabilmek.",
    code: 'int puan = 6;\nint yedek = puan;\npuan = puan - 2;\nprintf("%d %d", puan, yedek);',
    steps: ["Her değişkeni ayrı bir kutu gibi düşün.", "Kopyalama satırındaki anlık değeri ayır.", "Sonraki atamalar yalnızca hedef kutuyu değiştirir."],
    mistake: "Bir değişken değiştiğinde ona önceden kopyalanan tüm değerlerin de değiştiğini sanmak.",
  },
  {
    id: "kosul",
    no: "03",
    title: "Karar kapıları",
    subtitle: "Koşul, yalnızca bir yolu açar.",
    goal: "Karşılaştırma ifadesinin doğru ya da yanlış olmasına göre çalışan dalı seçebilmek.",
    code: 'int n = 12;\nif (n > 10) {\n  printf("A");\n} else {\n  printf("B");\n}',
    steps: ["Değişkeni koşulun içine yerleştir.", "Karşılaştırmanın doğru olup olmadığını belirle.", "Yalnızca açık olan dalı izle."],
    mistake: "Hem if hem else bloğunun çalıştığını varsaymak.",
  },
  {
    id: "dongu",
    no: "04",
    title: "Döngüler",
    subtitle: "Sayaç, her turu görünür kılar.",
    goal: "Başlangıç, devam koşulu ve güncelleme adımlarından döngünün kaç kez çalıştığını bulabilmek.",
    code: 'for (int i = 0; i < 3; i++) {\n  printf("*");\n}',
    steps: ["Sayaç için başlangıç değerini yaz.", "Koşulun doğru olduğu değerleri sırala.", "Her turdan sonra güncelleme satırını uygula."],
    mistake: "Koşulda sınır değerinin dahil olup olmadığını gözden kaçırmak.",
  },
  {
    id: "dizi",
    no: "05",
    title: "Diziler",
    subtitle: "İlk kutunun indeksi sıfırdır.",
    goal: "Bir dizide indeksin gösterdiği elemanı bulup güncelleme varsa yeni değeri izleyebilmek.",
    code: 'int a[4] = {3, 6, 9, 12};\na[1] = a[1] + 2;\nprintf("%d", a[1]);',
    steps: ["İndeks sayımını sıfırdan başlat.", "İstenen kutuyu bul.", "O kutuya yapılan değişikliği uygula."],
    mistake: "a[1] ifadesini ilk kutu olarak yorumlamak.",
  },
  {
    id: "fonksiyon",
    no: "06",
    title: "Fonksiyonlar",
    subtitle: "Girdi, kuraldan geçip çıktı olur.",
    goal: "Fonksiyon çağrısındaki girdiyi parametre yerine koyup return sonucunu bulabilmek.",
    code: 'int kare(int n) {\n  return n * n;\n}\nprintf("%d", kare(4));',
    steps: ["Çağrıdaki değeri parametreye yerleştir.", "Return satırındaki işlemi uygula.", "Dönen değeri çağrının yerine koy."],
    mistake: "Fonksiyon gövdesini çağrı olmadan çalıştırmak.",
  },
] as const;

export default function Lessons() {
  return (
    <div className="lesson-page">
      <header className="lesson-topbar">
        <Link href="/" className="lesson-brand" aria-label="Bilfen Bilişim Teknolojileri Bölümü başlangıç">
          <img src={`${import.meta.env.BASE_URL}assets/bilfen-logo.png`} alt="Bilfen Eğitim Kurumları" className="bilfen-logo" />
          <span><strong>Bilişim Teknolojileri Bölümü</strong><small>Algoritma Atlası · konu anlatımı</small></span>
        </Link>
        <Link href="/" className="lesson-back"><ArrowLeft size={16} /> Rota görevlerine dön</Link>
      </header>

      <main>
        <section className="lesson-hero">
          <div>
            <span className="eyebrow eyebrow--ink"><BookOpen size={14} /> Konu anlatımı / C temelleri</span>
            <h1>Önce mantığı kur.<br /><em>Sonra kodu izle.</em></h1>
            <p>Bu sayfa, rotadaki görevlerden önce ya da sonra çalışmak için kısa konu anlatımları sunar. Her ünite bir kural, küçük bir C örneği ve sık yapılan hatayı içerir.</p>
            <a href="#unite-01" className="lesson-primary">İlk üniteden başla <ArrowUpRight size={16} /></a>
          </div>
          <aside className="lesson-hero-note lesson-hero-robi">
            <RobiImage src={ROBI_IMAGE} alt="Robi, konu anlatımı ders rehberi" loading="eager" />
            <div>
              <Compass size={24} />
              <span>{robiMessages.lesson.label}</span>
              <strong>{robiMessages.lesson.title}</strong>
              <p>{robiMessages.lesson.body}</p>
            </div>
          </aside>
        </section>

        <nav className="lesson-index" aria-label="Konu anlatımı üniteleri">
          {lessonUnits.map((unit) => <a key={unit.id} href={`#unite-${unit.no}`}><span>{unit.no}</span>{unit.title}</a>)}
        </nav>

        <section className="lesson-units" aria-label="C konu anlatımları">
          {lessonUnits.map((unit, index) => {
            const Icon = [Route, MapPinned, Compass, Lightbulb, Code2, CheckCircle2][index];
            return (
              <article key={unit.id} id={`unite-${unit.no}`} className="lesson-unit">
                <header>
                  <span className="lesson-unit-no">ünite {unit.no}</span>
                  <Icon size={22} />
                  <h2>{unit.title}</h2>
                  <p>{unit.subtitle}</p>
                </header>
                <div className="lesson-unit-grid">
                  <div className="lesson-goal">
                    <span>hedef</span>
                    <p>{unit.goal}</p>
                    <div className="lesson-robi-tip"><RobiImage src={ROBI_IMAGE} alt="Robi ders ipucu" /><p><b>Robi'nin işareti</b>{robiLessonPrompts[unit.id]}</p></div>
                    <div className="lesson-mistake"><Lightbulb size={17} /><div><b>Sık hata</b><p>{unit.mistake}</p></div></div>
                  </div>
                  <pre aria-label={`${unit.title} C kod örneği`}><code>{unit.code}</code></pre>
                  <ol className="lesson-steps">
                    {unit.steps.map((step, stepIndex) => <li key={step}><span>{String(stepIndex + 1).padStart(2, "0")}</span><p>{step}</p></li>)}
                  </ol>
                </div>
                <Link href="/#rota" className="lesson-practice-link">Bu konunun rota görevine git <ArrowUpRight size={15} /></Link>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
