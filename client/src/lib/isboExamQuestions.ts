/**
 * İSBO 2024 — Ortaokul Bilgisayar Ön Eleme soruları (25 soru).
 *
 * Soru görselleri okulun formundan alınmıştır (client/public/assets/isbo/).
 * Çözümler ve animasyonlar Bilfen eğitim çalışmasıdır; "önerilen çözüm"
 * niteliğindedir, resmî cevap anahtarı ile karşılaştırılabilir.
 */

import type { AnimStep, IsboPhase, IsboQuestion } from "./isboQuestions";

const AE = ["A", "B", "C", "D", "E"];

function phases(
  oku: string,
  ayistir: string,
  cards: Array<{ label: string; value: string }>,
  izle: string,
  yorumla: string,
  yanitla: string,
): IsboPhase[] {
  return [
    { id: "oku", title: "Soruyu oku", body: oku },
    { id: "ayistir", title: "Bilgiyi ayıştır", body: ayistir, cards },
    { id: "izle", title: "Animasyonu izle", body: izle },
    { id: "yorumla", title: "Yorumla", body: yorumla },
    { id: "yanitla", title: "Yanıtla", body: yanitla },
  ];
}

const ISBO_EXAM_PART1: IsboQuestion[] = [
  {
    id: "isbo24-01",
    number: "1",
    topic: "Kümeler",
    skill: "Ortak harf sayma",
    image: "assets/isbo/q01.png",
    section: "Sayı ve harf mantığı",
    prompt:
      "Aslı BİLGİSAYAR kelimesinden, Burhan OLİMPİYAT kelimesinden 5 farklı harf seçiyor. Aslı'nın seçtiği harflerin en fazla kaçı Burhan'da da olabilir?",
    options: AE,
    optionNotes: ["2", "3", "4", "5", "6"],
    answer: "C",
    explanation:
      "BİLGİSAYAR'ın farklı harfleri: B, İ, L, G, S, A, Y, R. OLİMPİYAT'ın farklı harfleri: O, L, İ, M, P, Y, A, T. Ortak harfler: İ, L, Y, A → 4 tane. İki öğrenci de bu 4 harfi seçip birer 'kendi' harf ekler; 5. ortak harf olmadığı için en fazla 4 mümkündür.",
    animation: {
      kind: "sets",
      heading: "İki kelimenin harf kümeleri: ortaklar yanıp sönüyor",
      setA: ["B", "İ", "L", "G", "S", "A", "Y", "R"],
      setB: ["O", "L", "İ", "M", "P", "Y", "A", "T"],
      setLabels: ["BİLGİSAYAR", "OLİMPİYAT"],
    },
    animSteps: [
      { label: "Kümeleri yaz", note: "İki kelimenin harflerini tekrarsız listele. '5 farklı harf seçiliyor' kısıtı, kümelerle düşünmemizi gerektirir.", hiA: [], hiB: [] },
      { label: "İ", note: "İ harfi her iki kelimede de var → ortak. 1. ortak.", hiA: [1], hiB: [2] },
      { label: "L", note: "L de iki kelimede var → 2. ortak.", hiA: [1, 2], hiB: [1, 2] },
      { label: "Y", note: "Y iki kelimede var → 3. ortak.", hiA: [1, 2, 6], hiB: [1, 2, 5] },
      { label: "A", note: "A iki kelimede var → 4. ortak.", hiA: [1, 2, 5, 6], hiB: [1, 2, 4, 5] },
      { label: "Sonuç", note: "Ortak harf sayısı 4. Aslı bu 4 harfi seçer, Burhan da aynısını seçer; beşinci ortak harf yoktur.", hiA: [1, 2, 5, 6], hiB: [1, 2, 4, 5] },
    ],
    phases: phases(
      "İki kelime var ve her öğrenci kendi kelimesinden 5 FARKLI harf seçiyor. Soru 'en fazla' diye soruyor: en iyi senaryoyu arıyoruz.",
      "Verilen: iki kelime + 'farklı harf' kısıtı. İstenen: seçimlerin kesişiminin en büyük boyutu. En iyi senaryo, iki kelimenin ortak harflerinin tümünün seçilmesidir.",
      [
        { label: "Kelimeler", value: "BİLGİSAYAR / OLİMPİYAT" },
        { label: "Kısıt", value: "her seçimde harfler farklı" },
        { label: "İstenen", value: "en fazla ortak sayısı" },
      ],
      "Animasyonda iki harf kümesi yan yana; ortak harfler sırayla yanıp sönüyor. A ve İ harfleri kelimelerde ikişer kez geçse de kümelerde bir kez yer alır.",
      "'Farklı harf' kısıtı sayesinde soru bir küme kesişimi sorusuna döner: en fazla ortak = ortak harf sayısı. BİLGİSAYAR'da 8, OLİMPİYAT'ta 8 farklı harf var; kesişimleri 4.",
      "Gerekçelendir: 'Ortak harfler İ, L, Y, A. Beşincisi yok.' Cevap: C) 4.",
    ),
  },
  {
    id: "isbo24-02",
    number: "2",
    topic: "Yaş problemi",
    skill: "Zaman kaydırma",
    image: "assets/isbo/q02.png",
    section: "Sayı ve harf mantığı",
    prompt:
      "İbrahim, Ahmet'ten 12 yaş büyüktür. 5 yıl önce Ahmet 4 yaşına olduğuna göre 3 yıl sonra İbrahim kaç yaşında olacaktır?",
    options: AE,
    optionNotes: ["28", "27", "26", "25", "24"],
    answer: "E",
    explanation:
      "5 yıl önce Ahmet 4 yaşındaydı → şimdi 4+5 = 9. İbrahim her zaman 12 yaş büyük → şimdi 9+12 = 21. 3 yıl sonra 21+3 = 24.",
    animation: {
      kind: "table",
      heading: "Zaman çizgisi: her adımda yaşlar güncelleniyor",
      rows: [
        { cells: ["5 yıl önce", "Ahmet = 4 yaş"] },
        { cells: ["şimdi", "Ahmet = 4 + 5 = 9 yaş"] },
        { cells: ["şimdi", "İbrahim = 9 + 12 = 21 yaş"] },
        { cells: ["3 yıl sonra", "İbrahim = 21 + 3 = 24 yaş"] },
      ],
    },
    animSteps: [
      { label: "Tek veri", note: "Sorunun tek mutlak verisi: 5 yıl önce Ahmet 4 yaşındaydı. Tüm hesap buradan çoğalır." },
      { label: "Şimdi", note: "5 yıl ileri sar: Ahmet şimdi 9 yaşında." },
      { label: "İbrahim", note: "İbrahim hep 12 yaş büyük: 9 + 12 = 21. Yaş farkı zamanla değişmez — bu sorunun ana fikri." },
      { label: "3 yıl sonra", note: "21 + 3 = 24. Yaş farkı hâlâ 12; yalnız ikisi de büyüdü." },
    ],
    phases: phases(
      "Yaş sorularında soruyu bir zaman çizgisi gibi oku: '5 yıl önce', 'şimdi', '3 yıl sonra' üç duraktır.",
      "Verilen: yaş farkı 12; Ahmet'in geçmişteki yaşı 4. İstenen: İbrahim'in gelecekteki yaşı. Ara durak: Ahmet'in şimdiki yaşı.",
      [
        { label: "Fark", value: "İbrahim = Ahmet + 12" },
        { label: "Geçmiş", value: "Ahmet(−5) = 4" },
        { label: "İstenen", value: "İbrahim(+3) = ?" },
      ],
      "Tablo satır satır açılıyor: önce Ahmet bugüne taşınıyor, sonra fark ekleniyor, en son 3 yıl ekleniyor.",
      "Sık tuzak: farkı '5 yıl önce' durumuna uygulamak. Fark sabittir; onu herhangi bir durakta uygulayabilirsin ama tutarlı kalmalısın. Ayrıca 28 (12+4+12 gibi karışım) seçeneklere bilerek konmuştur.",
      "'4+5=9; 9+12=21; 21+3=24.' Cevap: E) 24.",
    ),
  },
  {
    id: "isbo24-03",
    number: "3",
    topic: "Sayma",
    skill: "İşlem sayma",
    image: "assets/isbo/q03.png",
    section: "Sayı ve harf mantığı",
    prompt:
      "Marangoz bir kalayı önce üç parçaya, sonra her parçayı üçer parçaya ayırıyor. Kesme işlemini kaç kez yapmıştır?",
    options: AE,
    optionNotes: ["4", "8", "9", "12", "13"],
    answer: "B",
    explanation:
      "1 parçayı 3 parçaya ayırmak 2 kesme demektir (k+1 parça için k kesme). İlk aşama: 2 kesme → 3 parça. İkinci aşama: her parçaya 2 kesme → 3×2 = 6 kesme → 9 parça. Toplam 2+6 = 8.",
    animation: {
      kind: "table",
      heading: "Kesme sayacı: parça sayısı ve kesme sayısı birlikte büyüyor",
      rows: [
        { cells: ["Başlangıç", "1 kala", "0 kesme"] },
        { cells: ["1. aşama", "3 parça", "2 kesme"] },
        { cells: ["2. aşama", "3 × 3 = 9 parça", "2 + 3×2 = 8 kesme"] },
      ],
    },
    animSteps: [
      { label: "Kural", note: "Bir parçayı 3'e ayırmak = 2 kesme. Parça sayısı her kesmede +1 artar; k parçadan 3k parçaya geçmek k kesme tutar." },
      { label: "1. aşama", note: "1 kala → 3 parça: 2 kesme." },
      { label: "2. aşama", note: "Şimdi elde 3 parça var; her biri 3 parçaya: 3×2 = 6 kesme daha. Toplam 2+6 = 8." },
    ],
    phases: phases(
      "'Üç parçaya ayırıyor', 'üçer parçaya ayırıyor' — iki aşamalı bir işlem var. Sorulan şey parça sayısı değil, KESME sayısı.",
      "Kritik ayrışma: kesme sayısı parça sayısına eşit değildir. 3 parça elde etmek 2 kesmedir; 9 parça 8 kesme. Parça → kesme çevirisi: n parçaya ayırmak n−1 kesme.",
      [
        { label: "Aşama 1", value: "1 → 3 parça (2 kesme)" },
        { label: "Aşama 2", value: "3 → 9 parça (6 kesme)" },
        { label: "İstenen", value: "toplam kesme" },
      ],
      "Tabloda parça ve kesme sütunları yan yana büyüyor: parçalar 1→3→9, kesmeler 0→2→8.",
      "Seçeneklerdeki 9 parça sayısı, 6 (yalnız ikinci aşama) ve 13 (parça sayıları toplamı) bilinçli tuzaklardır. Kuralı kuran öğrenci hepsini eler: kesme = parça − 1.",
      "'2 + 6 = 8.' Cevap: B) 8.",
    ),
  },
  {
    id: "isbo24-04",
    number: "4",
    topic: "Örüntü",
    skill: "Dönem (periyot) bulma",
    image: "assets/isbo/q04.png",
    section: "Sayı ve harf mantığı",
    prompt:
      "1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5, … örüntüsünde 2024. sayı kaçtır?",
    options: AE,
    optionNotes: ["1", "2", "3", "4", "5"],
    answer: "B",
    explanation:
      "Örüntü 1,2,3,4,5,4,3,2 şeklinde 8 sayıda bir tekrar eder. 2024 = 8 × 253 tam bölünür → 2024. sayı, dönemin 8. (son) sayısıdır: 2.",
    animation: {
      kind: "sequence",
      heading: "Şerit animasyonu: 8 adımda bir tekrar eden dönem",
      cells: ["1", "2", "3", "4", "5", "4", "3", "2"],
    },
    animSteps: [
      { label: "Oku", note: "Sayılar 1'den 5'e çıkıp 2'ye iniyor; sonra 1'den yeniden başlıyor.", active: [0] },
      { label: "Tırmanış", note: "1, 2, 3, 4, 5 — beş adım yukarı.", active: [0, 1, 2, 3, 4] },
      { label: "İniş", note: "4, 3, 2 — üç adım aşağı. 5 tırmanış + 3 iniş = 8 adımlık dönem.", active: [5, 6, 7] },
      { label: "Böl", note: "2024 ÷ 8 = 253, kalan 0. Kalan 0, dönemin SON elemanına denk gelir." },
      { label: "Seç", note: "Dönemin 8. sayısı 2 → 2024. sayı 2'dir.", active: [7] },
    ],
    phases: phases(
      "Sonsuza giden bir sayı şeridinde belirli bir sıradaki sayı soruluyor. Uzun diziyi tek tek yazmak imkânsız — örüntünün dönemi bulunmalı.",
      "Verilen: örüntünün başı. İstenen: 2024. terim. Araç: dönem uzunluğu ve 2024'ün 8'e bölümünden kalan.",
      [
        { label: "Dönem", value: "1,2,3,4,5,4,3,2 (8 terim)" },
        { label: "Bölme", value: "2024 = 8 × 253" },
        { label: "Kalan", value: "0 → dönem sonu" },
      ],
      "Şeritte 8 hücre sırayla vurgulanıyor: beş yukarı, üç aşağı. Son adımda 2024'ün 8'e tam bölündüğü gösteriliyor.",
      "Kalan 0 tuzağı: 'kalan yok' diye soruyu yanlış sanma. Kalan 0, r(0) = r(8) demektir; yani dönemin sonuncu terimi. Kalan 1 olsaydı 1., kalan 3 olsaydı 3. terimi alacaktık.",
      "'Dönem 8; 2024 = 8×253; son terim 2.' Cevap: B) 2.",
    ),
  },
  {
    id: "isbo24-05",
    number: "5",
    topic: "Büyük sayılar",
    skill: "Terimleri gruplama",
    image: "assets/isbo/q05.png",
    section: "Sayı ve harf mantığı",
    prompt:
      "1 − 12 + 123 − 1234 + 12345 − 123456 + 1234567 − 12345678 + 123456789 işleminin sonucu hangi sayıdır?",
    options: AE,
    optionNotes: ["111111111", "111222333", "111222345", "112223345", "112233445"],
    answer: "E",
    explanation:
      "Terimleri komşu ikililer halinde grupla: 1−12 = −11, 123−1234 = −1111, 12345−123456 = −111111, 1234567−12345678 = −11111111. Eksilerin toplamı −11223344. Sonuç: 123456789 − 11223344 = 112233445.",
    animation: {
      kind: "table",
      heading: "Gruplama animasyonu: ter çiftleri hesaplanıyor",
      rows: [
        { cells: ["1 − 12", "= −11"] },
        { cells: ["123 − 1234", "= −1111"] },
        { cells: ["12345 − 123456", "= −111111"] },
        { cells: ["1234567 − 12345678", "= −11111111"] },
        { cells: ["Eksiler toplamı", "= −11223344"] },
        { cells: ["+ 123456789", "= 112233445"] },
      ],
    },
    animSteps: [
      { label: "Strateji", note: "9 terim var: soldan itibaren (küçük − büyük) çiftleri + en sondaki tek büyük terim. Gruplama, işlemi 5 basit adıma indirir." },
      { label: "Çift 1", note: "1 − 12 = −11. Küçükten büyüğü çıkar: basamak basamak 1'ler kalır." },
      { label: "Çift 2-4", note: "Aynı kural: 123−1234 = −1111; 12345−123456 = −111111; 1234567−12345678 = −11111111." },
      { label: "Topla", note: "Eksiler: −11 −1111 −111111 −11111111 = −11223344." },
      { label: "Sonuç", note: "123456789 − 11223344 = 112233445." },
    ],
    phases: phases(
      "Dev bir artı-eksi zinciri. Doğrudan soldan toplamak hata üretir; önce yapıya bak: terimler 1, 12, 123, … şeklinde her adımda bir basamak büyüyor.",
      "Verilen: 9 terimli işlem. İstenen: sonuç. Seçenekler 9 basamaklı aday sonuçlardır — görev, doğru gruplamayla sonuca ulaşmak.",
      [
        { label: "Terimler", value: "1, 12, 123, …, 123456789" },
        { label: "Grup", value: "(küçük − büyük) çiftleri" },
        { label: "Kalan", value: "son terim tek kalır" },
      ],
      "Tabloda her çiftin sonucu açılıyor: −11, −1111, −111111, −11111111. Örüntü görünüyor: çiftin sonucu her seferinde iki basamak büyüyor.",
      "9 terimli karışık işaretli toplamalarda gruplama bir stratejidir: (a−b) çiftleri düzenli sonuç üretir. Aynı fikir '1−2+3−4+…' tipi sorularda da çalışır; bu soru onun büyük kuzenidir.",
      "'Çiftleri çıkar, eksileri topla, son terimi ekle: 123456789 − 11223344 = 112233445.' Cevap: E.",
    ),
  },
  {
    id: "isbo24-06",
    number: "6",
    topic: "Takas hamleleri",
    skill: "En az hamle planı",
    image: "assets/isbo/q06.png",
    section: "Takas hamleleri",
    sectionNote:
      "Tahtaya sıralı olarak 1, 5, 3, 2, 7, 6 sayıları yazılmıştır. Ahmet her hamlede iki sayı seçip yerlerini değiştiriyor (meselâ 3 ve 7'yi seçerse 3'ün yerine 7, 7'nin yerine 3 yazar). Amacı, istenen sırayı en az hamlede elde etmektir.",
    prompt:
      "Ahmet, 1, 5, 3, 2, 7, 6 dizisini 1, 2, 3, 5, 6, 7 biçimine; her hamlede istediği İKİ sayıyı takas ederek en az kaç hamlede sokabilir?",
    options: AE,
    optionNotes: ["2", "3", "4", "5", "6"],
    answer: "B",
    explanation:
      "Yerli yerinde olanlar 1 ve 3. Yanlış yerde kalan çiftler: 5↔2 (2. ve 4. sıra) ve 7↔6 (5. ve 6. sıra). Her takas iki sayıyı birden yerine oturttuğu için 2 hamle yeter: (5,2) sonra (7,6). Bir hamlede en fazla 2 sayı düzeleceğinden ve 4 sayı yanlış yerde olduğundan 2 hamleden azı imkânsızdır.",
    animation: {
      kind: "swap",
      heading: "Takas animasyonu: her hamlede iki sayı yerine oturuyor",
      target: ["1", "2", "3", "5", "6", "7"],
    },
    animSteps: [
      { label: "Başlangıç", note: "1, 5, 3, 2, 7, 6. Hedef: 1, 2, 3, 5, 6, 7.", tokens: ["1", "5", "3", "2", "7", "6"], lock: [0, 2] },
      { label: "1. hamle", note: "5 ile 2'yi takas et — ikisi de birden yerine oturur.", tokens: ["1", "2", "3", "5", "7", "6"], hi: [1, 3], lock: [0, 1, 2, 3] },
      { label: "2. hamle", note: "7 ile 6'yı takas et — dizi tamamlanır.", tokens: ["1", "2", "3", "5", "6", "7"], hi: [4, 5], lock: [0, 1, 2, 3, 4, 5] },
      { label: "Alt sınır", note: "4 sayı yanlış yerdeydi; bir hamle en fazla 2 sayı düzeltir. 2 hamleden azı imkânsız → 2 hem yeterli hem en az." },
    ],
    phases: phases(
      "Ortak açıklamayı oku: bir hamle = iki sayının yer değiştirmesi. Burada hamle seçimi serbest — yan yana olma şartı YOK (o şart 7. soruda geliyor).",
      "Hedef diziyi başlangıçla karşılaştır: hangi sayılar zaten doğru yerde? (1 ve 3.) Yanlış yerdekiler kendi hedef yerleriyle eşleşiyor mu? 5'in yeri 2'nin yeri, 7'nin yeri 6'nın yeri.",
      [
        { label: "Doğru yerde", value: "1, 3" },
        { label: "Eş çiftler", value: "5↔2, 7↔6" },
        { label: "İstenen", value: "en az hamle" },
      ],
      "Animasyonda her hamlede seçilen çift vurgulanıyor ve iki sayı aynı anda yeşile boyanıyor: iki hamlede dizi bitiyor.",
      "Genel kural: bir takas en fazla iki sayıyı yerine oturtur. 'Yer değişmiş çift' (2-döngü) varsa tek hamle ikisini çözer. Bu dizide iki eş çift var → 2 hamle. 8. soruda bu şans biter: tek uzun zincir vardır.",
      "'(5,2) ve (7,6) — iki hamle, ikişer sayı.' Cevap: B) 2.",
    ),
  },
  {
    id: "isbo24-07",
    number: "7",
    topic: "Takas hamleleri",
    skill: "Bitişik takas (ters sıra sayma)",
    image: "assets/isbo/q07.png",
    section: "Takas hamleleri",
    sectionNote:
      "Tahtaya sıralı olarak 1, 5, 3, 2, 7, 6 sayıları yazılmıştır. Ahmet her hamlede iki sayı seçip yerlerini değiştiriyor. Amacı, istenen sırayı en az hamlede elde etmektir.",
    prompt:
      "Bu kez Ahmet her hamlede yalnız YAN YANA duran iki sayıyı takas edebiliyor. Diziyi 1, 2, 3, 5, 6, 7 biçimine en az kaç hamlede sokabilir?",
    options: AE,
    optionNotes: ["2", "3", "4", "5", "6"],
    answer: "C",
    explanation:
      "Yan yana takaslarla sıralamak, dizideki ters sıralı (büyük-önde) çift sayısına eşittir. Ters çiftler: (5,3), (5,2), (3,2), (7,6) → 4. Örnek yol: 1,5,3,2,7,6 → 1,3,5,2,7,6 → 1,3,2,5,7,6 → 1,2,3,5,7,6 → 1,2,3,5,6,7.",
    animation: {
      kind: "swap",
      heading: "Balon sıralaması: her hamle komşuları değiştiriyor",
      target: ["1", "2", "3", "5", "6", "7"],
    },
    animSteps: [
      { label: "Başlangıç", note: "1, 5, 3, 2, 7, 6. Yan yana takas kuralı: her hamlede komşu iki sayı yer değiştirir.", tokens: ["1", "5", "3", "2", "7", "6"], lock: [0] },
      { label: "1. hamle", note: "5 ile 3 komşu; 5 > 3 → takas. Bir terslik gider.", tokens: ["1", "3", "5", "2", "7", "6"], hi: [1, 2] },
      { label: "2. hamle", note: "5 ile 2 → takas.", tokens: ["1", "3", "2", "5", "7", "6"], hi: [2, 3] },
      { label: "3. hamle", note: "3 ile 2 → takas.", tokens: ["1", "2", "3", "5", "7", "6"], hi: [1, 2] },
      { label: "4. hamle", note: "7 ile 6 → takas. Dizi sıralandı.", tokens: ["1", "2", "3", "5", "6", "7"], hi: [4, 5], lock: [0, 1, 2, 3, 4, 5] },
      { label: "Alt sınır", note: "Ters sıralı çiftler: (5,3), (5,2), (3,2), (7,6) → 4 tane. Her komşu takası en fazla 1 tersliği azalttığı için 4 hamleden azı imkânsızdır." },
    ],
    phases: phases(
      "Ortak açıklama aynı; yeni kısıt hamlede yalnız YAN YANA iki sayının takas edilebilmesi. Bu tek kısıt, soruyu tamamen değiştirir.",
      "Serbest takas 2 hamle yeterliydi; bitişik takas ise 'terslik' kavramını zorunlu kılar. Terslik: dizide öndeki sayı, arkasındaki sayıdan büyükse bir tersliktir.",
      [
        { label: "Kısıt", value: "yalnız komşu takas" },
        { label: "Terslikler", value: "(5,3),(5,2),(3,2),(7,6)" },
        { label: "Kural", value: "1 hamle ≤ 1 terslik azaltır" },
      ],
      "Animasyon, balon sıralaması gibi komşu çiftleri değiştiriyor; her hamleden sonra dizinin hedefe biraz daha yaklaştığını izle.",
      "Derin fikir: bitişik takas sayısı = terslik sayısı. Çünkü bir komşu takası yalnız o ikilinin sırasını değiştirir; diğer tüm çiftlerin önceliği aynı kalır. Serbest takas ise iki sayıyı bir hamlede çok uzağa taşıyabildiği için çok daha güçlüdür.",
      "'4 terslik → 4 hamle.' Cevap: C) 4.",
    ),
  },
  {
    id: "isbo24-08",
    number: "8",
    topic: "Takas hamleleri",
    skill: "Zincir çözümleme (n−1 hamle)",
    image: "assets/isbo/q08.png",
    section: "Takas hamleleri",
    sectionNote:
      "Tahtaya sıralı olarak 1, 5, 3, 2, 7, 6 sayıları yazılmıştır. Ahmet her hamlede iki sayı seçip yerlerini değiştiriyor. Amacı, istenen sırayı en az hamlede elde etmektir.",
    prompt:
      "Ahmet'ten diziyi 7, 6, 5, 3, 2, 1 biçimine (büyükten küçüğe); her hamlede istediği iki sayıyı takas ederek en az kaç hamlede ulaşılmış isteniyor?",
    options: AE,
    optionNotes: ["4", "5", "6", "7", "8"],
    answer: "B",
    explanation:
      "Hedef dizilimde hiçbir sayı doğru yerde değildir ve sayılar tek bir zincir gibi birbirine bağlıdır: 1→6'nın yerine, 6→5'in yerine, 5→3'ün yerine, 3→2'nin yerine, 2→1'in yerine, 7 hepsini kapatır. Zincir uzunluğu 6 → en az 6−1 = 5 takas. Yol: (1,7), (5,6), (3,5), (2,3), (1,2).",
    animation: {
      kind: "swap",
      heading: "Zincir animasyonu: her takas tam bir sayı yerine oturtuyor",
      target: ["7", "6", "5", "3", "2", "1"],
    },
    animSteps: [
      { label: "Başlangıç", note: "1, 5, 3, 2, 7, 6 → hedef 7, 6, 5, 3, 2, 1. Hiçbir sayı doğru yerde değil.", tokens: ["1", "5", "3", "2", "7", "6"] },
      { label: "1. hamle", note: "Başın istediği 7'yi getir: 1 ↔ 7 takası. 7 yerine oturur.", tokens: ["7", "5", "3", "2", "1", "6"], hi: [0, 4], lock: [0] },
      { label: "2. hamle", note: "6 ↔ 5: 6 yerine oturur.", tokens: ["7", "6", "3", "2", "1", "5"], hi: [1, 5], lock: [0, 1] },
      { label: "3. hamle", note: "3 ↔ 5: 5 yerine oturur.", tokens: ["7", "6", "5", "2", "1", "3"], hi: [2, 5], lock: [0, 1, 2] },
      { label: "4. hamle", note: "2 ↔ 3: 3 yerine oturur.", tokens: ["7", "6", "5", "3", "1", "2"], hi: [3, 5], lock: [0, 1, 2, 3] },
      { label: "5. hamle", note: "1 ↔ 2: son ikisi yerine oturur. 5 hamle!", tokens: ["7", "6", "5", "3", "2", "1"], hi: [4, 5], lock: [0, 1, 2, 3, 4, 5] },
      { label: "Alt sınır", note: "Sayılar tek 6'lı zincirde kilitli. Her takas zincirden en fazla 1 sayı kurtarabilir; 6 sayı için en az 5 takas şart." },
    ],
    phases: phases(
      "Hedef bu kez büyükten küçüğe: 7, 6, 5, 3, 2, 1. Hamle kuralı yine serbest takas (yan yana şartı yok).",
      "6. sorudaki 'eş çift' şansı yok: 1 ile 2'yi takas edemezsin çünkü 1'in yeri en sona, 2'nin yeri 5. sıraya denk gelir — çiftler eşleşmiyor, tek zincir var.",
      [
        { label: "Doğru yerde", value: "hiçbiri" },
        { label: "Yapı", value: "tek 6'lı zincir" },
        { label: "Alt sınır", value: "6 − 1 = 5 hamle" },
      ],
      "Animasyonda her takas tam bir sayıyı yeşile boyuyor: 5 hamlede dizi bitiyor. Zincirin ucu hiç 'bedava' kapanmıyor.",
      "Alt sınırı kurala bağla: hiçbir sayı yerinde değilken, bir takas en fazla iki sayıyı yerine oturtabilir — ama bu ancak 'eş çift' varsa olur. Eş çift yoksa her takas en fazla 1 sayı kurtarır; ilk takastan sonra her hamlede 1 sayı kesin yerine oturur → n−1. Bu, yarışmaların klasik bir alt sınır argümanıdır.",
      "'Zincir 6'lı; 6−1 = 5.' Cevap: B) 5.",
    ),
  },
  {
    id: "isbo24-09",
    number: "9",
    topic: "Eşitsizlik",
    skill: "Eşitsizliği tam sayılarda çözme",
    image: "assets/isbo/q09.png",
    section: "Sayı kuralları",
    prompt:
      "3 katının 5 fazlası, 5 katının 3 fazlasından büyük olan en büyük tam sayı kaçtır?",
    options: AE,
    optionNotes: ["0", "1", "2", "3", "4"],
    answer: "A",
    explanation:
      "Koşul: 3x + 5 > 5x + 3. Her iki taraktan 3x'i at: 5 > 2x + 3 → 2 > 2x → x < 1. Koşulu sağlayan en büyük tam sayı 0'dır (x = 1 için 3·1+5 = 8, 5·1+3 = 8; eşittir, büyük değildir).",
    animation: {
      kind: "table",
      heading: "Eşitsizlik çözümü: adım adım sadeleşme",
      rows: [
        { cells: ["3x + 5 > 5x + 3", "koşul"] },
        { cells: ["5 − 3 > 5x − 3x", "x'ler sağa, sayılar sola"] },
        { cells: ["2 > 2x", "sadeleşti"], state: "hi" },
        { cells: ["x < 1", "her iki taraf 2'ye bölündü"], state: "hi" },
        { cells: ["en büyük tam sayı", "0"], state: "ok" },
      ],
    },
    animSteps: [
      { label: "Koşulu kur", note: "'x'in 3 katının 5 fazlası, 5 katının 3 fazlasından büyük': 3x + 5 > 5x + 3." },
      { label: "Sadeleştir", note: "3x'ler birbirini götürür: 5 > 2x + 3. Sonra 3'ü at: 2 > 2x." },
      { label: "Böl", note: "2 > 2x → x < 1. Dikkat: eşitsizlik yönü değişmedi çünkü pozitif sayıya böldük." },
      { label: "En büyük", note: "x < 1 tam sayıları: …, −2, −1, 0. En büyüğü 0. x = 1 olsaydı 3x+5 = 8 ve 5x+3 = 8 eşit olurdu; 'büyük' koşulu tutmazdı." },
    ],
    phases: phases(
      "Cümleyi simgeye çevir: '3 katının 5 fazlası' = 3x + 5; '5 katının 3 fazlası' = 5x + 3. Büyüklük yönü kritik.",
      "Verilen: 3x + 5 > 5x + 3. İstenen: koşulu sağlayan EN BÜYÜK tam sayı. x büyüdükçe 5x + 3 daha hızlı büyür; bu yüzden koşul yalnız küçük x'lerde doğru kalır — cevap yukarıdan sınırlıdır.",
      [
        { label: "Koşul", value: "3x + 5 > 5x + 3" },
        { label: "Çözüm", value: "x < 1" },
        { label: "İstenen", value: "en büyük tam sayı" },
      ],
      "Tablo, eşitsizliği üç sadeleşme adımıyla çöziyor: terim taşıma, toplama, bölme. Son satırda aday tam sayılar listelenip en büyüğü seçiliyor.",
      "Tuzak: x = 1'i almak. 3·1+5 = 8 ile 5·1+3 = 8 EŞİTTİR; koşul 'büyük' istediği için 1 elenir. Sınır değerleri her zaman yerine koyarak sına — bu alışkanlık tüm eşitsizlik sorularında işini görür.",
      "'x < 1; en büyük tam sayı 0.' Cevap: A) 0.",
    ),
  },
  {
    id: "isbo24-10",
    number: "10",
    topic: "Sayma",
    skill: "Sıralı dizilişte konum hesabı",
    image: "assets/isbo/q10.png",
    section: "Sayı kuralları",
    prompt:
      "Bir grup öğrenci art arda sıralanmıştır. Önünde 5 kişi olanın arkasındaki öğrenci sayısı, arkasında 7 kişi olanın önündeki öğrenci sayısından kaç fazladır?",
    options: AE,
    optionNotes: ["35", "12", "10", "2", "0"],
    answer: "D",
    explanation:
      "Somut örnekle: N = 12 kişi olsun. Önünde 5 kişi olan 6. sırada → arkasında 12 − 6 = 6 kişi. Arkasında 7 kişi olan, sondan 8. sırada → önünde 12 − 8 = 4 kişi. Fark 6 − 4 = 2. Genel: (N−6) − (N−8) = 2; N'e bağlı değil.",
    animation: {
      kind: "table",
      heading: "Kuyruk animasyonu: N = 12 için iki öğrencinin konumu",
      rows: [
        { cells: ["Toplam", "N = 12 kişi"] },
        { cells: ["Önünde 5 olan", "6. sırada → arkasında 6 kişi"] },
        { cells: ["Arkasında 7 olan", "önünde 4 kişi"], state: "hi" },
        { cells: ["Fark", "6 − 4 = 2"], state: "ok" },
      ],
    },
    animSteps: [
      { label: "Somutlaştır", note: "N'i seç: 12 kişi. 'Önünde 5 kişi olan' → 6. sıradadır; arkasında 12 − 6 = 6 kişi kalır." },
      { label: "İkinci kişi", note: "'Arkasında 7 kişi olan' → önünde N − 7 − 1 = 4 kişi vardır." },
      { label: "Çıkar", note: "6 − 4 = 2. Bu fark, toplam kişi sayısına bağlı değildir: (N − 6) − (N − 8) = 2." },
    ],
    phases: phases(
      "İki öğrenci tanımlanıyor: biri önünde 5, diğeri arkasında 7 kişi. Sorulan şey aralarındaki 'arkasındakiler − önündekiler' farkı.",
      "Soyut N yerine somut bir sayı seç: N = 12. Konumları yaz: 'önünde 5 olan' 6. sıra; 'arkasında 7 olan' ise sondan 8., yani baştan N − 7 = 5. sıra.",
      [
        { label: "Model", value: "N = 12" },
        { label: "Kişi 1", value: "6. sırada, arkasında 6" },
        { label: "Kişi 2", value: "önünde 4" },
      ],
      "Tablo, iki öğrencinin konumunu ve kalan kişi sayılarını adım adım gösteriyor; son satırda fark çıkıyor.",
      "Genel yazım farkı sabit verir: (N − 6) − (N − 8) = 2. N'in büyüklüğü sonucu değiştirmez — '35' ve '12' gibi seçenekler N'i yanlış kullanmayı düşünenlere hazırlanmıştır.",
      "'6 − 4 = 2; N'den bağımsız.' Cevap: D) 2.",
    ),
  },
  {
    id: "isbo24-11",
    number: "11",
    topic: "Çarpımlar",
    skill: "Basamaklı (teleskop) sadeleşme",
    image: "assets/isbo/q11.png",
    section: "Sayı kuralları",
    prompt:
      "(1 + 1/2)(1 + 1/3)(1 + 1/4) ⋯ (1 + 1/2023)(1 + 1/2024) çarpımı sadeleşmeyen m/n kesri ise m + n sayısının rakamları toplamı kaçtır?",
    options: AE,
    optionNotes: ["7", "8", "9", "10", "11"],
    answer: "E",
    explanation:
      "Her çarpan (k+1)/k biçimindedir: 3/2 · 4/3 · 5/4 ⋯ 2025/2024. Paylardaki sayılar bir sonraki çarpanın paydasıyla sadeleşir → sonuç 2025/2. m + n = 2027 → 2 + 0 + 2 + 7 = 11.",
    animation: {
      kind: "table",
      heading: "Teleskop animasyonu: her adımda bir çift sadeleşiyor",
      rows: [
        { cells: ["1 + 1/2", "= 3/2"] },
        { cells: ["1 + 1/3", "= 4/3"], state: "hi" },
        { cells: ["3/2 · 4/3", "= 4/2 (3'ler sadeleşti)"], state: "ok" },
        { cells: ["⋯ 2025/2024", "aynı kural"], state: "hi" },
        { cells: ["Sonuç", "= 2025/2"], state: "ok" },
        { cells: ["m + n = 2027", "rakamlar toplamı 11"], state: "ok" },
      ],
    },
    animSteps: [
      { label: "Çarpanları yaz", note: "Her parantez: 1 + 1/k = (k+1)/k. İlk çarpan 3/2, son çarpan 2025/2024." },
      { label: "İlk sadeleşme", note: "3/2 · 4/3 = 4/2. Paydaki 3, paydadaki 3 ile gitti." },
      { label: "Zincir", note: "Aynı kural zincir boyunca: kalan pay bir sonraki paydayı siliyor. Ortada 2'den 2024'e paydaların hepsi gider." },
      { label: "Sonuç", note: "m = 2025, n = 2 (sadeleşmez: 2025 tek sayı). m + n = 2027." },
      { label: "Rakam toplamı", note: "2 + 0 + 2 + 7 = 11." },
    ],
    phases: phases(
      "Üç nokta (⋯) işaretini doğru oku: çarpım 1+1/2'den başlayıp 1+1/2024'e kadar bütün parantezleri içerir.",
      "Her çarpanı (k+1)/k olarak yaz. Soru üç istekte bulunuyor: çarpımı hesapla → m/n biçimine getir → m+n'nin rakamlarını topla.",
      [
        { label: "Çarpan", value: "1 + 1/k = (k+1)/k" },
        { label: "Kapsam", value: "k = 2 … 2024" },
        { label: "İstenen", value: "(m+n) rakamları toplamı" },
      ],
      "Tablo, teleskop sadeleşmesini gösteriyor: her adımda pay ile bir sonraki paydaya çarpıyor; zincirin ucunda yalnız 2025 ve 2 kalıyor.",
      "'Teleskop' fikri: ardışık kesirlerin çarpımında ara değerler birbirini siler. Aynı yapı toplamda da çalışır (1/1·2 + 1/2·3 + … = 1 − 1/n). m/n'in SADELEŞMEYEN halini istemesi, m ve n'i kesin belirler: 2025 ve 2.",
      "'2025/2; 2027'nin rakamları 2+0+2+7 = 11.' Cevap: E) 11.",
    ),
  },
  {
    id: "isbo24-12",
    number: "12",
    topic: "Bölme ve kalan",
    skill: "Kalanlı sayı kümeleri",
    image: "assets/isbo/q12.png",
    section: "Sayı kuralları",
    prompt:
      "7 ile bölündüğünde 6 kalanını veren en küçük 5 doğal sayının toplamı, 4 ile bölündüğünde 3 kalanını veren en küçük 2 doğal sayının toplamının kaç katıdır?",
    options: AE,
    optionNotes: ["4", "7", "10", "12", "15"],
    answer: "C",
    explanation:
      "7'ye bölününce 6 kalanı verenler: 6, 13, 20, 27, 34 → toplam 100. 4'e bölününce 3 kalanı verenler: 3, 7 → toplam 10. 100 = 10 × 10.",
    animation: {
      kind: "sequence",
      heading: "Sayı şeridi: kalan 6 kümesi ve kalan 3 kümesi",
      cells: ["6", "13", "20", "27", "34", "|", "3", "7"],
    },
    animSteps: [
      { label: "Küme 1", note: "7'ye bölününce 6 kalanı veren en küçük doğal sayı 6. Sonrakiler her seferinde +7: 13, 20, 27, 34.", active: [0, 1, 2, 3, 4] },
      { label: "Topla", note: "6 + 13 + 20 + 27 + 34 = 100.", active: [0, 1, 2, 3, 4] },
      { label: "Küme 2", note: "4'e bölününce 3 kalanı veren en küçük iki sayı: 3 ve 7. Toplam 10.", active: [6, 7] },
      { label: "Oran", note: "100 ÷ 10 = 10 kat.", active: [0, 1, 2, 3, 4, 6, 7] },
    ],
    phases: phases(
      "'Kalanı veren sayılar' ifadesi bir sayı kümesi tanımlar: belirli bir sayıdan başlayıp modül kadar artan diziler.",
      "Küme 1: kalan 6, modül 7 → 6, 13, 20, 27, 34. Küme 2: kalan 3, modül 4 → 3, 7. İstenen: iki toplamın oranı.",
      [
        { label: "Küme 1", value: "6, 13, 20, 27, 34" },
        { label: "Küme 2", value: "3, 7" },
        { label: "İstenen", value: "toplam oranı" },
      ],
      "Şeritte ilk küme vurgulanıp toplanıyor; sonra ikinci küme. Son adımda 100/10 oranı hesaplanıyor.",
      "Küçük sayıların hepsini yazmak yerine farkı da kullanabilirsin: kalanlar aynı ise toplamların farkı modülün katıdır. Ama burada 5 + 2 sayı zaten az; yazmak en hızlısı. Doğal sayı 0'ı unutma: 0 ne 6 kalanını ne 3 kalanını verir.",
      "'100 ve 10 → 10 kat.' Cevap: C) 10.",
    ),
  },
  {
    id: "isbo24-13",
    number: "13",
    topic: "Taban sistemleri",
    skill: "n=2 toplama",
    image: "assets/isbo/q13.png",
    section: "Taban sistemleri",
    sectionNote:
      "İsmail sayıları göstermek için on tane 0–9 sembolü yerine n tane sembol (0, 1, …, n−1) kullanmak istiyor; işlemler de bu sistemde yapılıyor. Örneğin n = 5 için 3 + 4 = 12 ve 13 · 3 = 44 olacaktır. Sıralama: 0, 1, 2, 3, 4, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 30, …",
    prompt:
      "n = 2 ise 101 + 101 kaçtır?",
    options: AE,
    optionNotes: ["1000", "1010", "1100", "10010", "10100"],
    answer: "B",
    explanation:
      "n = 2 ikilik (binary) sistemdir. 101₂ = 5. 5 + 5 = 10 → 10 sayısının ikilik yazılışı 1010'dur. Ya da basamak basamak: sağdan 1+1 = 10 (0 yaz, 1 taşı) → sonuç 1010.",
    animation: {
      kind: "trace",
      heading: "İkilik toplama: sağdan sola taşıma",
      codeLines: ["    1 0 1", "+   1 0 1", "─────────"],
    },
    animSteps: [
      { label: "Sistemi tanı", note: "n = 2 → semboller 0 ve 1. '10' bu sistemde iki demektir.", line: 0 },
      { label: "Sağ sütun", note: "1 + 1 = 2 → 0 yaz, 1 taşı.", line: 1 },
      { label: "Orta sütun", note: "0 + 0 + taş(1) = 1 → 1 yaz.", line: 1 },
      { label: "Sol sütun", note: "1 + 1 = 2 → 0 yaz, 1 taşı.", line: 1 },
      { label: "Sonuç", note: "Taşma en sola 1 ekler: 1010. Onluk kontrol: 5 + 5 = 10 = 1010₂ ✓", line: 2 },
    ],
    phases: phases(
      "Ortak açıklama bir 'n tabanlı sayı sistemi' tanımlıyor. n = 2 için bu, bildiğin ikilik sistemdir; semboller 0 ve 1.",
      "İki yol var: (a) 101₂'yi onluğa çevir (5), onluk topla (10), tekrar ikiliğe yaz (1010). (b) Doğrudan ikilikte sütun sütun topla. İkisi de aynı yere çıkar — biriyle çözüp diğeriyle kontrol en güvenlisi.",
      [
        { label: "Taban", value: "n = 2 (ikilik)" },
        { label: "101₂", value: "= 5" },
        { label: "İşlem", value: "5 + 5" },
      ],
      "Animasyon, ikilik toplamayı sağdan sola gösteriyor: her 2'de bir taşıma var. Onluk sistemdeki '10'da bir taşı' kuralının ikilikteki hali '2'de bir taşı'.",
      "Seçeneklerdeki 1100 (= 12), 10010 (= 18) ve 10100 (= 20) yanlış onluk-ikilik karışımlarıdır. 1010'ı onluğa çevirip doğrula: 8 + 2 = 10 ✓.",
      "'5 + 5 = 10 = 1010₂.' Cevap: B) 1010.",
    ),
  },
  {
    id: "isbo24-14",
    number: "14",
    topic: "Taban sistemleri",
    skill: "n=7 işlem zinciri",
    image: "assets/isbo/q14.png",
    section: "Taban sistemleri",
    sectionNote:
      "İsmail sayıları göstermek için n tane sembol kullanıyor; işlemler de bu sistemde yapılıyor. Örneğin n = 5 için 3 + 4 = 12 ve 13 · 3 = 44.",
    prompt:
      "n = 7 ise (6 + 1)(66 + 1) + 1 kaçtır?",
    options: AE,
    optionNotes: ["1001", "1011", "1101", "10011", "10101"],
    answer: "A",
    explanation:
      "7 tabanında 6 + 1 = 10 (çünkü 7, bir üst basamağa taşar). 66₇ + 1 = 100₇. 10₇ · 100₇ = 1000₇. 1000₇ + 1 = 1001₇. Onluk kontrol: (7)(49) + 1 = 344; 1001₇ = 343 + 1 = 344 ✓.",
    animation: {
      kind: "table",
      heading: "Adım adım 7 tabanında hesap",
      rows: [
        { cells: ["6 + 1", "= 10₇ (7 taşındı)"] },
        { cells: ["66₇ + 1", "= 100₇ (yine taşıma)"] , state: "hi" },
        { cells: ["10₇ · 100₇", "= 1000₇"], state: "hi" },
        { cells: ["1000₇ + 1", "= 1001₇"], state: "ok" },
      ],
    },
    animSteps: [
      { label: "İlk parantez", note: "6 + 1 = 7 → 7 tabanında yazılamaz: 10₇. Tıpkı onlukta 9 + 1 = 10 gibi." },
      { label: "İkinci parantez", note: "66₇ + 1: birler basamağı 6 + 1 = 7 → 0 yaz, 1 taşı; altılar da zincirlenir → 100₇." },
      { label: "Çarpım", note: "10₇ · 100₇ = 1000₇: sıfırları say (2 sıfır) → 1 arkasına 3 sıfır. Onlukla aynı kural." },
      { label: "Ekle", note: "1000₇ + 1 = 1001₇. Onluk kontrol: 7³ + 1 = 344 ✓" },
    ],
    phases: phases(
      "Soruda geçen bütün sayılar 7 tabanında! '6', '66', '1' sembolleri taban içinde geçerli; işlem sonucu da 7 tabanında isteniyor.",
      "İşlemi parçalara ayır: iki parantez, bir çarpım, bir toplama. Her parçayı 7 tabanında yap; taşıma kuralı '7'de bir üst basamağa geç'.",
      [
        { label: "Taban", value: "n = 7" },
        { label: "İşlem", value: "(6+1)(66₇+1)+1" },
        { label: "Kontrol", value: "onlukta 7 · 49 + 1" },
      ],
      "Tablo dört adımı sırayla açıyor: her satırda bir taşıma ya da çarpım kuralı işliyor.",
      "Onluk kontrol alışkanlığı: 6+1 = 7, 66₇ = 48, (7)(49)+1 = 344, ve 1001₇ = 1·343 + 1 = 344. İki hesap aynı yere varıyor — taban sorularında bu çifte kontrol yarışmanın en güvenli silahıdır.",
      "'10₇ · 100₇ + 1 = 1001₇.' Cevap: A) 1001.",
    ),
  },
  {
    id: "isbo24-15",
    number: "15",
    topic: "Taban sistemleri",
    skill: "Kimlik denklemi ve rakam koşulu",
    image: "assets/isbo/q15.png",
    section: "Taban sistemleri",
    sectionNote:
      "İsmail sayıları göstermek için n tane sembol kullanıyor; işlemler de bu sistemde yapılıyor. Örneğin n = 5 için 3 + 4 = 12 ve 13 · 3 = 44.",
    prompt:
      "20 · 24 = 480 işlemi bu sistemde doğruysa n sayısı 9, 10, 11, 12, 13 değerlerinden kaç tanesini alabilir?",
    options: AE,
    optionNotes: ["1", "2", "3", "4", "5"],
    answer: "E",
    explanation:
      "20ₙ = 2n, 24ₙ = 2n + 4, 480ₙ = 4n² + 8n. Sol taraf: 2n(2n + 4) = 4n² + 8n. İki taraf da 4n² + 8n → eşitlik HER n için doğru. Tek koşul: 480 rakamı için n > 8 olmalı; 9, 10, 11, 12, 13'ün hepsi sağlar → 5 değer.",
    animation: {
      kind: "table",
      heading: "Kimlik animasyonu: iki taraf da aynı ifadeye sadeleşiyor",
      rows: [
        { cells: ["20ₙ", "= 2n"], },
        { cells: ["24ₙ", "= 2n + 4"], state: "hi" },
        { cells: ["20ₙ · 24ₙ", "= 2n(2n+4) = 4n² + 8n"], state: "hi" },
        { cells: ["480ₙ", "= 4n² + 8n + 0"], state: "hi" },
        { cells: ["Karşılaştır", "her n için eşit → kimlik"], state: "ok" },
        { cells: ["Koşul", "n > 8 → 9…13 → 5 değer"], state: "ok" },
      ],
    },
    animSteps: [
      { label: "Tabana çevir", note: "20ₙ = 2n; 24ₙ = 2n + 4; 480ₙ = 4n² + 8n + 0." },
      { label: "Çarp", note: "Sol: 2n · (2n + 4) = 4n² + 8n." },
      { label: "Eşitle", note: "Sağ taraf da 4n² + 8n + 0. İki ifade birebir aynı → eşitlik n'den bağımsız." },
      { label: "Koşul", note: "Tek sınır rakamlar: 480 içinde 8 var → n ≥ 9. Verilen 9, 10, 11, 12, 13 → beşi de geçerli." },
    ],
    phases: phases(
      "'20 · 24 = 480 doğruysa' diyor — yani eşitliği sağlayan taban(lar)ı arıyoruz. Soru, taban kurallarını ne kadar içselleştirdiğini ölçüyor.",
      "Her sayıyı n cinsinden yaz: 20ₙ, 24ₙ, 480ₙ. Sonra iki tarafı karşılaştır — cebirsel sadeleşmeye hazır ol.",
      [
        { label: "Sol", value: "2n(2n+4)" },
        { label: "Sağ", value: "4n² + 8n" },
        { label: "İstenen", value: "geçerli n sayısı" },
      ],
      "Tabloda iki tarafın ifadeleri adım adım kuruluyor ve birebir örtüşüyor: eşitlik bir kimlik (her n için doğru).",
      "Sınav tuzağı: 2n(2n+4) = 480 sanıp ikinci derece denklem çözmeye kalkmak (n = 10 bulursun, '1 değer' dersin). Ama 480 de tabanda yazılmış: 4n² + 8n. Farkı gören öğrenci 'kimlik' der ve geçer. Rakam koşulu (n > 8) unutulmazsa aralık dışı tabanlar da sayılır — seçenekler bu hatayı ödüllendirmiyor.",
      "'Kimlik: her n doğru; koşul n > 8 → 5 değer.' Cevap: E) 5.",
    ),
  },
];

