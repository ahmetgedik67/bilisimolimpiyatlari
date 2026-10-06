import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { BILFEN_CAMPUS_KEYS, STUDENT_GRADE_LEVELS, STUDENT_TRACKS } from "@shared/campuses";
import {
  changeLocalAccountPassword,
  completeLearnerMission,
  createLocalAccount,
  createTeacherAssignment,
  createTeacherAssignments,
  getLearningDashboard,
  getLocalAccountByUserId,
  getLocalAccountByUsername,
  getStudentAssignments,
  getStudentPractice,
  recordStudentPractice,
  spendStudentHint,
  getManagedStudentAccount,
  getOrCreateDailyTask,
  completeDailyTask,
  getTeacherStudentProgress,
  getUserById,
  recordLearningResult,
  updateLearnerAgeBand,
  updateLearnerAvatar,
  getPublicLeaderboard,
  getScienceLeaderboard,
  recordScienceResult,
  useScienceHint,
  getTeacherScienceAnalysis,
  updateManagedStudentGroup,
  bulkUpdateManagedStudentGroup,
  bulkCreateManagedStudents,
  getCampusComparisonReport,
} from "./db";
import { calculateTrialScore } from "./learning";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { hashPassword, isValidUsername, normalizeUsername, verifyPassword } from "./localAuth";

const missionInput = z.enum([
  "iz-surme",
  "bellek-kutulari",
  "karar-kapilari",
  "tekrar-parkuru",
  "dizi-kiyisi",
  "kural-makinesi",
  "deneme-ussu",
]);
const traceStepInput = z.string().regex(/^iz-surme35-\d{3}$/, "Geçerli bir iz sürme görevi seçilmelidir.");
const usernameInput = z.string().trim().min(3).max(48).transform(normalizeUsername).refine(isValidUsername, "Kullanıcı adı yalnız küçük harf, rakam, nokta, alt çizgi ve tire içerebilir.");
const passwordInput = z.string().min(8, "Parola en az 8 karakter olmalıdır.").max(128);
const campusKeyInput = z.enum(BILFEN_CAMPUS_KEYS);
const gradeLevelInput = z.enum(STUDENT_GRADE_LEVELS);
const trackInput = z.enum(STUDENT_TRACKS);
const avatarKeyInput = z.enum([
  "robot-blue", "fox-coral", "owl-gold", "cat-teal", "panda-ink", "penguin-sky", "lion-coral", "rabbit-mint", "dolphin-blue", "koala-sage",
  "bee-honey", "turtle-teal", "panda-coral", "star-gold", "comet-violet", "leaf-green", "moon-navy", "gem-rose", "mountain-slate", "spark-cyan",
]);

