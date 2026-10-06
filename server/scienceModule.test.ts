import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("Bilim ve Zekâ kutlama sözleşmesi", () => {
  const page = readFileSync(new URL("../client/src/pages/ScienceReasoning.tsx", import.meta.url), "utf8");
  const router = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
  const db = readFileSync(new URL("./db.ts", import.meta.url), "utf8");

  it("konfetiyi yalnız doğru cevapta gösterir ve erişilebilir canlı durum kullanır", () => {
    expect(page).toContain("setCelebrate(true)");
    expect(page).toContain("option === question.answer");
    expect(page).toContain('role="status"');
    expect(page).toContain('aria-live="polite"');
    expect(page).toContain("science-confetti");
    expect(page).toContain("playCorrectSound");
    expect(page).toContain("Sesi kapat");
    expect(page).toContain("İpucu göster");
  });

  it("modül girişsiz çalışır; kalan öğrenci uçları sunucuda rol korumalıdır", () => {
    expect(page).not.toContain("useScienceHint");
    expect(page).not.toContain("recordScienceResult");
    expect(page).toContain("localStorage");
    expect(db).toContain("correctQuestionIds.size * 10");
    expect(db).toContain('"bilim-zeka-ustasi"');
    expect(db).toContain("getScienceLeaderboard");
    expect(router).toContain("scienceTop20: publicProcedure");
    expect(router).toContain("recordScienceResult: protectedProcedure");
    expect(router).toContain("Bilim ve Zekâ sonuçları yalnız öğrenci hesaplarına açıktır.");
    expect(db).toContain("scienceResults");
    expect(db).toContain("scienceHintUses");
    expect(db).toContain("Bu soruda ipucu zaten kullanıldı.");
    expect(router).toContain("useScienceHint: protectedProcedure");
  });
});
