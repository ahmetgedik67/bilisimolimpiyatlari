import { describe, expect, it } from "vitest";
import { hashPassword, isValidUsername, normalizeUsername, verifyPassword } from "./localAuth";

describe("yerel hesap parola güvenliği", () => {
  it("parolayı scrypt özeti olarak saklar ve doğru parolayı doğrular", async () => {
    const encoded = await hashPassword("Atlas!2026");
    expect(encoded).toMatch(/^scrypt\$[a-f0-9]+\$[a-f0-9]+$/);
    await expect(verifyPassword("Atlas!2026", encoded)).resolves.toBe(true);
    await expect(verifyPassword("yanlis-parola", encoded)).resolves.toBe(false);
  });

  it("kullanıcı adını normalleştirir ve güvenli karakter kümesini zorunlu tutar", () => {
    expect(normalizeUsername("  Ada.Soyad  ")).toBe("ada.soyad");
    expect(isValidUsername("ada.soyad")).toBe(true);
    expect(isValidUsername("Ad Soyad")).toBe(false);
    expect(isValidUsername("ab")).toBe(false);
  });
});
