import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const dashboardSource = readFileSync(new URL("../client/src/pages/TeacherDashboard.tsx", import.meta.url), "utf8");

describe("öğretmen paneli hesap oluşturma formları", () => {
  it("yeni yerel hesap parolaları için tarayıcıya yeni parola ipucu verir", () => {
    expect(dashboardSource).toContain('id="studentPassword" name="student-account-password" type="password" autoComplete="new-password"');
    expect(dashboardSource).toContain('id="teacherPassword" name="teacher-account-password" type="password" autoComplete="new-password"');
    expect(dashboardSource).toContain('name="reset-student-password" type="password" autoComplete="new-password"');
  });

  it("gerçek öğrenci atamasını rol korumalı mutasyona bağlar", () => {
    expect(dashboardSource).toContain("trpc.teacher.assignMission.useMutation");
    expect(dashboardSource).toContain("assignMission.mutate");
    expect(dashboardSource).toContain('aria-labelledby="atama-baslik"');
  });

  it("oluşturma kullanıcı adlarını kayıtlı giriş bilgilerinden ayırır", () => {
    expect(dashboardSource).toContain('name="student-account-username" autoComplete="off" autoCapitalize="none" spellCheck={false}');
    expect(dashboardSource).toContain('name="teacher-account-username" autoComplete="off" autoCapitalize="none" spellCheck={false}');
  });
});
