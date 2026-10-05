import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { AVATAR_OPTIONS, getAvatar } from "../shared/avatars";
import { maskStudentDisplayName } from "./db";

const dbSource = readFileSync(new URL("./db.ts", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const loginSource = readFileSync(new URL("../client/src/pages/Login.tsx", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../client/src/components/LeaderboardTop20.tsx", import.meta.url), "utf8");

describe("İlk 20 ve profil avatarı sözleşmesi", () => {
  it("tam olarak 20 özgün avatar tanımlar ve bilinmeyen anahtarda güvenli varsayılan kullanır", () => {
    expect(AVATAR_OPTIONS).toHaveLength(20);
    expect(new Set(AVATAR_OPTIONS.map(avatar => avatar.key)).size).toBe(20);
    expect(AVATAR_OPTIONS.every(avatar => avatar.label && avatar.symbol && avatar.tone)).toBe(true);
    expect(getAvatar("bilinmeyen").key).toBe("robot-blue");
  });

  it("ad ve soyadı ilk iki karakterle anonimleştirir; Türkçe karakterleri korur", () => {
    expect(maskStudentDisplayName("Ahmet Gedik", "ahmet.gedik")).toBe("Ah..... Ge.....");
    expect(maskStudentDisplayName("Şule Öztürk", "sule.ozturk")).toBe("Şu..... Öz.....");
    expect(maskStudentDisplayName("Ada", "ada.tek")).toBe("Ad..... Öğ.....");
    expect(maskStudentDisplayName("  Mehmet   Ali   Yılmaz ", "mehmet.yilmaz")).toBe("Me..... Yı.....");
  });

  it("leaderboard sorgusu yalnız aktif öğrenci hesaplarını seçer ve puan/eşitlik sırasını sabitler", () => {
    expect(dbSource).toContain('eq(localAccounts.accountRole, "student")');
    expect(dbSource).toContain('eq(localAccounts.isActive, true)');
    expect(dbSource).toContain("desc(learnerProfiles.merakPuani), asc(users.id)");
    expect(dbSource).toContain(".limit(20)");
  });

  it("public leaderboard ve öğrenci avatar mutation’ı sözleşmede bulunur", () => {
    expect(routerSource).toContain("leaderboard: router");
    expect(routerSource).toContain("top20: publicProcedure");
    expect(routerSource).toContain("setAvatar: protectedProcedure");
    expect(routerSource).toContain("Avatar seçimi yalnız öğrenci hesaplarına açıktır.");
  });

  it("profil ekranı 20 seçeneği ve ana sayfa İlk 20 kartını erişilebilir adlarla sunar", () => {
    expect(loginSource).toContain("AVATAR_OPTIONS.map");
    expect(loginSource).toContain("aria-pressed");
    expect(loginSource).toContain("setAvatar.mutate");
    expect(homeSource).toContain('aria-labelledby="ilk-20-baslik"');
    expect(homeSource).toContain("aria-label={`");
    expect(homeSource).toContain("Sıralama şu anda yüklenemedi");
  });
});
