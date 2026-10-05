import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const dbSource = readFileSync(new URL("./db.ts", import.meta.url), "utf8");

describe("öğretmen görev ataması", () => {
  it("öğretmen mutasyonunu korumalı sahiplik doğrulamasına bağlar", () => {
    expect(routerSource).toContain("assignMission");
    expect(routerSource).toContain("assignMissionToClass");
    expect(routerSource).toContain('z.array(z.number().int().positive()).min(1).max(100)');
    expect(routerSource).toContain("requireTeacher(ctx.user.id, ctx.user.role)");
    expect(dbSource).toContain("getManagedStudentAccount(teacherUserId, studentUserId)");
  });

  it("öğrenci sorgusunu yalnız aktif öğrenci hesabına açar", () => {
    expect(routerSource).toContain('account.accountRole !== "student" || !account.isActive');
    expect(routerSource).toContain("getStudentAssignments(ctx.user.id)");
    expect(dbSource).toContain('eq(teacherAssignments.status, "assigned")');
    expect(routerSource).toContain("recordPractice");
    expect(routerSource).toContain("spendHint");
  });
});
