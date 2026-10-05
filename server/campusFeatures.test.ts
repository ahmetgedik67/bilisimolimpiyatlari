import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const teacherSource = readFileSync(new URL("../client/src/pages/TeacherDashboard.tsx", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../client/src/App.tsx", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");

describe("kampüs özellikleri kaynak sözleşmesi", () => {
  it("Bilim ve Zekâ sorgusunu roster grup filtresine bağlar", () => {
    expect(teacherSource).toContain("scienceFilter");
    expect(teacherSource).toContain("trpc.teacher.scienceAnalysis.useQuery(scienceFilter");
  });

  it("öğretmen grup düzenleme ve CSV aktarım kontrollerini içerir", () => {
    expect(teacherSource).toContain("updateStudentGroup");
    expect(teacherSource).toContain("bulkCreateStudents");
    expect(teacherSource).toContain('accept=".csv,text/csv"');
    expect(teacherSource).toContain("downloadStudentTemplate");
    expect(teacherSource).toContain("csvPreviewRows");
    expect(teacherSource).toContain("Önizlemeyi onayla ve aktar");
    expect(teacherSource).toContain("existingUsernames");
    expect(teacherSource).toContain("zaten mevcut");
  });

  it("admin kampüs raporu rotasını ve prosedürünü içerir", () => {
    expect(routerSource).toContain("campusReport");
    expect(appSource).toContain('path={"/kampus-raporu"}');
    const report = readFileSync(new URL("../client/src/pages/CampusReport.tsx", import.meta.url), "utf8");
    expect(report).toContain("fromDate");
    expect(report).toContain("previousPeriodInput");
    expect(routerSource).toContain("bulkUpdateStudentGroup");
    expect(report).toContain("scienceDelta");
    expect(report).toContain("Bilim/Zekâ · Önceki");
    expect(teacherSource).toContain("showBulkConfirmation");
    expect(teacherSource).toContain("Onayla ve güncelle");
  });
});
