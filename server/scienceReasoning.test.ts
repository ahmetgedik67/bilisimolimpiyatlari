import { describe, expect, it } from "vitest";
import { SCIENCE_QUESTIONS } from "../client/src/lib/scienceQuestions";

describe("Bilim ve Zekâ ek modülü", () => {
  it("tam 20 özgün soru içerir ve her soruda sekiz seçenek bulunur", () => {
    expect(SCIENCE_QUESTIONS).toHaveLength(20);
    for (const question of SCIENCE_QUESTIONS) {
      expect(new Set(question.options).size).toBe(8);
      expect(question.options).toContain(question.answer);
      expect(question.hints).toHaveLength(3);
      expect(question.explanation.length).toBeGreaterThan(20);
    }
  });

  it("soru numaraları sıralıdır ve her soru özgün bir kimlik taşır", () => {
    expect(SCIENCE_QUESTIONS.map(question => question.number)).toEqual(
      Array.from({ length: 20 }, (_, index) => String(index + 1).padStart(2, "0")),
    );
    expect(new Set(SCIENCE_QUESTIONS.map(question => question.id)).size).toBe(20);
  });

  it("modül sayfası, navigasyon ve telif bağımsızlık notu ile bağlıdır", async () => {
    const { readFileSync } = await import("node:fs");
    const app = readFileSync(new URL("../client/src/App.tsx", import.meta.url), "utf8");
    const home = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
    const page = readFileSync(new URL("../client/src/pages/ScienceReasoning.tsx", import.meta.url), "utf8");
    expect(app).toContain('path={"/bilim-zeka"}');
    // Ana sayfadaki bağlantı base-path uyumlu (GitHub Pages alt yayını için BASE_URL önekli)
    expect(home).toContain("${import.meta.env.BASE_URL}bilim-zeka");
    expect(page).toContain("Bilge Kunduz/Bebras");
    expect(page).toContain("localStorage");
  });
});