const BILGELER_NOTE =
  "Zamanın Bilgeleri: Bir zaman makinesi dört bilgiyi bir araya getirir — Murat, Süleyman, Selahattin ve Harun. Her biri farklı bir roldür: hekim, matematikçi, filozof, astronom (her rolden bir kişi). İpuçları: (1) Murat ve Harun, 'Bilginin Çarkı' adlı astronomik cihazı kullanabilir. (2) Sadece hekim ve matematikçi cihazı kullanabilir. (3) Murat, Harun'dan yaşça büyüktür; Süleyman, Selahattin'den yaşça büyüktür. (4) Murat, Selahattin ile rasathanede satranç oynadı. (5) Hekim ve matematikçi gün boyunca yalnızca bir kez, 'Bilimlerin Bahçesi' kütüphanesinde buluştu. (6) Matematikçi ve filozof, astronomdan yaşça büyüktür. (7) Hekim gün boyunca yalnızca kütüphanede vakit geçirdi ve orada sadece matematikçi ile karşılaştı.";

const BILGELER_SECTION = "Zamanın Bilgeleri";

export const ISBO_EXAM_QUESTIONS_2: IsboQuestion[] = [
  {
    id: "isbo24-19",
    number: "19",
    topic: "Graf",
    skill: "En kısa yol",
    image: "assets/isbo/q19.png",
    section: "Graf: şehir yolları",
    sectionNote:
      "Diyagram bir graf: A, B, C, D, E şehirleri; kenarlardaki sayılar kilometre. Bazı şehirler arasında doğrudan yol yok; A'dan E'ye başka şehirlerden uğrayarak gidilir. Kenarlar: C–A 3, A–B 6, C–B 2, C–D 3, C–E 4, D–E 2, D–B 5.",
    prompt:
      "A şehrinden E şehrine, bir şehirden en fazla bir kez geçerek, en az kaç kilometre yol katedilir?",
    options: AE,
    optionNotes: ["7", "8", "10", "13", "Hiçbiri"],
    answer: "A",
    explanation:
      "Doğrudan yollar: A–C = 3, C–E = 4 → A–C–E = 7 km. Daha uzun adaylar: A–C–D–E = 8, A–B–D–E = 13, A–C–B–D–E = 12. En kısa: 7.",
    animation: {
      kind: "graph",
      heading: "Şebeke animasyonu: aday rotalar karşılaştırılıyor",
      graph: {
        nodes: [
          { id: "A", x: 190, y: 30 },
          { id: "C", x: 118, y: 62 },
          { id: "B", x: 185, y: 165 },
          { id: "D", x: 95, y: 175 },
          { id: "E", x: 25, y: 140 },
        ],
        edges: [
          { a: "C", b: "A", w: 3 },
          { a: "A", b: "B", w: 6 },
          { a: "C", b: "B", w: 2 },
          { a: "C", b: "D", w: 3 },
          { a: "C", b: "E", w: 4 },
          { a: "D", b: "E", w: 2 },
          { a: "D", b: "B", w: 5 },
        ],
      },
    },
    animSteps: [
      { label: "Şebeke", note: "Beş şehir, yedi yol. Hedef: A → E. Önce E'ye DOĞRUDAN bağlanan yollara bak: C–E (4) ve D–E (2).", pathNodes: ["A", "C", "E"], pathEdges: [] },
      { label: "A–C–E", note: "A'dan C'ye 3, C'den E'ye 4 → toplam 7 km.", pathNodes: ["A", "C", "E"], pathEdges: [0, 4], total: "7 km" },
      { label: "Alternatifler", note: "A–C–D–E = 3+3+2 = 8; A–B–D–E = 6+5+2 = 13; A–C–B–D–E = 12. Hizs 7'nin altına inen yok.", pathNodes: ["A", "C", "E"], pathEdges: [0, 4], total: "7 km" },
    ],
    phases: phases(
      "Soru 'bir şehirden en fazla bir kez geçerek' diyor: rota bir DAĞA değil, tekrarsız bir yola bakar. En AZ kilometre isteniyor.",
      "E'ye bağlanan kenarları bul (C–E, D–E). Sonra A'dan bu aracılara en ucuz varış: A–C = 3, A–B = 6, A–D? doğrudan yok.",
      [
        { label: "Hedef", value: "A → E" },
        { label: "E bağlantıları", value: "C–E = 4, D–E = 2" },
        { label: "A bağlantıları", value: "C = 3, B = 6" },
      ],
      "Şebekede aday rotalar sırayla vurgulanıyor ve toplamları karşılaştırılıyor.",
      "Genelcilik: 5 şehirde tüm yolları sıralamak mümkün; bu yüzden 'tarama + karşılaştırma' yeterli. Dikkat: en kısa rota her zaman en az şehirden geçmez — ama burada 7 km'lik A–C–E açık ara önde.",
      "'3 + 4 = 7.' Cevap: A) 7.",
    ),
  },
  {
    id: "isbo24-20",
    number: "20",
    topic: "Graf",
    skill: "En uzun basit yol",
    image: "assets/isbo/q20.png",
    section: "Graf: şehir yolları",
    sectionNote:
      "Diyagram bir graf: A, B, C, D, E şehirleri; kenarlar: C–A 3, A–B 6, C–B 2, C–D 3, C–E 4, D–E 2, D–B 5.",
    prompt:
      "A şehrinden E şehrine, bir şehirden en fazla bir kez geçerek, en çok kaç kilometre yol katedilir?",
    options: AE,
    optionNotes: ["15", "16", "17", "18", "19"],
    answer: "D",
    explanation:
      "En uzun tekrarsız rota: A–B (6), B–D (5), D–C (3), C–E (4) → 18 km. Bu rota dört şehirden geçer; A–C–B–D–E (12) ve A–B–D–E (13) gibi adayların hepsi kısadır.",
    animation: {
      kind: "graph",
      heading: "Şebeke animasyonu: en uzun rota kenar kenar kuruluyor",
      graph: {
        nodes: [
          { id: "A", x: 190, y: 30 },
          { id: "C", x: 118, y: 62 },
          { id: "B", x: 185, y: 165 },
          { id: "D", x: 95, y: 175 },
          { id: "E", x: 25, y: 140 },
        ],
        edges: [
          { a: "C", b: "A", w: 3 },
          { a: "A", b: "B", w: 6 },
          { a: "C", b: "B", w: 2 },
          { a: "C", b: "D", w: 3 },
          { a: "C", b: "E", w: 4 },
          { a: "D", b: "E", w: 2 },
          { a: "D", b: "B", w: 5 },
        ],
      },
    },
    animSteps: [
      { label: "Strateji", note: "En uzun rota, mümkün olduğun ÇOK ve AĞIR kenar kullanmalı. A'dan çıkan iki yol: A–C (3) ve A–B (6). 6'lık kenarla başlamak umut verici.", pathNodes: ["A", "B"], pathEdges: [] },
      { label: "A–B", note: "A–B = 6 ile başla. B'den nereye? A gidildi; kalanlar C (2) ve D (5).", pathNodes: ["A", "B"], pathEdges: [1], total: "6" },
      { label: "B–D", note: "Ağır kenarı seç: B–D = 5. Toplam 11.", pathNodes: ["A", "B", "D"], pathEdges: [1, 6], total: "11" },
      { label: "D–C", note: "D'den C'ye 3 (E'ye gidersek rota biter: 6+5+2 = 13 — kısa kalır). Toplam 14.", pathNodes: ["A", "B", "D", "C"], pathEdges: [1, 6, 3], total: "14" },
      { label: "C–E", note: "C–E = 4 → toplam 18. Dört kenar, beş şehir — daha uzun rota yok.", pathNodes: ["A", "B", "D", "C", "E"], pathEdges: [1, 6, 3, 4], total: "18 km" },
    ],
    phases: phases(
      "Bu kez en UZUN yol isteniyor; tekrar kısıtı aynı. Seçenekler 15-19 aralığında — üst sınıra yaklaşıp kalmak gerekiyor.",
      "En uzun rota, mümkün olan en çok kenarı kullanır: 5 şehir varsa en fazla 4 kenar. A'dan E'ye 4 kenarlı yolları araştır: A–B–D–C–E ve A–C–D–B–? (B'den çıkış kalmaz).",
      [
        { label: "Üst sınır", value: "5 şehir → 4 kenar" },
        { label: "4 kenarlı aday", value: "A–B–D–C–E" },
        { label: "İstenen", value: "en çok km" },
      ],
      "Animasyon rotayı ağır kenarlardan kuruyor: 6 → +5 → +3 → +4 = 18. Her adımda toplam görünüyor.",
      "Karşılaştır: A–C–B–D–E = 3+2+5+2 = 12; A–B–D–C–E = 18. Fark, C'den mi B'den mi başlayacağın sıralamada: ağır kenarları (6, 5) rotanın omurgasına yerleştirmek gerekir. 'En uzun' sorularında kaba tarama + iyi sıralama birleşir.",
      "'6 + 5 + 3 + 4 = 18.' Cevap: D) 18.",
    ),
  },
  {
    id: "isbo24-16",
    number: "16",
    topic: "Mantık bulmacası",
    skill: "Yaş karşılaştırması",
    image: "assets/isbo/q16.png",
    section: BILGELER_SECTION,
    sectionNote: BILGELER_NOTE,
    prompt: "Yaşça en büyük olan kimdir?",
    options: AE,
    optionNotes: ["Murat", "Süleyman", "Selahattin", "Harun", "Veriler yetersiz"],
    answer: "E",
    explanation:
      "Cihaz ipuçlarından {Murat, Harun} = {hekim, matematikçi}; {Süleyman, Selahattin} = {filozof, astronom}. Hekim gün boyunca kütüphanede kaldığından rasathanede satranç oynayan Murat hekim olamaz → Murat = matematikçi. Bilinen yaşlar: Murat > Harun; Murat (= matematikçi) > Selahattin (= astronom); Süleyman (= filozof) > Selahattin. Murat ile Süleyman'ı karşılaştıran hiçbir veri yok → en büyük belirlenemez.",
    animation: {
      kind: "table",
      heading: "Eliminasyon tablosu: roller ve yaş zinciri",
      rows: [
        { cells: ["Cihaz yetkisi", "Murat, Harun = hekim/matematikçi"] },
        { cells: ["Kalan roller", "Süleyman, Selahattin = filozof/astronom"], state: "hi" },
        { cells: ["Hekim kütüphanede", "Murat rasathanede → Murat = matematikçi"], state: "hi" },
        { cells: ["Yaş zinciri", "Murat > Harun · Murat > Selahattin · Süleyman > Selahattin"], state: "hi" },
        { cells: ["Murat ↔ Süleyman", "karşılaştırma YOK → yetersiz"], state: "no" },
      ],
    },
    animSteps: [
      { label: "Cihaz kesişimi", note: "Cihazı kullanabilenler: {Murat, Harun} ve {hekim, matematikçi}. Kesişim: bu ikisi hekim/matematikçidir; Süleyman ile Selahattin filozof/astronomdur." },
      { label: "Murat filtrelenir", note: "Hekim gün boyunca kütüphanedeydi; Murat rasathanede satranç oynadı → Murat hekim olamaz → Murat = matematikçi, Harun = hekim." },
      { label: "Yaş zincirleri", note: "Kesin bilgiler: Murat > Harun. Murat (matematikçi) > Selahattin (astronom). Süleyman (filozof) > Selahattin." },
      { label: "Karşılaştır", note: "Murat mı büyük Süleyman mı? İkisini bağlayan tek bir ipucu bile yok → 'Veriler yetersiz'." },
    ],
    phases: phases(
      "Sekiz ipucu var; hepsini tek tek oku. Bu üçlü soruda (16-17-18) aynı bulmaca kullanılır; bir kez çöz, üçünü kazan.",
      "Rolleri tabloya diz: 4 kişi, 4 meslek. İpucu (1)+(2) ilk büyük ayrımı verir. Sonra konum ipuçları (4) ve (7) ile bireysel roller belirlenir.",
      [
        { label: "Grup 1", value: "Murat, Harun → hekim/matematikçi" },
        { label: "Grup 2", value: "Süleyman, Selahattin → filozof/astronom" },
        { label: "Konum", value: "Murat rasathanede; hekim kütüphanede" },
      ],
      "Tablo, akıl yürütmeyi satır satır gösteriyor: önce gruplar, sonra Murat'ın rolü, sonra yaş zincirleri. Son satır eksik bağlantıyı işaretliyor.",
      "En büyük için Murat > Harun, Murat > Selahattin ve Süleyman > Selahattin biliyoruz. Ama Murat mı Süleyman mı? Hiçbir ipucu bunları kıyaslamıyor. Doğru cevap 'tahmin' değil 'kanıt eksikliği' demektir: E.",
      "'Murat ile Süleyman karşılaştırılmamış → yetersiz.' Cevap: E) Veriler yetersiz.",
    ),
  },
  {
    id: "isbo24-17",
    number: "17",
    topic: "Mantık bulmacası",
    skill: "Çelişkiyle eleme",
    image: "assets/isbo/q17.png",
    section: BILGELER_SECTION,
    sectionNote: BILGELER_NOTE,
    prompt: "Astronom kimdir?",
    options: AE,
    optionNotes: ["Murat", "Süleyman", "Harun", "Selahattin", "Veriler yetersiz"],
    answer: "D",
    explanation:
      "Astronom, Süleyman veya Selahattin'dir (Murat ve Harun hekim/matematikçi). Süleyman astronom olsaydı filozof Selahattin olurdu; ipucu 'filozof astronomdan büyüktür' → Selahattin > Süleyman. Ama veriler Süleyman > Selahattin diyor → çelişki. Demek astronom = Selahattin.",
    animation: {
      kind: "table",
      heading: "Varsayım-çelişki animasyonu",
      rows: [
        { cells: ["Adaylar", "Süleyman veya Selahattin"] },
        { cells: ["Varsayım", "astronom = Süleyman"], state: "hi" },
        { cells: ["Sonuç", "filozof = Selahattin > Süleyman"], state: "no" },
        { cells: ["Veriler", "Süleyman > Selahattin → ÇELİŞKİ"], state: "no" },
        { cells: ["Kalan", "astronom = Selahattin ✓"], state: "ok" },
      ],
    },
    animSteps: [
      { label: "Adayları daralt", note: "Cihaz ipuçları: Murat ve Harun hekim/matematikçi → astronom onlardan biri olamaz." },
      { label: "Varsayım 1", note: "Astronom = Süleyman dene. O zaman filozof = Selahattin." },
      { label: "Çelişki", note: "İpucu: filozof astronomdan büyük → Selahattin > Süleyman. Veri: Süleyman > Selahattin. İkisi aynı anda doğru olamaz." },
      { label: "Sonuç", note: "Varsayım çöktü → astronom = Selahattin (ve filozof = Süleyman)." },
    ],
    phases: phases(
      "Aynı bulmaca, yeni hedef: astronomu kesinleştir. 16. sorudaki grup ayrımı hâlâ geçerli.",
      "Astronom ikinci grupta (Süleyman/Selahattin). İpucu (6) 'matematikçi ve filozof, astronomdan yaşça büyüktür' ile grup içi yaş bilgisi (3) birleştirilecek.",
      [
        { label: "Grup 2", value: "Süleyman, Selahattin" },
        { label: "İpucu", value: "filozof > astronom" },
        { label: "Veri", value: "Süleyman > Selahattin" },
      ],
      "Tablo bir varsayımı kuruyor, sonuçlarını çekiyor ve çelişkiyi kırmızıyla gösteriyor; kalan tek seçenek yeşile boyanıyor.",
      "Bu, 'varsay ve yık' (proof by contradiction) yönteminin mini hâli. İki adaydan biri çelişki üretiyorsa diğeri kesindir — 'veriler yetersiz' burada DEĞİL, çünkü elimizde kesin belirleme gücü var.",
      "'Süleyman astronomsa çelişki → astronom Selahattin.' Cevap: D) Selahattin.",
    ),
  },
  {
    id: "isbo24-18",
    number: "18",
    topic: "Mantık bulmacası",
    skill: "Rol eşleştirme",
    image: "assets/isbo/q18.png",
    section: BILGELER_SECTION,
    sectionNote: BILGELER_NOTE,
    prompt: "Süleyman'ın mesleği nedir?",
    options: AE,
    optionNotes: ["Matematikçi", "Astronom", "Filozof", "Hekim", "Veriler yetersiz"],
    answer: "C",
    explanation:
      "17. soruda astronom = Selahattin kesinleşti. Süleyman ile Selahattin filozof/astronom çiftinde olduğundan Süleyman'ın rolü kalan roldür: filozof.",
    animation: {
      kind: "table",
      heading: "Kalan rolü kapat",
      rows: [
        { cells: ["17. sonuç", "astronom = Selahattin"], state: "hi" },
        { cells: ["Grup 2", "Süleyman, Selahattin → filozof/astronom"], state: "hi" },
        { cells: ["Süleyman", "= filozof ✓"], state: "ok" },
      ],
    },
    animSteps: [
      { label: "Önceki sonuç", note: "Astronom = Selahattin (17. sorudan)." },
      { label: "Çift kuralı", note: "Süleyman ve Selahattin filozof/astronom ikilisidir; astronom alındı → Süleyman filozof." },
      { label: "Tam tablo", note: "Murat = matematikçi, Harun = hekim, Selahattin = astronom, Süleyman = filozof." },
    ],
    phases: phases(
      "Üçüncü ve en kolay soru: önceki iki cevabın üstüne biner. Bulmaca serilerinde bu bilinçli bir basamaklamadır.",
      "Grup 2'de iki rol ve iki kişi var; astronoma kesin kişi atandıysa diğer rol otomatik dağılır.",
      [
        { label: "Astronom", value: "Selahattin" },
        { label: "Grup 2", value: "Süleyman → kalan rol" },
        { label: "İstenen", value: "Süleyman'ın mesleği" },
      ],
      "Tablo üç satırda kapanıyor: önceki sonuç, çift kuralı, sonuç.",
      "Bulmaca serilerinde önceki soruların cevaplarını biriktir: 17'de bulduğun astronom, 18'i tek satırda çözer. Ayrıca tam tablo artık elinde: Murat = matematikçi, Harun = hekim.",
      "'Astronom Selahattin → Süleyman filozof.' Cevap: C) Filozof.",
    ),
  },
  {
    id: "isbo24-21",
    number: "21",
    topic: "Döngüler",
    skill: "while: yaz–sonra-arttır sırası",
    image: "assets/isbo/q21.png",
    section: "C Programlama",
    sectionNote:
      "[21-30] Sorular için açıklama: Soruları C programlama dili çerçevesinde cevaplayınız; derleyici olarak gcc kullanıldığı varsayılmıştır. Gerekli tüm başlık (header) dosyalarının programa dahil edildiğini varsayınız.",
    prompt: "Yukarıdaki programın çıktısı ne olur?",
    code:
      "#include <stdio.h>\n\nint main(){\n    int a = 5;\n\n    while (a < 15) {\n        printf(\"%d\", a);\n        a += 3;\n    }\n\n    return 0;\n}",
    options: AE,
    optionNotes: ["5 8 11 14", "581114", "8 11 14", "81114", "0"],
    answer: "B",
    explanation:
      "a = 5'ten başlar; her turda ÖNCE printf değeri basar, SONRA a += 3. Turlar: 5, 8, 11, 14 yazılır; a = 17'de 17 < 15 yanlış olur ve döngü biter. %d arasında ayraç koymadığından çıktı bitişiktir: 581114.",
    animation: {
      kind: "counter",
      heading: "Sayaç animasyonu: a kutusu tur tur ilerliyor, printf sırası kritik",
    },
    animSteps: [
      { label: "Başlangıç", note: "a = 5. Koşul 5 < 15 doğru → gövdeye girilir.", boxLabel: "a", boxValue: "5", vars: [{ name: "a", value: "5", highlight: true }, { name: "çıktı", value: "—" }] },
      { label: "Tur 1", note: "printf önce: 5 yazılır. Sonra a = 5 + 3 = 8.", boxLabel: "a", boxValue: "8", boxDelta: "+3", vars: [{ name: "çıktı", value: "5", highlight: true }] },
      { label: "Tur 2", note: "8 < 15 doğru → 8 yazılır; a = 11.", boxLabel: "a", boxValue: "11", boxDelta: "+3", vars: [{ name: "çıktı", value: "58", highlight: true }] },
      { label: "Tur 3", note: "11 < 15 doğru → 11 yazılır; a = 14.", boxLabel: "a", boxValue: "14", boxDelta: "+3", vars: [{ name: "çıktı", value: "5811", highlight: true }] },
      { label: "Tur 4", note: "14 < 15 doğru → 14 yazılır; a = 17.", boxLabel: "a", boxValue: "17", boxDelta: "+3", vars: [{ name: "çıktı", value: "581114", highlight: true }] },
      { label: "Dur", note: "17 < 15 yanlış → döngü biter, return 0. Çıktı: 581114.", boxLabel: "a", boxValue: "17", vars: [{ name: "çıktı", value: "581114", highlight: true }] },
    ],
    phases: phases(
      "Program bir while döngüsü: a = 5'ten başlayıp koşul a < 15 doğru olduğu sürece gövde döner. Gövdede önce printf, sonra a += 3 var — sıralama kritik.",
      "Üç bilgiyi ayıkla: başlangıç (5), koşul (< 15), artış (+3). printf'in artıştan ÖNCE geldiğine dikkat et; tersi olsaydı çıktı tamamen değişirdi.",
      [
        { label: "Verilen", value: "a = 5, artış +3" },
        { label: "Koşul", value: "a < 15" },
        { label: "İstenen", value: "ekrana yazılan çıktı" },
      ],
      "Animasyonda a kutusu tur tur ilerliyor: 5 → 8 → 11 → 14 → 17. Her turda değer önce yazdırılıyor, sonra artıyor; 17'de koşul bozuluyor.",
      "Seçenekler tuzağa göre dizilmiş: A) boşluklu yazım, C) printf'i artıştan sonraya koyanların cevabı (5 eksik), D) 5'i unutanlar. printf'in araya boşluk koymadığını hatırla: sayılar bitişik basılır.",
      "'5, 8, 11, 14 yazıldı ve bitişik' de; sonra B) 581114'ü işaretle.",
    ),
  },
  {
    id: "isbo24-22",
    number: "22",
    topic: "Kapsam (scope)",
    skill: "Blok içi tanım ve gölgeleme",
    image: "assets/isbo/q22.png",
    section: "C Programlama",
    sectionNote:
      "[21-30] Sorular için açıklama: Soruları C programlama dili çerçevesinde cevaplayınız; derleyici olarak gcc kullanıldığı varsayılmıştır. Gerekli tüm başlık (header) dosyalarının programa dahil edildiğini varsayınız.",
    prompt: "Yukarıdaki program çalıştırıldığında ekrana ne yazar?",
    code:
      "#include <stdio.h>\n\nint main()\n{\n    int a = 1;\n    {\n        int a = 2, b = 3;\n        printf(\"%d%d\", a, b);\n    }\n    printf(\"%d\", a);\n    return 0;\n}",
    options: AE,
    optionNotes: ["1", "23", "123", "231", "1213"],
    answer: "D",
    explanation:
      "İç blokta tanımlanan a = 2, dıştaki a = 1'i gölgeler; ilk printf iç değerleri yazar: 23. Blok kapanınca iç a ve b yok olur; ikinci printf dış a'yı yazar: 1. Çıktı: 231.",
    animation: {
      kind: "table",
      heading: "Kapsam tablosu: hangi a geçerli?",
      rows: [
        { cells: ["Dış blok", "int a = 1"] },
        { cells: ["İç blok", "int a = 2, b = 3 → dış a'yı gölgeler"], state: "hi" },
        { cells: ["1. printf", "iç a=2, b=3 → yaz: 23"], state: "hi" },
        { cells: ["Blok kapanır", "iç a ve b yok olur"], state: "no" },
        { cells: ["2. printf", "dış a = 1 → yaz: 1"], state: "ok" },
      ],
    },
    animSteps: [
      { label: "Dış blok", note: "int a = 1 — dış kapsamın a'sı doğar." },
      { label: "İç blok", note: "Yeni bir a = 2 ve b = 3 tanımlanır. Aynı ad, FARKLI değişken: dış a artık görünmez (gölgeleme)." },
      { label: "1. printf", note: "İç kapsamda görünen a=2, b=3 → \"23\" yazılır." },
      { label: "Blok kapanır", note: "İç a ve b kapsam dışı kalır, yok olurlar. Dış a hâlâ 1." },
      { label: "2. printf", note: "Şimdi görünen a dıştaki: 1 yazılır. Toplam çıktı: 231." },
    ],
    phases: phases(
      "İç içe iki blok var ve ikisinde de 'a' adında değişken tanımlı. Soru, iki printf'in birlikte ne yazdırdığını soruyor.",
      "İç bloktaki int a, dıştaki a ile aynı adda ama FARKLI bir değişkendir: blok bitene kadar dış a'yı gölgeler. Blok bitince iç a ve b yok olur.",
      [
        { label: "Dış blok", value: "a = 1" },
        { label: "İç blok", value: "a = 2, b = 3" },
        { label: "İstenen", value: "iki printf'in çıktısı" },
      ],
      "Tabloda hangi a'nın geçerli olduğu adım adım renkleniyor: iç blok açılınca gölge devreye girer, blok kapanınca dış a geri döner.",
      "C'de kapsam bloklara göredir: { } içinde tanımlanan değişken yalnız orada yaşar. 23'ten sonra iç a öldüğü için ikinci printf dış a'yı (1) görür. Cevabı 232 sananlar, iç blokta dış a'nın da güncellendiğini varsaymıştır — orada atama yok, yeni tanım var.",
      "'İç blok 23, dış a 1' → bitişik: 231. Seç: D.",
    ),
  },
  {
    id: "isbo24-23",
    number: "23",
    topic: "Döngüler",
    skill: "Birikimli çarpım (faktöriyel)",
    image: "assets/isbo/q23.png",
    section: "C Programlama",
    sectionNote:
      "[21-30] Sorular için açıklama: Soruları C programlama dili çerçevesinde cevaplayınız; derleyici olarak gcc kullanıldığı varsayılmıştır. Gerekli tüm başlık (header) dosyalarının programa dahil edildiğini varsayınız.",
    prompt:
      "Yukarıdaki program çalıştırılıyor. Ekrana 6 girildiğinde çıktı ne olur?",
    code:
      "#include <stdio.h>\n\nint main() {\n    int sayi, isbo = 1;\n\n    printf(\"sayi:\");\n    scanf(\"%d\", &sayi);\n\n    for (int i = 1; i <= sayi; i++) {\n        isbo *= i;\n    }\n\n    printf(\"%d\\n\", isbo);\n    return 0;\n}",
    options: AE,
    optionNotes: ["6", "21", "36", "216", "720"],
    answer: "E",
    explanation:
      "isbo = 1 başlar; döngü i = 1..6 için isbo *= i uygular: 1, 2, 6, 24, 120, 720. Girdi 6 olduğu için program 6! = 720 yazar.",
    animation: {
      kind: "counter",
      heading: "Faktöriyel animasyonu: isbo kutusu çarpımla büyüyor",
    },
    animSteps: [
      { label: "Başlangıç", note: "Girdi sayi = 6. isbo = 1 — çarpımda etkisiz eleman.", boxLabel: "isbo", boxValue: "1", vars: [{ name: "sayi", value: "6" }, { name: "isbo", value: "1", highlight: true }] },
      { label: "i = 1", note: "isbo = 1 × 1 = 1.", boxLabel: "isbo", boxValue: "1", boxDelta: "×1", vars: [{ name: "isbo", value: "1", highlight: true }] },
      { label: "i = 2", note: "isbo = 1 × 2 = 2.", boxLabel: "isbo", boxValue: "2", boxDelta: "×2", vars: [{ name: "isbo", value: "2", highlight: true }] },
      { label: "i = 3", note: "isbo = 2 × 3 = 6.", boxLabel: "isbo", boxValue: "6", boxDelta: "×3", vars: [{ name: "isbo", value: "6", highlight: true }] },
      { label: "i = 4", note: "isbo = 6 × 4 = 24.", boxLabel: "isbo", boxValue: "24", boxDelta: "×4", vars: [{ name: "isbo", value: "24", highlight: true }] },
      { label: "i = 5", note: "isbo = 24 × 5 = 120.", boxLabel: "isbo", boxValue: "120", boxDelta: "×5", vars: [{ name: "isbo", value: "120", highlight: true }] },
      { label: "i = 6", note: "isbo = 120 × 6 = 720.", boxLabel: "isbo", boxValue: "720", boxDelta: "×6", vars: [{ name: "isbo", value: "720", highlight: true }] },
      { label: "Dur", note: "i = 7: koşul 7 <= 6 yanlış → printf 720 yazar.", boxLabel: "isbo", boxValue: "720", vars: [{ name: "isbo", value: "720", highlight: true }] },
    ],
    phases: phases(
      "Program girdi okuyor (6) ve 1'den sayi'ya kadar tüm sayıları isbo ile çarpıyor. Bu, faktöriyel hesabıdır.",
      "isbo başta 1 — çarpımda etkisiz eleman. Döngü i = 1..6 için isbo'ya i'yi çarpar. İstenen: son printf'in yazdığı değer.",
      [
        { label: "Girdi", value: "sayi = 6" },
        { label: "Başlangıç", value: "isbo = 1" },
        { label: "Döngü", value: "isbo *= i, i = 1..6" },
      ],
      "isbo kutusu tur tur büyür: 1 → 1 → 2 → 6 → 24 → 120 → 720. Her adımda kutunun içeriği bir öncekiyle i'nin çarpımı.",
      "6! = 720. Tuzaklar: 36 (6×6 diyenler), 216 (6³ diyenler), 21 (çarpım yerine toplam 1+2+...+6 toplayanlar). Döngüyü sonuna kadar işlet: i = 6 turu da dahil.",
      "'1×2×3×4×5×6 = 720' de ve E)'yi işaretle.",
    ),
  },
  {
    id: "isbo24-24",
    number: "24",
    topic: "Diziler",
    skill: "Koşullu toplama (çift filtresi)",
    image: "assets/isbo/q24.png",
    section: "C Programlama",
    sectionNote:
      "[21-30] Sorular için açıklama: Soruları C programlama dili çerçevesinde cevaplayınız; derleyici olarak gcc kullanıldığı varsayılmıştır. Gerekli tüm başlık (header) dosyalarının programa dahil edildiğini varsayınız.",
    prompt: "Yukarıdaki program çalıştırıldığında ekrana ne yazar?",
    code:
      "#include <stdio.h>\n\nint main() {\n    int dizi[] = {1, 1, 2, 3, 5, 8, 13, 21, 34};\n    int bune = 0;\n\n    for (int i = 0; i < 9; i++) {\n        if (dizi[i] % 2 == 0) {\n            bune += dizi[i];\n        }\n    }\n\n    printf(\"%d\\n\", bune);\n    return 0;\n}",
    options: AE,
    optionNotes: ["33", "44", "55", "66", "Hiçbiri"],
    answer: "B",
    explanation:
      "Çift elemanlar: dizi[2]=2, dizi[5]=8, dizi[8]=34. bune = 2 + 8 + 34 = 44. Diğer elemanlar tek olduğundan toplama katılmaz.",
    animation: {
      kind: "sequence",
      heading: "Dizi tarama: çiftler yanıp sönüyor, bune birikiyor",
      cells: ["1", "1", "2", "3", "5", "8", "13", "21", "34"],
    },
    animSteps: [
      { label: "Başlangıç", note: "bune = 0. Dizi 9 elemanlı; i = 0..8 taranacak.", active: [], vars: [{ name: "bune", value: "0", highlight: true }] },
      { label: "i = 0, 1", note: "1 ve 1 tek → eklenmez.", active: [0, 1], vars: [{ name: "bune", value: "0" }] },
      { label: "i = 2", note: "2 çift → bune = 0 + 2 = 2.", active: [2], vars: [{ name: "bune", value: "2", highlight: true }] },
      { label: "i = 3, 4", note: "3 ve 5 tek → eklenmez.", active: [3, 4], vars: [{ name: "bune", value: "2" }] },
      { label: "i = 5", note: "8 çift → bune = 2 + 8 = 10.", active: [5], vars: [{ name: "bune", value: "10", highlight: true }] },
      { label: "i = 6, 7", note: "13 ve 21 tek → eklenmez.", active: [6, 7], vars: [{ name: "bune", value: "10" }] },
      { label: "i = 8", note: "34 çift → bune = 10 + 34 = 44.", active: [8], vars: [{ name: "bune", value: "44", highlight: true }] },
      { label: "Sonuç", note: "Döngü biter; printf 44 yazar. İlginç ayrıntı: tekslerin toplamı da 44'tür (1+1+3+5+13+21) — ama soru çiftleri soruyor ve sonuç aynı çıkıyor.", active: [], vars: [{ name: "bune", value: "44", highlight: true }] },
    ],
    phases: phases(
      "Dizide Fibonacci sayıları var; program çift olanları bune'ye ekliyor. Dizi 9 elemanlı (indeks 0..8).",
      "Koşul çiftlik testi: % 2 == 0. Toplamaya girenler yalnız 2, 8 ve 34. Tek sayılar (1, 1, 3, 5, 13, 21) bune'ye dokunmaz.",
      [
        { label: "Dizi", value: "1 1 2 3 5 8 13 21 34" },
        { label: "Koşul", value: "dizi[i] % 2 == 0" },
        { label: "İstenen", value: "bune (çiftlerin toplamı)" },
      ],
      "Şeritte hücreler soldan sağa taranıyor; çift olanlar yanıp sönüyor ve bune birikiyor: 0 → 2 → 10 → 44.",
      "Fibonacci'de her üçüncü terim çifttir — 2, 8, 34'ü hızlı yakalamak bunu bilmektir. 33, 55 ve 66 hiçbir kuralla çıkmaz; tüm dizinin toplamı 88'dir.",
      "'Çiftler: 2 + 8 + 34 = 44' de ve B)'yi işaretle.",
    ),
  },
  {
    id: "isbo24-25",
    number: "25",
    topic: "Karakter dizileri",
    skill: "İşaretle ve geç (tekrarsız yazdırma)",
    image: "assets/isbo/q25.png",
    section: "C Programlama",
    sectionNote:
      "[21-30] Sorular için açıklama: Soruları C programlama dili çerçevesinde cevaplayınız; derleyici olarak gcc kullanıldığı varsayılmıştır. Gerekli tüm başlık (header) dosyalarının programa dahil edildiğini varsayınız.",
    prompt: "Yukarıdaki program çalıştırıldığında ekrana ne basar?",
    code:
      "#include <stdio.h>\n\nint main() {\n    char kelime[] = \"verativermati\";\n    int isbo[256] = {0};\n\n    for (int i = 0; kelime[i] != '\\0'; i++) {\n        if (!isbo[(int)kelime[i]]) {\n            isbo[(int)kelime[i]] = 1;\n            printf(\"%c\", kelime[i]);\n        }\n    }\n    printf(\"\\n\");\n\n    return 0;\n}",
    options: AE,
    optionNotes: ["vera", "verat", "verati", "veratim", "verativ"],
    answer: "D",
    explanation:
      "Karakterler soldan sağa taranır; yalnız İLK görüldüğünde yazdırılır. verativermati'de ilk görüşler: v, e, r, a, t, i; sonraki v-e-r tekrarları atlanır, m ilk kez görülür → çıktı 'veratim'.",
    animation: {
      kind: "trace",
      heading: "Kod izleme: işaretle-yazdır döngüsü",
      codeLines: [
        "char kelime[] = \"verativermati\";",
        "int isbo[256] = {0};",
        "for (i = 0; kelime[i] != '\\0'; i++) {",
        "  if (!isbo[kelime[i]]) {",
        "    isbo[kelime[i]] = 1;",
        "    printf(\"%c\", kelime[i]);",
        "  }",
        "}",
      ],
    },
    animSteps: [
      { label: "Hazırlık", note: "kelime = \"verativermati\" (13 harf). isbo'nun 256 gözü de 0 — hiçbir karakter henüz görülmedi.", line: 1 },
      { label: "'v' (i=0)", note: "isbo['v'] = 0 → koşul doğru. İşaretle, yazdır: \"v\".", line: 5, output: "v" },
      { label: "'e' (i=1)", note: "'e' ilk kez → \"ve\".", line: 5, output: "ve" },
      { label: "'r' (i=2)", note: "'r' yeni → \"ver\".", line: 5, output: "ver" },
      { label: "'a' (i=3)", note: "'a' yeni → \"vera\".", line: 5, output: "vera" },
      { label: "'t' (i=4)", note: "'t' yeni → \"verat\".", line: 5, output: "verat" },
      { label: "'i' (i=5)", note: "'i' yeni → \"verati\".", line: 5, output: "verati" },
      { label: "'v' (i=6)", note: "isbo['v'] artık 1 → koşul yanlış, yazdırma atlanır.", line: 3, output: "verati" },
      { label: "'e','r' (i=7,8)", note: "İkisi de görülmüştü → atlanır.", line: 3, output: "verati" },
      { label: "'m' (i=9)", note: "'m' ilk kez → \"veratim\".", line: 5, output: "veratim" },
      { label: "'a','t','i' (i=10..12)", note: "Hepsi tekrar → atlanır. Kelime biter; printf(\"\\n\") satırı kapatır. Sonuç: veratim.", line: 3, output: "veratim" },
    ],
    phases: phases(
      "Program bir kelimede ('verativermati') gezinir ve bir karakteri İLK gördüğünde yazdırır; isbo dizisi 'görüldü mü' işaretlerini tutar.",
      "isbo[c], c karakterinin daha önce yazdırılıp yazdırılmadığını gösterir: 0 = görülmedi, 1 = görüldü. Koşul !isbo[...] 'daha önce görülmediyse' demektir.",
      [
        { label: "Kelime", value: "verativermati (13 harf)" },
        { label: "İşaret dizisi", value: "isbo[256], hepsi 0" },
        { label: "Kural", value: "ilk görüşte yaz, sonra işaretle" },
      ],
      "Kod satır satır ilerliyor; çıktı birikiyor: v, ve, ver, vera, verat, verati... tekrarlar atlanıyor, m geldiğinde veratim tamamlanıyor.",
      "Bu, 'aynı elemandan yalnız bir kez' kalıbıdır: işaretle-sonra-geç. v, e, r, a, t, i yazıldıktan sonra 7. harf (v) tekrar gelir ama isbo[v] artık 1'dir. m ilk kez 10. harfte göründüğü için çıktıya eklenebilir; son 3 harf (a, t, i) de tekrardır.",
      "'İlk görüşler: v e r a t i ... m' → veratim. Seç: D.",
    ),
  },
];

export const ISBO_EXAM_QUESTIONS: IsboQuestion[] = [...ISBO_EXAM_PART1, ...ISBO_EXAM_QUESTIONS_2];