async function requireTeacher(userId: number, role: "user" | "admin") {
  if (role === "admin") return null;
  const account = await getLocalAccountByUserId(userId);
  if (!account || account.accountRole !== "teacher" || !account.isActive) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Bu işlem yalnız öğretmen hesaplarına açıktır." });
  }
  return account;
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  leaderboard: router({
    top20: publicProcedure.query(() => getPublicLeaderboard()),
    scienceTop20: publicProcedure.query(({ ctx }) => getScienceLeaderboard(ctx.user?.id)),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  account: router({
    login: publicProcedure
      .input(z.object({ username: usernameInput, password: passwordInput }))
      .mutation(async ({ ctx, input }) => {
        const account = await getLocalAccountByUsername(input.username);
        // Öğrenci girişi kalıcı olarak kapalıdır; platform yalnız eğitim içeriği olarak paylaşılır.
        if (!account || account.accountRole === "student" || !account.isActive || !(await verifyPassword(input.password, account.passwordHash))) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Kullanıcı adı veya parola hatalı." });
        }
        const user = await getUserById(account.userId);
        if (!user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Hesap bulunamadı." });
        const token = await sdk.createSessionToken(user.openId, { expiresInMs: 1000 * 60 * 60 * 12, name: user.name ?? account.username });
        ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: 1000 * 60 * 60 * 12 });
        return { user: { id: user.id, name: user.name }, account: { username: account.username, role: account.accountRole, mustChangePassword: account.mustChangePassword } };
      }),
    status: protectedProcedure.query(async ({ ctx }) => {
      const account = await getLocalAccountByUserId(ctx.user.id);
      return account ? { username: account.username, role: account.accountRole, campusKey: account.campusKey, mustChangePassword: account.mustChangePassword, isActive: account.isActive } : null;
    }),
    changePassword: protectedProcedure
      .input(z.object({ currentPassword: passwordInput, newPassword: passwordInput }))
      .mutation(async ({ ctx, input }) => {
        const account = await getLocalAccountByUserId(ctx.user.id);
        if (!account) throw new TRPCError({ code: "FORBIDDEN", message: "Bu hesap için parola değişikliği kullanılamıyor." });
        if (!(await verifyPassword(input.currentPassword, account.passwordHash))) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Mevcut parola doğru değil." });
        }
        await changeLocalAccountPassword(ctx.user.id, await hashPassword(input.newPassword), false);
        return { success: true } as const;
      }),
  }),
  admin: router({
    campusReport: adminProcedure.input(z.object({ from: z.coerce.date().optional(), to: z.coerce.date().optional() }).optional()).query(({ input }) => getCampusComparisonReport(input)),
  }),
  teacher: router({
    students: protectedProcedure.query(async ({ ctx }) => {
      await requireTeacher(ctx.user.id, ctx.user.role);
      return getTeacherStudentProgress(ctx.user.id);
    }),
    scienceAnalysis: protectedProcedure.input(z.object({ gradeLevel: gradeLevelInput.optional(), track: trackInput.optional() }).optional()).query(async ({ ctx, input }) => {
      await requireTeacher(ctx.user.id, ctx.user.role);
      return getTeacherScienceAnalysis(ctx.user.id, input ?? {});
    }),
    updateStudentGroup: protectedProcedure.input(z.object({ studentUserId: z.number().int().positive(), gradeLevel: gradeLevelInput, track: trackInput })).mutation(async ({ ctx, input }) => {
      await requireTeacher(ctx.user.id, ctx.user.role);
      const updated = await updateManagedStudentGroup(ctx.user.id, input.studentUserId, input.gradeLevel, input.track);
      if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Bu öğrenci hesabı öğretmen kampüsünüzde bulunamadı." });
      return updated;
    }),
    bulkUpdateStudentGroup: protectedProcedure.input(z.object({ studentUserIds: z.array(z.number().int().positive()).min(1).max(100), gradeLevel: gradeLevelInput, track: trackInput })).mutation(async ({ ctx, input }) => {
      await requireTeacher(ctx.user.id, ctx.user.role);
      return bulkUpdateManagedStudentGroup(ctx.user.id, input.studentUserIds, input.gradeLevel, input.track);
    }),
    bulkCreateStudents: protectedProcedure.input(z.object({ rows: z.array(z.object({ displayName: z.string().trim().min(2).max(120), username: usernameInput, temporaryPassword: passwordInput, gradeLevel: gradeLevelInput, track: trackInput })).min(1).max(100) })).mutation(async ({ ctx, input }) => {
      const teacher = await requireTeacher(ctx.user.id, ctx.user.role);
      const rows = await Promise.all(input.rows.map(async row => ({ ...row, passwordHash: await hashPassword(row.temporaryPassword) })));
      return bulkCreateManagedStudents(ctx.user.id, teacher?.campusKey ?? "kosuyolu", rows);
    }),
    createStudent: protectedProcedure
      .input(z.object({ displayName: z.string().trim().min(2).max(120), username: usernameInput, temporaryPassword: passwordInput, campusKey: campusKeyInput.default("kosuyolu"), gradeLevel: gradeLevelInput.default("5"), track: trackInput.default("explorer") }))
      .mutation(async ({ ctx, input }) => {
        const teacher = await requireTeacher(ctx.user.id, ctx.user.role);
        const created = await createLocalAccount({
          displayName: input.displayName,
          username: input.username,
          passwordHash: await hashPassword(input.temporaryPassword),
          accountRole: "student",
          managedByUserId: ctx.user.id,
          campusKey: teacher?.campusKey ?? input.campusKey,
          gradeLevel: input.gradeLevel,
          track: input.track,
        });
        return { userId: created.user.id, username: created.account.username };
      }),
    assignMission: protectedProcedure
      .input(z.object({ studentUserId: z.number().int().positive(), missionId: missionInput, note: z.string().trim().min(3).max(240) }))
      .mutation(async ({ ctx, input }) => {
        await requireTeacher(ctx.user.id, ctx.user.role);
        const assignment = await createTeacherAssignment(ctx.user.id, input.studentUserId, input.missionId, input.note);
        if (!assignment) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Atama oluşturulamadı." });
        return assignment;
      }),
    assignMissionToClass: protectedProcedure
      .input(z.object({ studentUserIds: z.array(z.number().int().positive()).min(1).max(100), missionId: missionInput, note: z.string().trim().min(3).max(240) }))
      .mutation(async ({ ctx, input }) => {
        await requireTeacher(ctx.user.id, ctx.user.role);
        return createTeacherAssignments(ctx.user.id, input.studentUserIds, input.missionId, input.note);
      }),
    resetStudentPassword: protectedProcedure
      .input(z.object({ studentUserId: z.number().int().positive(), temporaryPassword: passwordInput }))
      .mutation(async ({ ctx, input }) => {
        await requireTeacher(ctx.user.id, ctx.user.role);
        const student = await getManagedStudentAccount(ctx.user.id, input.studentUserId);
        if (!student) throw new TRPCError({ code: "NOT_FOUND", message: "Öğrenci hesabı bulunamadı." });
        await changeLocalAccountPassword(student.userId, await hashPassword(input.temporaryPassword), true);
        return { success: true } as const;
      }),
    createTeacher: adminProcedure
      .input(z.object({ displayName: z.string().trim().min(2).max(120), username: usernameInput, temporaryPassword: passwordInput, campusKey: campusKeyInput }))
      .mutation(async ({ input }) => {
        const created = await createLocalAccount({
          displayName: input.displayName,
          username: input.username,
          passwordHash: await hashPassword(input.temporaryPassword),
          accountRole: "teacher",
          campusKey: input.campusKey,
        });
        return { userId: created.user.id, username: created.account.username };
      }),
  }),
  learning: router({
    profile: protectedProcedure.query(({ ctx }) => getLearningDashboard(ctx.user.id)),
    practice: protectedProcedure.query(async ({ ctx }) => {
      const account = await getLocalAccountByUserId(ctx.user.id);
      if (!account || account.accountRole !== "student" || !account.isActive) throw new TRPCError({ code: "FORBIDDEN", message: "Çalışma ritmi yalnız öğrenci hesaplarına açıktır." });
      return getStudentPractice(ctx.user.id);
    }),
    recordPractice: protectedProcedure.mutation(async ({ ctx }) => {
      const account = await getLocalAccountByUserId(ctx.user.id);
      if (!account || account.accountRole !== "student" || !account.isActive) throw new TRPCError({ code: "FORBIDDEN", message: "Çalışma serisi yalnız öğrenci hesaplarına açıktır." });
      return recordStudentPractice(ctx.user.id);
    }),
    spendHint: protectedProcedure.mutation(async ({ ctx }) => {
      const account = await getLocalAccountByUserId(ctx.user.id);
      if (!account || account.accountRole !== "student" || !account.isActive) throw new TRPCError({ code: "FORBIDDEN", message: "İpucu bütçesi yalnız öğrenci hesaplarına açıktır." });
      return spendStudentHint(ctx.user.id);
    }),
    assignments: protectedProcedure.query(async ({ ctx }) => {
      const account = await getLocalAccountByUserId(ctx.user.id);
      if (!account || account.accountRole !== "student" || !account.isActive) throw new TRPCError({ code: "FORBIDDEN", message: "Atamalar yalnız öğrenci hesaplarına açıktır." });
      return getStudentAssignments(ctx.user.id);
    }),
    dailyTask: protectedProcedure
      .input(z.object({ taskDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), missionId: z.string().min(3).max(48) }))
      .query(async ({ ctx, input }) => {
        const account = await getLocalAccountByUserId(ctx.user.id);
        if (!account || account.accountRole !== "student" || !account.isActive) throw new TRPCError({ code: "FORBIDDEN", message: "Günlük görev yalnız öğrenci hesaplarına açıktır." });
        return getOrCreateDailyTask(ctx.user.id, input.taskDate, input.missionId);
      }),
    completeDailyTask: protectedProcedure
      .input(z.object({ taskDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), missionId: z.string().min(3).max(48) }))
      .mutation(async ({ ctx, input }) => {
        const account = await getLocalAccountByUserId(ctx.user.id);
        if (!account || account.accountRole !== "student" || !account.isActive) throw new TRPCError({ code: "FORBIDDEN", message: "Günlük görev yalnız öğrenci hesaplarına açıktır." });
        return completeDailyTask(ctx.user.id, input.taskDate, input.missionId);
      }),
    setAgeBand: protectedProcedure
      .input(z.object({ ageBand: z.enum(["5-6", "7-8"]) }))
      .mutation(({ ctx, input }) => updateLearnerAgeBand(ctx.user.id, input.ageBand)),
    setAvatar: protectedProcedure
      .input(z.object({ avatarKey: avatarKeyInput }))
      .mutation(async ({ ctx, input }) => {
        const account = await getLocalAccountByUserId(ctx.user.id);
        if (!account || account.accountRole !== "student" || !account.isActive) throw new TRPCError({ code: "FORBIDDEN", message: "Avatar seçimi yalnız öğrenci hesaplarına açıktır." });
        return updateLearnerAvatar(ctx.user.id, input.avatarKey);
      }),
    recordScienceResult: protectedProcedure
      .input(z.object({ questionId: z.string().min(3).max(32), skill: z.string().min(2).max(64), isCorrect: z.boolean(), durationSeconds: z.number().int().min(0).max(7200) }))
      .mutation(async ({ ctx, input }) => {
        const account = await getLocalAccountByUserId(ctx.user.id);
        if (!account || account.accountRole !== "student" || !account.isActive) throw new TRPCError({ code: "FORBIDDEN", message: "Bilim ve Zekâ sonuçları yalnız öğrenci hesaplarına açıktır." });
        return recordScienceResult(ctx.user.id, input);
      }),
    useScienceHint: protectedProcedure
      .input(z.object({ questionId: z.string().min(3).max(32) }))
      .mutation(async ({ ctx, input }) => {
        const account = await getLocalAccountByUserId(ctx.user.id);
        if (!account || account.accountRole !== "student" || !account.isActive) throw new TRPCError({ code: "FORBIDDEN", message: "Bilim ipucu yalnız öğrenci hesaplarına açıktır." });
        return useScienceHint(ctx.user.id, input.questionId);
      }),
    completeMission: protectedProcedure
      .input(z.object({ missionId: missionInput, durationSeconds: z.number().int().min(0).max(7200), isCorrect: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        if (input.isCorrect) await completeLearnerMission(ctx.user.id, input.missionId, 15);
        return recordLearningResult(ctx.user.id, {
          activityType: "mission",
          activityKey: input.missionId,
          correctCount: input.isCorrect ? 1 : 0,
          wrongCount: input.isCorrect ? 0 : 1,
          blankCount: 0,
          durationSeconds: input.durationSeconds,
          netMilli: input.isCorrect ? 1000 : 0,
        });
      }),
    completeTraceStep: protectedProcedure
      .input(z.object({ traceStepId: traceStepInput, durationSeconds: z.number().int().min(0).max(7200), isCorrect: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        if (input.isCorrect) await completeLearnerMission(ctx.user.id, input.traceStepId, 2);
        return recordLearningResult(ctx.user.id, {
          activityType: "mission",
          activityKey: input.traceStepId,
          correctCount: input.isCorrect ? 1 : 0,
          wrongCount: input.isCorrect ? 0 : 1,
          blankCount: 0,
          durationSeconds: input.durationSeconds,
          netMilli: input.isCorrect ? 1000 : 0,
        });
      }),
    submitTrial: protectedProcedure
      .input(z.object({ correctCount: z.number().int().min(0).max(5), wrongCount: z.number().int().min(0).max(5), blankCount: z.number().int().min(0).max(5), durationSeconds: z.number().int().min(0).max(7200) }))
      .mutation(({ ctx, input }) => {
        if (input.correctCount + input.wrongCount + input.blankCount !== 5) throw new Error("Deneme sonucu beş soruyu kapsamalıdır.");
        const score = calculateTrialScore(input.correctCount, input.wrongCount, input.blankCount);
        return recordLearningResult(ctx.user.id, {
          activityType: "trial",
          activityKey: "olimpiyat-mini-01",
          ...score,
          durationSeconds: input.durationSeconds,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
