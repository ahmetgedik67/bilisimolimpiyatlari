import { describe, expect, it } from "vitest";
import { ROBI_IMAGE, robiLessonPrompts, robiMessages } from "../client/src/lib/robiGuide";

describe("Robi rehber içeriği", () => {
  it("kalıcı görseli ve altı ünite için sonuç vermeyen yönlendirmeleri tanımlar", () => {
    expect(ROBI_IMAGE).toBe("/assets/robi.jpeg");
    expect(Object.keys(robiLessonPrompts)).toHaveLength(6);
    expect(Object.values(robiLessonPrompts).every((prompt) => prompt.length > 30)).toBe(true);
    expect(robiMessages.task.body.toLowerCase()).toContain("yanıtı söylemem");
  });
});

import { shouldSimulateFailure } from "../client/src/components/RobiImage";

describe("Robi görsel hata simülasyonu", () => {
  it("normal sunucu ortamında pasif kalır", () => {
    expect(shouldSimulateFailure()).toBe(false);
  });

  it("qaRobiFallback=1 ile kontrollü tarayıcı testi açılır", () => {
    const previousWindow = (globalThis as { window?: unknown }).window;
    (globalThis as { window?: unknown }).window = { location: { search: "?qaRobiFallback=1" } };
    expect(shouldSimulateFailure()).toBe(true);
    (globalThis as { window?: unknown }).window = previousWindow;
  });
});
