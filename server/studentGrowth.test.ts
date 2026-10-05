import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const loginSource = readFileSync(new URL("../client/src/pages/Login.tsx", import.meta.url), "utf8");
const dashboardSource = readFileSync(new URL("../client/src/pages/TeacherDashboard.tsx", import.meta.url), "utf8");
const growthSource = readFileSync(new URL("../client/src/components/StudentGrowthDashboard.tsx", import.meta.url), "utf8");
const robiImageSource = readFileSync(new URL("../client/src/components/RobiImage.tsx", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");

describe("Robi ve gelişim yüzeyleri", () => {
  it("oturum açık hesap ekranında ve öğretmen panelinde Robi’yi erişilebilir biçimde render eder", () => {
    expect(loginSource).toContain("import { ROBI_IMAGE, robiMessages } from \"@/lib/robiGuide\";");
    expect(loginSource).toContain('aria-label="Robi hesap rehberi"');
    expect(dashboardSource).toContain('aria-label="Robi öğretmen rehberi"');
    expect(dashboardSource).toContain("ROBI_IMAGE");
  });

  it("öğrenci gelişimini gerçek profil değerlerinden ilerleme çubuklarıyla gösterir", () => {
    expect(growthSource).toContain('aria-label={`${skill.label} ilerlemesi`}');
    expect(growthSource).toContain('aria-valuenow={percent}');
    expect(growthSource).toContain("completedMissionIds");
    expect(growthSource).toContain("merakPuani");
    expect(growthSource).toContain("dailyStorageKey");
    expect(growthSource).toContain("Bugünün görevi");
    expect(growthSource).toContain("trpc.learning.dailyTask.useQuery");
    expect(growthSource).toContain("trpc.learning.completeDailyTask.useMutation");
  });

  it("görsel yüklenmese bile Robi’nin erişilebilir yedek kartını gösterir", () => {
    expect(robiImageSource).toContain("onError={() => setFailed(true)}");
    expect(robiImageSource).toContain('aria-label={`${alt}; görsel yüklenemedi`}');
    expect(robiImageSource).toContain("robi-image-fallback");
    expect(routerSource).toContain("Günlük görev yalnız öğrenci hesaplarına açıktır.");
  });

  it("öğretmen panelinde kazanım basamakları ve açılır öğrenci ayrıntısı sunar", () => {
    expect(dashboardSource).toContain("Kazanım görünümü");
    expect(dashboardSource).toContain("aria-expanded={expandedStudentId === student.userId}");
    expect(dashboardSource).toContain("Robi’nin önerisi");
  });
});
