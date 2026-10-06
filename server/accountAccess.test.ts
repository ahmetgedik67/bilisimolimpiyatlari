import { beforeEach, describe, expect, it, vi } from "vitest";
import { COOKIE_NAME } from "../shared/const";
import { hashPassword } from "./localAuth";

const dbMock = vi.hoisted(() => ({
  changeLocalAccountPassword: vi.fn(),
  completeLearnerMission: vi.fn(),
  createLocalAccount: vi.fn(),
  getLearningDashboard: vi.fn(),
  getLocalAccountByUserId: vi.fn(),
  getLocalAccountByUsername: vi.fn(),
  getManagedStudentAccount: vi.fn(),
  getTeacherStudentProgress: vi.fn(),
  getUserById: vi.fn(),
  recordLearningResult: vi.fn(),
  updateLearnerAgeBand: vi.fn(),
}));

vi.mock("./db", () => dbMock);
vi.mock("./_core/sdk", () => ({ sdk: { createSessionToken: vi.fn().mockResolvedValue("signed-local-session") } }));

import { appRouter } from "./routers";

const localStudent = { id: 1, userId: 7, username: "ogrenci.1", passwordHash: "", accountRole: "student" as const, isActive: true, mustChangePassword: true, managedByUserId: 22, campusKey: "kosuyolu" as const };
const localTeacher = { id: 2, userId: 22, username: "ogretmen.1", passwordHash: "", accountRole: "teacher" as const, isActive: true, mustChangePassword: false, managedByUserId: null, campusKey: "kosuyolu" as const };

function context(user: any) {
  const cookies: Array<{ name: string; value: string }> = [];
  return {
    ctx: {
      user,
      req: { protocol: "https", headers: {} },
      res: { cookie: (name: string, value: string) => cookies.push({ name, value }), clearCookie: vi.fn() },
    } as any,
    cookies,
  };
}

describe("öğretmen ve öğrenci hesap erişimi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("öğretmenin doğru kullanıcı adı/parolasıyla imzalı yerel oturum oluşturur", async () => {
    localTeacher.passwordHash = await hashPassword("Atlas!2026");
    dbMock.getLocalAccountByUsername.mockResolvedValue(localTeacher);
    dbMock.getUserById.mockResolvedValue({ id: 22, openId: "local:ogretmen.1", name: "Ayşe Öğretmen" });
    const { ctx, cookies } = context(null);
    const result = await appRouter.createCaller(ctx).account.login({ username: "OGRETMEN.1", password: "Atlas!2026" });
    expect(result.account.role).toBe("teacher");
    expect(dbMock.getLocalAccountByUsername).toHaveBeenCalledWith("ogretmen.1");
    expect(cookies[0]).toMatchObject({ name: COOKIE_NAME, value: "signed-local-session" });
  });

  it("öğrenci hesabının girişini kalıcı olarak engeller", async () => {
    localStudent.passwordHash = await hashPassword("Atlas!2026");
    dbMock.getLocalAccountByUsername.mockResolvedValue(localStudent);
    const { ctx } = context(null);
    await expect(appRouter.createCaller(ctx).account.login({ username: "OGRENCI.1", password: "Atlas!2026" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(dbMock.getUserById).not.toHaveBeenCalled();
  });

  it("öğrenci hesabının öğretmen ilerleme listesini okumasını engeller", async () => {
    dbMock.getLocalAccountByUserId.mockResolvedValue(localStudent);
    const { ctx } = context({ id: 7, role: "user" });
    await expect(appRouter.createCaller(ctx).teacher.students()).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(dbMock.getTeacherStudentProgress).not.toHaveBeenCalled();
  });

  it("öğretmenin yalnız kendi kullanıcı kimliğiyle öğrenci özetini almasını sağlar", async () => {
    dbMock.getLocalAccountByUserId.mockResolvedValue(localTeacher);
    dbMock.getTeacherStudentProgress.mockResolvedValue([]);
    const { ctx } = context({ id: 22, role: "user" });
    await expect(appRouter.createCaller(ctx).teacher.students()).resolves.toEqual([]);
    expect(dbMock.getTeacherStudentProgress).toHaveBeenCalledWith(22);
  });

  it("öğretmenin oluşturduğu öğrenci hesabını kendi yönetim kimliğine bağlar", async () => {
    dbMock.getLocalAccountByUserId.mockResolvedValue(localTeacher);
    dbMock.createLocalAccount.mockResolvedValue({ user: { id: 81 }, account: { username: "yeni.ogrenci" } });
    const { ctx } = context({ id: 22, role: "user" });
    await expect(appRouter.createCaller(ctx).teacher.createStudent({ displayName: "Yeni Öğrenci", username: "YENI.OGRENCI", temporaryPassword: "Guvenli!2026", campusKey: "atasehir", gradeLevel: "6", track: "designer" })).resolves.toEqual({ userId: 81, username: "yeni.ogrenci" });
    expect(dbMock.createLocalAccount).toHaveBeenCalledWith(expect.objectContaining({
      username: "yeni.ogrenci",
      accountRole: "student",
      managedByUserId: 22,
      campusKey: "kosuyolu",
      gradeLevel: "6",
      track: "designer",
    }));
  });

  it("öğretmenin yönetmediği öğrenci için parola sıfırlamasını engeller", async () => {
    dbMock.getLocalAccountByUserId.mockResolvedValue(localTeacher);
    dbMock.getManagedStudentAccount.mockResolvedValue(null);
    const { ctx } = context({ id: 22, role: "user" });
    await expect(appRouter.createCaller(ctx).teacher.resetStudentPassword({ studentUserId: 99, temporaryPassword: "YeniParola!9" })).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(dbMock.changeLocalAccountPassword).not.toHaveBeenCalled();
  });

  it("öğretmenin kendi öğrencisinin geçici parolasını yenileyip zorunlu değişim işareti koymasını sağlar", async () => {
    dbMock.getLocalAccountByUserId.mockResolvedValue(localTeacher);
    dbMock.getManagedStudentAccount.mockResolvedValue(localStudent);
    dbMock.changeLocalAccountPassword.mockResolvedValue(localStudent);
    const { ctx } = context({ id: 22, role: "user" });
    await expect(appRouter.createCaller(ctx).teacher.resetStudentPassword({ studentUserId: 7, temporaryPassword: "YeniParola!9" })).resolves.toEqual({ success: true });
    expect(dbMock.changeLocalAccountPassword).toHaveBeenCalledWith(7, expect.stringMatching(/^scrypt\$/), true);
  });

  it("öğrencinin doğru mevcut parolayla kendi parolasını değiştirmesine izin verir", async () => {
    localStudent.passwordHash = await hashPassword("EskiParola!9");
    dbMock.getLocalAccountByUserId.mockResolvedValue(localStudent);
    dbMock.changeLocalAccountPassword.mockResolvedValue(localStudent);
    const { ctx } = context({ id: 7, role: "user" });
    await expect(appRouter.createCaller(ctx).account.changePassword({ currentPassword: "EskiParola!9", newPassword: "YeniParola!9" })).resolves.toEqual({ success: true });
    expect(dbMock.changeLocalAccountPassword).toHaveBeenCalledWith(7, expect.stringMatching(/^scrypt\$/), false);
  });
});
