export type Trace35Task = {
  id: string;
  step: number;
  skill: string;
  challenge: string;
  code: string;
  options: readonly string[];
  answer: string;
  hints: readonly string[];
};

export const TRACE_STEP_COUNT = 35;

const toStep = (step: number) => String(step).padStart(3, "0");
export const getTraceStepId = (step: number) => `iz-surme35-${toStep(step)}`;

const numericOptions = (answer: number) => [answer, answer - 1, answer + 1, answer - 2, answer + 2, answer - 3, answer + 3, answer + 4, answer - 4].map(String);
const letterOptions = ["A", "B", "C", "D", "E", "F", "G", "H"];
const pairOptions = (first: number, second: number) => [
  `${first} ${second}`,
  `${second} ${first}`,
  `${first + 1} ${second}`,
  `${first - 1} ${second}`,
  `${first} ${second + 1}`,
  `${first} ${second - 1}`,
  `${first + 2} ${second}`,
  `${first} ${second + 2}`,
  `${first - 2} ${second}`,
  `${first} ${second - 2}`,
].filter((option, index, options) => options.indexOf(option) === index).slice(0, 8);

function placeAnswer(options: readonly string[], answer: string, step: number, variant: number) {
  const distractors = options.filter((option, index, values) => option !== answer && values.indexOf(option) === index);
  if (distractors.length < 7) throw new Error(`Görev ${step} için sekiz farklı seçenek üretilemedi.`);
  const answerIndex = (step * 5 + variant * 3) % 8;
  return [...distractors.slice(0, answerIndex), answer, ...distractors.slice(answerIndex, 7)];
}

function task(step: number, skill: string, challenge: string, code: string, answer: string, options: readonly string[], hints: readonly string[]): Trace35Task {
  return { id: getTraceStepId(step), step, skill, challenge, code, answer, options, hints };
}

function simpleUpdate(step: number, variant: number) {
  const start = 4 + variant * 3;
  const change = 2 + variant;
  const answer = start + change;
  return task(step, "Başlangıç değerini güncelle", "Kodun son değeri nedir?", `int x = ${start};\nx = x + ${change};\nprintf("%d", x);`, String(answer), numericOptions(answer), ["İlk satırdaki x değerini yaz.", "İkinci satırdaki işareti dikkatle oku.", "printf güncellenmiş değeri kullanır."]);
}

function chainUpdate(step: number, variant: number) {
  const start = 9 + variant * 2;
  const add = 3 + variant;
  const subtract = 2;
  const answer = start + add - subtract;
  return task(step, "Zincir güncelleme", "İki işlemden sonra ekranda ne görünür?", `int puan = ${start};\npuan = puan + ${add};\npuan = puan - ${subtract};\nprintf("%d", puan);`, String(answer), numericOptions(answer), ["İlk işlemden sonraki ara değeri not et.", "Son işlem başlangıca değil ara değere uygulanır.", "Satırları yukarıdan aşağıya izle."]);
}

function copyValue(step: number, variant: number) {
  const start = 5 + variant * 2;
  const add = 2 + variant;
  const first = start + add;
  const answer = `${first} ${start}`;
  const choices = pairOptions(first, start);
  return task(step, "Değeri kopyalama", "Ekranda hangi iki değer görünür?", `int a = ${start};\nint b = a;\na = a + ${add};\nprintf("%d %d", a, b);`, answer, choices, ["b, atandığı anda a içindeki değeri alır.", "Sonraki satır hangi kutuyu değiştiriyor?", "printf içindeki sırayı koru."]);
}

function compoundAssignment(step: number, variant: number) {
  const start = 3 + variant;
  const multiplier = 2 + variant;
  const add = 1 + variant;
  const answer = start * multiplier + add;
  return task(step, "Kısa atama", "Kısa atamalardan sonra sonuç nedir?", `int n = ${start};\nn *= ${multiplier};\nn += ${add};\nprintf("%d", n);`, String(answer), numericOptions(answer), ["*= mevcut değeri çarparak günceller.", "+= ikinci güncellemedir.", "Her kısa atamadan sonra n yeni değer taşır."]);
}

