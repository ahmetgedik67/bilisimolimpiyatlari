import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const loginSource = readFileSync(new URL("../client/src/pages/Login.tsx", import.meta.url), "utf8");

describe("yerel giriş formu", () => {
  it("kullanıcı seçimini korumak için kayıtlı oturum otomatik doldurmasını devre dışı bırakır", () => {
    expect(loginSource).toContain('<form onSubmit={submitLogin} autoComplete="off"');
    expect(loginSource).toContain('name="local-login-identifier" autoComplete="off" autoCapitalize="none" spellCheck={false}');
    expect(loginSource).toContain('name="local-login-secret" autoComplete="new-password" type="password"');
  });

  it("parola değiştirmede mevcut ve yeni parola alanlarını birbirinden ayırır", () => {
    expect(loginSource).toContain('name="local-current-password" autoComplete="current-password"');
    expect(loginSource).toContain('name="local-new-password" autoComplete="new-password"');
  });
});
