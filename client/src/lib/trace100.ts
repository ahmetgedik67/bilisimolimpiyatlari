export type Trace100Task = {
  id: string;
  step: number;
  skill: string;
  challenge: string;
  code: string;
  options: readonly string[];
  answer: string;
  hints: readonly string[];
};

const toStep = (step: number) => String(step).padStart(3, "0");

export const getTraceStepId = (step: number) => `iz-surme-${toStep(step)}`;

const numberOptions = (answer: number) => {
  const offsets = [0, -1, 1, -2, 2, -3, 3, 4];
  return offsets.map((offset) => answer + offset).map(String);
};

const pairOptions = (first: number, second: number) => {
  const candidates = [
    `${first} ${second}`,
    `${second} ${first}`,
    `${first + 1} ${second}`,
    `${first - 1} ${second}`,
    `${first} ${second + 1}`,
    `${first} ${second - 1}`,
    `${first + 1} ${second + 1}`,
    `${first - 1} ${second - 1}`,
  ];
  return candidates.filter((value, index, values) => values.indexOf(value) === index);
};

function placeAnswer(options: readonly string[], answer: string, step: number, variant: number) {
  const distractors = options.filter((option, index, values) => option !== answer && values.indexOf(option) === index);
  if (distractors.length < 7) throw new Error(`İz sürme adımı ${step} için yeterli farklı seçenek üretilemedi.`);
  const answerIndex = (step * 5 + variant * 3) % 8;
  return [...distractors.slice(0, answerIndex), answer, ...distractors.slice(answerIndex, 7)];
}

function sequentialTask(step: number, variant: number): Trace100Task {
  const start = 2 + ((step * 3 + variant * 2) % 8);
  const add = 1 + ((step + variant) % 5);
  const multiplier = 2 + ((step + variant) % 3);
  const answer = (start + add) * multiplier;
  return {
    id: getTraceStepId(step), step, skill: "Sıralı yürütme",
    challenge: "Son değer kaç olur?",
    code: `int x = ${start};\nx = x + ${add};\nx = x * ${multiplier};\nprintf("%d", x);`,
    options: numberOptions(answer), answer: String(answer),
    hints: ["İlk satırdaki değeri x kutusuna yaz.", "İkinci satırın sonucunu ara değer olarak sakla.", "Çarpma işlemi, ara değere uygulanır."],
  };
}

function copyTask(step: number, variant: number): Trace100Task {
  const start = 4 + ((step + variant * 2) % 9);
  const change = 1 + ((step * 2 + variant) % 5);
  const first = start + change;
  return {
    id: getTraceStepId(step), step, skill: "Kopyalama ve atama",
    challenge: "Ekranda hangi iki değer görünür?",
    code: `int a = ${start};\nint b = a;\na = a + ${change};\nprintf("%d %d", a, b);`,
    options: pairOptions(first, start), answer: `${first} ${start}`,
    hints: ["b, a'nın hangi anlık değerini kopyalıyor?", "Sonraki atama yalnızca a kutusunu değiştirir.", "printf içindeki değişkenleri soldan sağa izle."],
  };
}

function conditionTask(step: number, variant: number): Trace100Task {
  const value = 2 + ((step * 2 + variant) % 14);
  const boundary = 5 + ((step + variant * 3) % 8);
  const isGreater = value > boundary;
  return {
    id: getTraceStepId(step), step, skill: "Karar kapıları",
    challenge: "Program hangi harfi yazar?",
    code: `int n = ${value};\nif (n > ${boundary}) {\n  printf("A");\n} else {\n  printf("B");\n}`,
    options: ["A", "B", String(value), String(boundary), "Hiçbiri", "0", "Doğru", "Yanlış"], answer: isGreater ? "A" : "B",
    hints: ["n yerine ilk satırdaki sayıyı koy.", "Büyüktür işaretinin iki tarafını karşılaştır.", "Yalnızca doğru koşulun bloğu çalışır."],
  };
}

function loopCountTask(step: number, variant: number): Trace100Task {
  const start = (step + variant) % 3;
  const count = 2 + ((step + variant * 2) % 4);
  const end = start + count;
  return {
    id: getTraceStepId(step), step, skill: "Döngü sayacı",
    challenge: "Döngü gövdesi kaç kez çalışır?",
    code: `for (int i = ${start}; i < ${end}; i++) {\n  printf("*");\n}`,
    options: numberOptions(count), answer: String(count),
    hints: ["Sayaç için başlangıç değerini yaz.", "Koşul doğruyken sayaç değerlerini sırala.", "Her turda sayaç bir artar."],
  };
}

function accumulationTask(step: number, variant: number): Trace100Task {
  const end = 3 + ((step + variant) % 4);
  const initial = (step + variant) % 3;
  const sum = initial + (end * (end + 1)) / 2;
  return {
    id: getTraceStepId(step), step, skill: "Döngüde birikim",
    challenge: "Program hangi değeri yazar?",
    code: `int toplam = ${initial};\nfor (int i = 1; i <= ${end}; i++) {\n  toplam = toplam + i;\n}\nprintf("%d", toplam);`,
    options: numberOptions(sum), answer: String(sum),
    hints: ["Toplam kutusunun ilk değerini not et.", "Her turda i ve toplam için yeni değeri yaz.", "Döngü bittiğinde son toplam yazdırılır."],
  };
}