function quotientRemainder(step: number, variant: number) {
  const value = 17 + variant * 6;
  const divisor = 5 + variant;
  const quotient = Math.trunc(value / divisor);
  const remainder = value % divisor;
  const answer = `${quotient} ${remainder}`;
  const choices = pairOptions(quotient, remainder);
  return task(step, "Bölüm ve kalan", "Tam bölüm ve kalan hangi çifttir?", `int sayi = ${value};\nint bolum = sayi / ${divisor};\nint kalan = sayi % ${divisor};\nprintf("%d %d", bolum, kalan);`, answer, choices, ["/ işareti iki int için tam bölümü verir.", "% işareti bölmeden artanı verir.", "İki sonucu ayrı ayrı bul."]);
}

function twoVariables(step: number, variant: number) {
  const left = 6 + variant * 2;
  const right = 12 + variant;
  const nextLeft = left + 2;
  const nextRight = right - nextLeft;
  const answer = `${nextLeft} ${nextRight}`;
  const choices = pairOptions(nextLeft, nextRight);
  return task(step, "İki değişken", "Son durumda hangi çift yazılır?", `int sol = ${left};\nint sag = ${right};\nsol = sol + 2;\nsag = sag - sol;\nprintf("%d %d", sol, sag);`, answer, choices, ["Önce sol değişkeni güncelle.", "sag hesabında güncellenmiş sol değerini kullan.", "İki kutuyu sırayla izle."]);
}

function greaterCondition(step: number, variant: number) {
  const value = 4 + variant * 5;
  const boundary = 8 + variant;
  const answer = value > boundary ? "A" : "B";
  return task(step, "Karşılaştırma", "Program hangi harfi yazar?", `int n = ${value};\nif (n > ${boundary}) printf("A");\nelse printf("B");`, answer, letterOptions, ["n yerine ilk satırdaki sayıyı koy.", "Büyüktür karşılaştırmasını yap.", "Yalnız doğru dal çalışır."]);
}

function parityCondition(step: number, variant: number) {
  const value = 8 + variant * 3;
  const answer = value % 2 === 0 ? "E" : "T";
  const options = ["E", "T", "C", "D", "F", "G", "H", "K"];
  return task(step, "Çift–tek kontrolü", "Program hangi işareti basar?", `int n = ${value};\nif (n % 2 == 0) printf("E");\nelse printf("T");`, answer, options, ["Önce ikiye bölümden kalanı düşün.", "Sıfır kalan, çift olduğunu gösterir.", "Koşulun içindeki harfi seç."]);
}

function andCondition(step: number, variant: number) {
  const value = 5 + variant * 2;
  const answer = value >= 6 && value % 2 !== 0 ? "A" : "B";
  return task(step, "Ve bağlacı", "İki koşul birlikte sağlanıyor mu?", `int n = ${value};\nif (n >= 6 && n % 2 != 0) printf("A");\nelse printf("B");`, answer, letterOptions, ["&& işareti iki koşulun da doğru olmasını ister.", "Karşılaştırmayı ve kalanı ayrı ayrı değerlendir.", "Sonra iki sonucu birleştir."]);
}

function orCondition(step: number, variant: number) {
  const value = 4 + variant * 3;
  const answer = value === 7 || value % 3 === 0 ? "A" : "B";
  return task(step, "Veya bağlacı", "En az bir koşul doğru mu?", `int n = ${value};\nif (n == 7 || n % 3 == 0) printf("A");\nelse printf("B");`, answer, letterOptions, ["|| işareti en az bir doğru koşul ister.", "İki koşulu tek tek kontrol et.", "Bir tanesi doğruysa ilk dal çalışır."]);
}

function nestedIf(step: number, variant: number) {
  const score = [8, 7, 4][variant];
  const answer = score >= 6 ? (score % 2 === 0 ? "A" : "B") : "C";
  const options = ["A", "B", "C", "D", "E", "F", "G", "H"];
  return task(step, "İç içe koşul", "Program hangi sınıfı yazar?", `int puan = ${score};\nif (puan >= 6) {\n  if (puan % 2 == 0) printf("A");\n  else printf("B");\n} else printf("C");`, answer, options, ["Önce dış koşulun sonucuna bak.", "Dış koşul doğruysa iç koşula geç.", "İç dalın harfini seç."]);
}

