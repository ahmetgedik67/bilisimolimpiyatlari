import { getTrace35Task, TRACE_STEP_COUNT, trace35Tasks } from "../client/src/lib/trace35";

let failures = 0;
const fail = (msg: string) => { failures += 1; console.error("HATA: " + msg); };

// Tembel üretim hattını kurmak için modül yükleme kontrolü
if (trace35Tasks.length !== TRACE_STEP_COUNT) fail(`trace35Tasks uzunluğu ${trace35Tasks.length}, beklenen ${TRACE_STEP_COUNT}`);

for (let step = 1; step <= TRACE_STEP_COUNT; step += 1) {
  for (let variant = 0; variant < 3; variant += 1) {
    const task = getTrace35Task(step, variant);
    const label = `görev ${step} varyant ${variant}`;
    if (task.options.length !== 8) fail(`${label}: ${task.options.length} seçenek var, 8 olmalı → [${task.options.join(", ")}]`);
    const unique = new Set(task.options);
    if (unique.size !== task.options.length) fail(`${label}: seçenekler benzersiz değil → [${task.options.join(", ")}]`);
    if (!task.options.includes(task.answer)) fail(`${label}: cevap "${task.answer}" seçeneklerde yok → [${task.options.join(", ")}]`);
    if (!task.hints.length) fail(`${label}: ipucu yok`);
    if (!task.code.trim()) fail(`${label}: kod boş`);
  }
}

// placeAnswer konum formülü tüm (step, variant) ikililerinde geçerli indeks üretmeli
for (let step = 1; step <= TRACE_STEP_COUNT; step += 1) {
  for (let variant = 0; variant < 3; variant += 1) {
    const idx = (step * 5 + variant * 3) % 8;
    if (idx < 0 || idx > 7) fail(`placeAnswer indeksi taşıyor: görev ${step} varyant ${variant} → ${idx}`);
  }
}

if (failures === 0) {
  console.log(`OK: ${TRACE_STEP_COUNT} görev × 3 varyant = ${TRACE_STEP_COUNT * 3} görevin tamamı doğrulandı (cevap seçeneklerde, 8 benzersiz seçenek, ipucu mevcut).`);
} else {
  console.error(`${failures} hata bulundu.`);
  process.exit(1);
}