function arrayAccessTask(step: number, variant: number): Trace100Task {
  const values = [
    2 + ((step + variant) % 7),
    5 + ((step * 2 + variant) % 7),
    9 + ((step + variant * 2) % 7),
    13 + ((step * 3 + variant) % 7),
  ];
  const index = (step + variant) % 4;
  const answer = values[index];
  return {
    id: getTraceStepId(step), step, skill: "Dizi indeksi",
    challenge: "İstenen kutunun değeri nedir?",
    code: `int a[4] = {${values.join(", ")}};\nprintf("%d", a[${index}]);`,
    options: numberOptions(answer), answer: String(answer),
    hints: ["Dizilerde ilk kutunun indeksi sıfırdır.", `a[${index}] ifadesinin kaçıncı kutuyu gösterdiğini belirle.`, "İstenen kutudaki değeri diziden oku."],
  };
}

function arrayUpdateTask(step: number, variant: number): Trace100Task {
  const left = 2 + ((step + variant) % 7);
  const target = 5 + ((step * 2 + variant) % 7);
  const right = 10 + ((step + variant * 2) % 7);
  const add = 1 + ((step + variant) % 4);
  const answer = target + add;
  return {
    id: getTraceStepId(step), step, skill: "Dizi güncelleme",
    challenge: "Güncellenen kutuda hangi değer vardır?",
    code: `int a[3] = {${left}, ${target}, ${right}};\na[1] = a[1] + ${add};\nprintf("%d", a[1]);`,
    options: numberOptions(answer), answer: String(answer),
    hints: ["a[1] ikinci kutuyu işaret eder.", "İşlemi ikinci kutudaki eski değere uygula.", "printf güncellenmiş kutuyu okur."],
  };
}

function functionTask(step: number, variant: number): Trace100Task {
  const input = 2 + ((step + variant) % 7);
  const multiplier = 2 + ((step + variant * 2) % 3);
  const add = (step + variant) % 4;
  const answer = input * multiplier + add;
  return {
    id: getTraceStepId(step), step, skill: "Fonksiyon çağrısı",
    challenge: "Fonksiyon hangi sonucu verir?",
    code: `int kural(int n) {\n  return n * ${multiplier} + ${add};\n}\nprintf("%d", kural(${input}));`,
    options: numberOptions(answer), answer: String(answer),
    hints: ["Çağrıdaki değeri n parametresinin yerine yaz.", "Return satırındaki çarpmayı önce uygula.", "Elde edilen değere sabit sayıyı ekle."],
  };
}

function nestedLoopTask(step: number, variant: number): Trace100Task {
  const outer = 2 + ((step + variant) % 3);
  const inner = 2 + ((step * 2 + variant) % 3);
  const answer = outer * inner;
  return {
    id: getTraceStepId(step), step, skill: "İç içe döngü",
    challenge: "Artış işlemi toplam kaç kez yapılır?",
    code: `int sayac = 0;\nfor (int i = 0; i < ${outer}; i++) {\n  for (int j = 0; j < ${inner}; j++) {\n    sayac++;\n  }\n}\nprintf("%d", sayac);`,
    options: numberOptions(answer), answer: String(answer),
    hints: ["Dış döngünün tur sayısını bul.", "Her dış turda iç döngü kaç kez dönüyor?", "İki tur sayısını çarpıp sayacı düşün."],
  };
}

function recursionTask(step: number, variant: number): Trace100Task {
  const input = 8 + ((step - 91) * 2) + variant;
  let answer = 0;
  for (let value = input; value > 1; value = Math.trunc(value / 2)) answer += 1;
  return {
    id: getTraceStepId(step), step, skill: "Kuralın tekrar çağrılması",
    challenge: "Fonksiyon kaç kez kendi kendini çağırır?",
    code: `int adim(int n) {\n  if (n <= 1) return 0;\n  return adim(n / 2) + 1;\n}\nprintf("%d", adim(${input}));`,
    options: numberOptions(answer), answer: String(answer),
    hints: ["Her çağrıda n, tam sayı bölmesiyle ikiye ayrılır.", "n bir ya da daha küçük olduğunda çağrı durur.", "Duruş noktasına kadar kaç bölme yapıldığını say."],
  };
}

const builders = [sequentialTask, copyTask, conditionTask, loopCountTask, accumulationTask, arrayAccessTask, arrayUpdateTask, functionTask, nestedLoopTask, recursionTask] as const;

export function getTrace100Task(step: number, variant = 0): Trace100Task {
  const normalizedStep = Math.min(100, Math.max(1, Math.trunc(step)));
  const normalizedVariant = Math.max(0, Math.trunc(variant)) % 3;
  const builder = builders[Math.floor((normalizedStep - 1) / 10)];
  const task = builder(normalizedStep, normalizedVariant);
  return {
    ...task,
    options: placeAnswer(task.options, task.answer, normalizedStep, normalizedVariant),
    code: `${task.code}\n// iz sürme adımı: ${toStep(normalizedStep)}`,
  };
}

export const trace100Tasks = Array.from({ length: 100 }, (_, index) => getTrace100Task(index + 1));