function forCount(step: number, variant: number) {
  const start = variant;
  const count = 4 + variant;
  const end = start + count;
  return task(step, "For sayacı", "Döngü gövdesi kaç kez çalışır?", `int sayac = 0;\nfor (int i = ${start}; i < ${end}; i++) {\n  sayac++;\n}\nprintf("%d", sayac);`, String(count), numericOptions(count), ["Sayaç başlangıç değerini yaz.", "Koşulu sağlayan değerleri sırala.", "Her turda sayaç bir artar."]);
}

function sumMultiples(step: number, variant: number) {
  const end = 9 + variant * 3;
  let answer = 0;
  for (let i = 1; i <= end; i += 1) if (i % 3 === 0) answer += i;
  return task(step, "Koşullu birikim", "Üçe bölünenlerin toplamı nedir?", `int toplam = 0;\nfor (int i = 1; i <= ${end}; i++) {\n  if (i % 3 == 0) toplam += i;\n}\nprintf("%d", toplam);`, String(answer), numericOptions(answer), ["Her sayı toplama eklenmez.", "Önce kalanı sıfır olan sayaçları bul.", "Yalnız onları toplam kutusuna ekle."]);
}

function stepCounter(step: number, variant: number) {
  const start = 1 + variant;
  const end = 11 + variant;
  const increment = 2;
  const answer = Math.ceil((end - start) / increment);
  return task(step, "Adımlı sayaç", "Döngü kaç kez çalışır?", `int sayac = 0;\nfor (int i = ${start}; i < ${end}; i += ${increment}) {\n  sayac++;\n}\nprintf("%d", sayac);`, String(answer), numericOptions(answer), ["Sayaç her turda iki artar.", "Sınırı geçmeden aldığı değerleri yaz.", "Değerlerin sayısı tur sayısıdır."]);
}

function whileHalve(step: number, variant: number) {
  const start = 20 + variant * 6;
  let answer = 0;
  for (let value = start; value > 1; value = Math.trunc(value / 2)) answer += 1;
  return task(step, "While ve tam bölme", "Döngü kaç tur döner?", `int n = ${start};\nint sayac = 0;\nwhile (n > 1) {\n  n = n / 2;\n  sayac++;\n}\nprintf("%d", sayac);`, String(answer), numericOptions(answer), ["Her turda n tam sayı bölmesiyle küçülür.", "n değeri 1 olana kadar izle.", "sayac her turda bir artar."]);
}

function nestedLoop(step: number, variant: number) {
  const outer = 2 + variant;
  const inner = 3 + (variant % 2);
  const answer = outer * inner;
  return task(step, "İç içe döngü", "Artış işlemi toplam kaç kez yapılır?", `int c = 0;\nfor (int i = 0; i < ${outer}; i++) {\n  for (int j = 0; j < ${inner}; j++) c++;\n}\nprintf("%d", c);`, String(answer), numericOptions(answer), ["Dış döngünün tur sayısını bul.", "Her dış turda iç döngü tekrar çalışır.", "İki tur sayısını çarp."]);
}

function arrayIndex(step: number, variant: number) {
  const values = [3 + variant, 7 + variant, 11 + variant, 15 + variant, 19 + variant];
  const index = 1 + variant;
  const answer = values[index];
  return task(step, "Dizi indeksi", "İstenen kutuda hangi değer var?", `int a[5] = {${values.join(", ")}};\nprintf("%d", a[${index}]);`, String(answer), numericOptions(answer), ["Dizi indeksleri sıfırdan başlar.", `a[${index}] kaçıncı kutuyu gösterir?`, "O kutudaki değeri diziden oku."]);
}

function arrayUpdate(step: number, variant: number) {
  const value = 6 + variant * 2;
  const add = 3 + variant;
  const answer = value + add;
  return task(step, "Dizi güncelleme", "Güncellenen kutunun değeri nedir?", `int a[3] = {2, ${value}, 12};\na[1] = a[1] + ${add};\nprintf("%d", a[1]);`, String(answer), numericOptions(answer), ["a[1] ikinci kutuyu gösterir.", "İşlemi o kutunun eski değerine uygula.", "printf güncellenmiş kutuyu okur."]);
}

