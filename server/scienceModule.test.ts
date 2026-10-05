import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("Bilim ve Zekâ kutlama ve öğretmen analizi sözleşmesi", () => {
  const page = readFileSync(new URL("../client/src/pages/ScienceReasoning.tsx", import.meta.url), "utf8");
  const router = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
  const db = readFileSync(new URL("./db.ts", import.meta.url), "utf8");
  const teacher = readFileSync(new URL("../client/src/pages/TeacherDashboard.tsx", import.meta.url), "utf8");

  it("konfetiyi yalnız doğru cevapta gösterir ve erişilebilir canlı durum kullanır", () => {
    expect(page).toContain("setCelebrate(true)");
    expect(page).toContain("option === question.answer");
    expect(page).toContain('role="status"');
    expect(page).toContain('aria-live="polite"');
    expect(page).toContain("science-confetti");
    expect(page).toContain("playCorrectSound");
    expect(page).toContain("Sesi kapat");
    expect(page).toContain("İpucu · 5 puan");
  });

  it("sonuç kaydı öğrenciyle, analiz sorgusu öğretmen yetkisiyle sınırlıdır", () => {
    expect(db).toContain("correctQuestionIds.size * 10");
    expect(db).toContain('"bilim-zeka-ustasi"');
    expect(db).toContain("getScienceLeaderboard");
    expect(router).toContain("scienceTop20: publicProcedure");
    expect(router).toContain("recordScienceResult: protectedProcedure");
    expect(router).toContain("Bilim ve Zekâ sonuçları yalnız öğrenci hesaplarına açıktır.");
    expect(router).toContain("scienceAnalysis: protectedProcedure");
    expect(router).toContain("getTeacherScienceAnalysis(ctx.user.id, input ?? {})");
    expect(db).toContain("scienceResults");
    expect(teacher).toContain("En çok zorlanılan beceriler");
    const leaderboard = readFileSync(new URL("../client/src/components/LeaderboardTop20.tsx", import.meta.url), "utf8");
    const profile = readFileSync(new URL("../client/src/pages/Login.tsx", import.meta.url), "utf8");
    expect(leaderboard).toContain("Bilim ve Zekâ");
    expect(leaderboard).toContain("personal");
    expect(leaderboard).toContain("senin sıran");
    expect(profile).toContain("scienceProgress");
    expect(profile).toContain("Rozet için");
    expect(teacher).toContain("Sınıfların genel karşılaştırması");
    expect(db).toContain("averageScore");
    expect(db).toContain("successRate");
    expect(db).toContain("scienceHintUses");
    expect(db).toContain("Bu soruda ipucu zaten kullanıldı.");
    expect(router).toContain("useScienceHint: protectedProcedure");
    expect(teacher).toContain("bilim-zeka-sinif-analizi.csv");
    expect(teacher).toContain("csvCell");
    expect(leaderboard).toContain("scienceTop20");
    expect(profile).toContain("Bilim ve Zekâ Ustası");
  });
});
