import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const robiImageSource = readFileSync(new URL("../client/src/components/RobiImage.tsx", import.meta.url), "utf8");

describe("Robi görsel erişilebilirliği", () => {
  it("görsel yüklenmese bile Robi'nin erişilebilir yedek kartını gösterir", () => {
    expect(robiImageSource).toContain("onError={() => setFailed(true)}");
    expect(robiImageSource).toContain('aria-label={`${alt}; görsel yüklenemedi`}');
    expect(robiImageSource).toContain("robi-image-fallback");
  });
});
