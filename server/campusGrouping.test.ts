import { describe, expect, it } from "vitest";
import { BILFEN_CAMPUSES, STUDENT_TRACK_LABELS } from "@shared/campuses";

describe("Bilfen kampüs ve öğrenci grubu sözleşmesi", () => {
  it("tüm kampüs anahtarlarını benzersiz ve görünen adlarla tanımlar", () => {
    const keys = BILFEN_CAMPUSES.map(campus => campus.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(BILFEN_CAMPUSES.length).toBe(19);
    expect(BILFEN_CAMPUSES.every(campus => campus.name.startsWith("BİLFEN "))).toBe(true);
  });

  it("ortaokul grup seçenekleri 5, 6, 7 ve üç alanı kapsar", () => {
    const grades = ["5", "6", "7"];
    const tracks = Object.keys(STUDENT_TRACK_LABELS);
    expect(grades).toHaveLength(3);
    expect(tracks).toEqual(["explorer", "innovator", "designer"]);
    expect(grades.flatMap(grade => tracks.map(track => `${grade}-${track}`))).toHaveLength(9);
  });
});