function reverseArray(step: number, variant: number) {
  const size = 4 + variant;
  const answer = 0;
  return task(step, "İki uçlu dizi", "Son indisin değeri nedir?", `int a[${size}], l = 0, r = ${size - 1};\nwhile (l <= r) {\n  a[l] = r;\n  a[r] = l;\n  l++; r--;\n}\nprintf("%d", a[${size - 1}]);`, String(answer), numericOptions(answer), ["l soldan, r sağdan ilerler.", "İlk turda son kutuya hangi değer yazılıyor?", "Sorulan kutu son indekstir."]);
}

function indirectIndex(step: number, variant: number) {
  const values = variant === 0 ? [2, 3, 0, 1] : variant === 1 ? [1, 3, 0, 2] : [3, 0, 1, 2];
  let index = 0;
  for (let turn = 0; turn < 3; turn += 1) index = values[index];
  return task(step, "Dolaylı indeks", "Üç geçişten sonra indeks kaçtır?", `int a[4] = {${values.join(", ")}};\nint i = 0;\nfor (int tur = 0; tur < 3; tur++) i = a[i];\nprintf("%d", i);`, String(index), numericOptions(index), ["i başlangıçta sıfırdır.", "Her turda a[i] yeni i olur.", "Üç geçişi tek tek zincirle."]);
}

function oneParameterFunction(step: number, variant: number) {
  const input = 3 + variant;
  const multiplier = 2 + variant;
  const answer = input * multiplier + 1;
  return task(step, "Tek parametreli fonksiyon", "Fonksiyon ne döndürür?", `int kural(int n) { return n * ${multiplier} + 1; }\nprintf("%d", kural(${input}));`, String(answer), numericOptions(answer), ["Çağrıdaki sayı n yerine geçer.", "Return satırındaki çarpmayı önce yap.", "Sonra sabit sayıyı ekle."]);
}

function twoParameterFunction(step: number, variant: number) {
  const left = 3 + variant;
  const right = 7 + variant * 2;
  const answer = left * 2 + right;
  return task(step, "İki parametreli fonksiyon", "Fonksiyon ne yazar?", `int birlestir(int a, int b) { return a * 2 + b; }\nprintf("%d", birlestir(${left}, ${right}));`, String(answer), numericOptions(answer), ["İlk sayı a, ikinci sayı b olur.", "a ikiyle çarpılır.", "Sonra b eklenir."]);
}

function smallRecursion(step: number, variant: number) {
  const input = 8 + variant * 4;
  let answer = 0;
  for (let value = input; value > 1; value = Math.trunc(value / 2)) answer += 1;
  return task(step, "Küçük özyineleme", "Fonksiyon kaç çağrı basamağı döndürür?", `int adim(int n) {\n  if (n <= 1) return 0;\n  return adim(n / 2) + 1;\n}\nprintf("%d", adim(${input}));`, String(answer), numericOptions(answer), ["Her çağrıda n ikiye bölünür.", "n bir veya daha küçük olunca temel durum çalışır.", "Bölünme basamaklarını say."]);
}

function modularCursor(step: number, variant: number) {
  const start = 2 + variant;
  const jump = 3 + variant;
  const size = 10;
  const turns = 3;
  const answer = (start + jump * turns) % size;
  return task(step, "Modüler döngü", "İmleç hangi indekste biter?", `int cur = ${start};\nfor (int i = 0; i < ${turns}; i++) cur = (cur + ${jump}) % ${size};\nprintf("%d", cur);`, String(answer), numericOptions(answer), ["Her turda önce ekleme yapılır.", "% işlemi sınırı aşınca başa sarar.", "Üç turu sırayla izle."]);
}

function digits(step: number, variant: number) {
  const value = 245 + variant * 111;
  const answer = Math.trunc(value / 10) % 10;
  return task(step, "Basamak ayırma", "Onlar basamağı nedir?", `int n = ${value};\nint onlar = (n / 10) % 10;\nprintf("%d", onlar);`, String(answer), numericOptions(answer), ["İlk bölme birler basamağını atar.", "% 10 kalan son basamağı bırakır.", "Bu kalan onlar basamağıdır."]);
}

function bitShift(step: number, variant: number) {
  const left = 1 + variant;
  const right = 16 + variant * 8;
  const answer = (left << 3) + (right >> 2);
  return task(step, "Bit kaydırma", "İfade hangi değeri verir?", `printf("%d", (${left} << 3) + (${right} >> 2));`, String(answer), numericOptions(answer), ["Sola kaydırma iki kuvvetleriyle çarpmaya benzer.", "Sağa kaydırma tam sayı bölmesi gibi küçültür.", "İki sonucu sonra topla."]);
}

function matrixIndex(step: number, variant: number) {
  const base = 1 + variant * 2;
  const row = variant;
  const column = 2 - variant;
  const values = [[base, base + 1, base + 2], [base + 3, base + 4, base + 5], [base + 6, base + 7, base + 8]];
  const answer = values[row][column];
  return task(step, "İki boyutlu dizi", "İstenen hücredeki değer nedir?", `int a[3][3] = {{${values[0].join(", ")}}, {${values[1].join(", ")}}, {${values[2].join(", ")}}};\nprintf("%d", a[${row}][${column}]);`, String(answer), numericOptions(answer), ["İlk köşeli parantez satırı seçer.", "İkinci köşeli parantez sütunu seçer.", "Seçilen hücredeki sayıyı oku."]);
}

function rowSum(step: number, variant: number) {
  const values = [2 + variant, 4 + variant, 6 + variant];
  const answer = values.reduce((sum, value) => sum + value, 0);
  return task(step, "Dizi satır toplamı", "Satırın toplamı kaçtır?", `int a[3] = {${values.join(", ")}};\nint toplam = 0;\nfor (int i = 0; i < 3; i++) toplam += a[i];\nprintf("%d", toplam);`, String(answer), numericOptions(answer), ["toplam sıfırdan başlar.", "Dizinin üç kutusu sırayla eklenir.", "Her eklemeden sonra ara toplamı izle."]);
}

function arrayChase(step: number, variant: number) {
  const values = variant === 0 ? [1, 3, 0, 2, 4] : variant === 1 ? [2, 0, 4, 1, 3] : [4, 2, 1, 0, 3];
  let index = 0;
  for (let turn = 0; turn < 4; turn += 1) index = values[index];
  return task(step, "Dizi üzerinde iz", "Dört geçişten sonra indeks nedir?", `int a[5] = {${values.join(", ")}};\nint i = 0;\nfor (int t = 0; t < 4; t++) i = a[i];\nprintf("%d", i);`, String(index), numericOptions(index), ["Başlangıç indisi sıfırdır.", "a[i] sonucu yeni i olur.", "Dört okun izini zincir halinde sür."]);
}

function dependency(step: number, variant: number) {
  const readyA = variant === 1 ? 0 : 1;
  const readyC = variant === 2 ? 0 : 1;
  const answer = readyA && readyC ? 1 : 0;
  return task(step, "Ön koşul mantığı", "B görevi açılır mı?", `int aTamam = ${readyA};\nint cTamam = ${readyC};\nint bAcik = 0;\nif (aTamam && cTamam) bAcik = 1;\nprintf("%d", bAcik);`, String(answer), numericOptions(answer), ["B için hangi iki ön koşul var?", "&& iki görevin de tamamlanmasını ister.", "bAcik yalnız koşul doğruysa bir olur."]);
}

function pathCount(step: number, variant: number) {
  const direct = 1 + variant;
  const viaB = 2 + variant;
  const viaC = 3;
  const answer = direct + viaB + viaC;
  return task(step, "Basit yol sayma", "Toplam kaç farklı rota vardır?", `int dogrudan = ${direct};\nint bUzerinden = ${viaB};\nint cUzerinden = ${viaC};\nprintf("%d", dogrudan + bUzerinden + cUzerinden);`, String(answer), numericOptions(answer), ["Her yol grubu ayrı sayılmıştır.", "Gruplar birbirinden farklıysa toplanır.", "Üç yolu aynı toplamda birleştir."]);
}

function truthCount(step: number, variant: number) {
  const claims = variant === 0 ? [1, 0, 1, 1] : variant === 1 ? [0, 1, 0, 1] : [1, 1, 0, 0];
  const answer = claims.reduce((sum, value) => sum + value, 0);
  return task(step, "Doğru–yanlış sayma", "Kaç ifade doğru kabul edilir?", `int ifade[4] = {${claims.join(", ")}};\nint dogru = 0;\nfor (int i = 0; i < 4; i++) if (ifade[i]) dogru++;\nprintf("%d", dogru);`, String(answer), numericOptions(answer), ["Sıfır yanlış, bir doğruyu temsil eder.", "Koşul yalnız bir olan kutularda çalışır.", "dogru sayacını bu kutular için artır."]);
}

function digitSearch(step: number, variant: number) {
  const target = 2 + variant;
  const answer = target * 2;
  return task(step, "Kısıtlı arama", "Koşulu sağlayan ilk sayı nedir?", `int sonuc = 0;\nfor (int d = 0; d <= 4; d++) {\n  if (d * 2 == ${target * 2}) { sonuc = d * 2; break; }\n}\nprintf("%d", sonuc);`, String(answer), numericOptions(answer), ["d değerleri küçükten büyüğe denenir.", "Koşul sağlanınca break döngüyü durdurur.", "sonuc o anda bulunan değerdir."]);
}

function takeAway(step: number, variant: number) {
  const stones = 14 + variant * 3;
  const answer = stones % 6;
  return task(step, "Oyun stratejisi kalanı", "Altılı gruplara göre kalan taş sayısı nedir?", `int tas = ${stones};\nprintf("%d", tas % 6);`, String(answer), numericOptions(answer), ["Altılı gruplara ayırmayı düşün.", "% işareti tam bölünmeyen kısmı verir.", "Bu kalan strateji için işaret olur."]);
}

function dynamicAccumulation(step: number, variant: number) {
  const end = 5 + variant;
  const ways = [1, 1];
  for (let index = 2; index <= end; index += 1) ways[index] = ways[index - 1] + ways[index - 2];
  const answer = ways[end];
  return task(step, "Dinamik birikim", "Son kutudaki yol sayısı nedir?", `int yol[${end + 1}] = {1, 1};\nfor (int i = 2; i <= ${end}; i++) yol[i] = yol[i - 1] + yol[i - 2];\nprintf("%d", yol[${end}]);`, String(answer), numericOptions(answer), ["İlk iki kutunun değerini not et.", "Her yeni kutu önceki iki kutunun toplamıdır.", "Son indekse kadar sırayla ilerle."]);
}

const builders = [simpleUpdate, chainUpdate, copyValue, compoundAssignment, quotientRemainder, twoVariables, greaterCondition, parityCondition, andCondition, orCondition, nestedIf, forCount, sumMultiples, stepCounter, whileHalve, nestedLoop, arrayIndex, arrayUpdate, reverseArray, indirectIndex, oneParameterFunction, twoParameterFunction, smallRecursion, modularCursor, digits, bitShift, matrixIndex, rowSum, arrayChase, dependency, pathCount, truthCount, digitSearch, takeAway, dynamicAccumulation] as const;

export function getTrace35Task(step: number, variant = 0): Trace35Task {
  const normalizedStep = Math.min(TRACE_STEP_COUNT, Math.max(1, Math.trunc(step)));
  const normalizedVariant = Math.max(0, Math.trunc(variant)) % 3;
  const rawTask = builders[normalizedStep - 1](normalizedStep, normalizedVariant);
  return {
    ...rawTask,
    options: placeAnswer(rawTask.options, rawTask.answer, normalizedStep, normalizedVariant),
    code: `${rawTask.code}\n// iz sürme görevi: ${toStep(normalizedStep)}`,
  };
}

export const trace35Tasks = Array.from({ length: TRACE_STEP_COUNT }, (_, index) => getTrace35Task(index + 1));
