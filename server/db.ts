import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, dailyTasks, learnerBadges, learnerProfiles, learningResults, localAccounts, scienceHintUses, scienceResults, studentPractice, teacherAssignments, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { deriveBadgeKeys, mergeMissionCompletion } from "./learning";

let _db: PostgresJsDatabase | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      // Supabase connection pooler (transaction mode) requires "prepare: false".
      _db = drizzle(postgres(process.env.DATABASE_URL, { prepare: false }));
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Hesap sistemi şu anda kullanılamıyor.");
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result[0] ?? null;
}

export async function getLocalAccountByUsername(username: string) {
  const db = await getDb();
  if (!db) throw new Error("Hesap sistemi şu anda kullanılamıyor.");
  const result = await db.select().from(localAccounts).where(eq(localAccounts.username, username)).limit(1);
  return result[0] ?? null;
}

export async function getLocalAccountByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Hesap sistemi şu anda kullanılamıyor.");
  const result = await db.select().from(localAccounts).where(eq(localAccounts.userId, userId)).limit(1);
  return result[0] ?? null;
}

type CreateLocalAccountInput = {
  username: string;
  displayName: string;
  passwordHash: string;
  accountRole: "teacher" | "student";
  managedByUserId?: number | null;
  campusKey?: string;
  gradeLevel?: "5" | "6" | "7";
  track?: "explorer" | "innovator" | "designer";
};

export async function createLocalAccount(input: CreateLocalAccountInput) {
  const db = await getDb();
  if (!db) throw new Error("Hesap sistemi şu anda kullanılamıyor.");
  const existing = await db.select({ id: localAccounts.id }).from(localAccounts).where(eq(localAccounts.username, input.username)).limit(1);
  if (existing[0]) throw new Error("Bu kullanıcı adı zaten kullanılıyor.");

  const openId = `local:${input.username}`;
  await db.insert(users).values({
    openId,
    name: input.displayName,
    loginMethod: "local",
    role: "user",
    lastSignedIn: new Date(),
  });
  const createdUser = await getUserByOpenId(openId);
  if (!createdUser) throw new Error("Hesap kullanıcısı oluşturulamadı.");

  await db.insert(localAccounts).values({
    userId: createdUser.id,
    username: input.username,
    passwordHash: input.passwordHash,
    accountRole: input.accountRole,
    managedByUserId: input.managedByUserId ?? null,
    campusKey: input.campusKey ?? "kosuyolu",
    mustChangePassword: true,
  });
  const account = await getLocalAccountByUserId(createdUser.id);
  if (!account) throw new Error("Yerel hesap oluşturulamadı.");
  if (input.accountRole === "student") await ensureLearnerProfile(createdUser.id, { gradeLevel: input.gradeLevel, track: input.track });
  return { user: createdUser, account };
}

export async function changeLocalAccountPassword(userId: number, passwordHash: string, mustChangePassword: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Hesap sistemi şu anda kullanılamıyor.");
  await db.update(localAccounts).set({ passwordHash, mustChangePassword }).where(eq(localAccounts.userId, userId));
  return getLocalAccountByUserId(userId);
}

export async function getStudentPractice(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Çalışma durumu şu anda kullanılamıyor.");
  const existing = await db.select().from(studentPractice).where(eq(studentPractice.userId, userId)).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(studentPractice).values({ userId, hintBudget: 3, streak: 0 });
  const created = await db.select().from(studentPractice).where(eq(studentPractice.userId, userId)).limit(1);
  return created[0];
}

export async function recordStudentPractice(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Çalışma durumu şu anda kullanılamıyor.");
  const current = await getStudentPractice(userId);
  const today = new Date().toISOString().slice(0, 10);
  if (current?.lastPracticeDate === today) return current;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak = current?.lastPracticeDate === yesterday ? (current.streak + 1) : 1;
  await db.update(studentPractice).set({ hintBudget: 3, streak, lastPracticeDate: today }).where(eq(studentPractice.userId, userId));
  return getStudentPractice(userId);
}

export async function spendStudentHint(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Çalışma durumu şu anda kullanılamıyor.");
  const current = await getStudentPractice(userId);
  if (!current || current.hintBudget <= 0) return current;
  await db.update(studentPractice).set({ hintBudget: current.hintBudget - 1 }).where(eq(studentPractice.userId, userId));
  return getStudentPractice(userId);
}

export async function createTeacherAssignments(teacherUserId: number, studentUserIds: number[], missionId: string, note: string) {
  const db = await getDb();
  if (!db) throw new Error("Atama sistemi şu anda kullanılamıyor.");
  const managed = await Promise.all(studentUserIds.map(studentUserId => getManagedStudentAccount(teacherUserId, studentUserId)));
  if (managed.some(student => !student)) throw new Error("Atama listesinde sınıfınıza bağlı olmayan öğrenci var.");
  await db.insert(teacherAssignments).values(studentUserIds.map(studentUserId => ({ teacherUserId, studentUserId, missionId, note, status: "assigned" as const })));
  return { count: studentUserIds.length };
}

export async function createTeacherAssignment(teacherUserId: number, studentUserId: number, missionId: string, note: string) {
  const db = await getDb();
  if (!db) throw new Error("Atama sistemi şu anda kullanılamıyor.");
  const managed = await getManagedStudentAccount(teacherUserId, studentUserId);
  if (!managed) throw new Error("Bu öğrenci sizin sınıfınıza bağlı değil.");
  await db.insert(teacherAssignments).values({ teacherUserId, studentUserId, missionId, note, status: "assigned" });
  const created = await db.select().from(teacherAssignments).where(and(eq(teacherAssignments.teacherUserId, teacherUserId), eq(teacherAssignments.studentUserId, studentUserId))).orderBy(desc(teacherAssignments.createdAt)).limit(1);
  return created[0] ?? null;
}

export async function recordScienceResult(userId: number, input: { questionId: string; skill: string; isCorrect: boolean; durationSeconds: number }) {
  const db = await getDb();
  if (!db) throw new Error("Bilim ve Zekâ sonucu şu anda kaydedilemiyor.");
  await db.insert(scienceResults).values({ userId, ...input });
  const entries = await db.select({ questionId: scienceResults.questionId, isCorrect: scienceResults.isCorrect }).from(scienceResults).where(eq(scienceResults.userId, userId));
  const correctQuestionIds = new Set(entries.filter(entry => entry.isCorrect).map(entry => entry.questionId));
  const scienceScore = correctQuestionIds.size * 10;
  const badgeAwarded = correctQuestionIds.size >= 20 ? await awardSpecificBadge(userId, "bilim-zeka-ustasi") : false;
  return { success: true, scienceScore, badgeAwarded } as const;
}

export async function useScienceHint(userId: number, questionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Bilim ipucu şu anda kullanılamıyor.");
  return db.transaction(async tx => {
    const alreadyUsed = await tx.select({ id: scienceHintUses.id }).from(scienceHintUses).where(and(eq(scienceHintUses.userId, userId), eq(scienceHintUses.questionId, questionId))).limit(1);
    if (alreadyUsed[0]) return { success: false, penalty: 0, scienceScore: 0, reason: "Bu soruda ipucu zaten kullanıldı." } as const;
    const [scienceEntries, usedHints] = await Promise.all([
      tx.select({ questionId: scienceResults.questionId, isCorrect: scienceResults.isCorrect }).from(scienceResults).where(eq(scienceResults.userId, userId)),
      tx.select({ penalty: scienceHintUses.penalty }).from(scienceHintUses).where(eq(scienceHintUses.userId, userId)),
    ]);
    const correctCount = new Set(scienceEntries.filter(entry => entry.isCorrect).map(entry => entry.questionId)).size;
    const currentScore = correctCount * 10 - usedHints.reduce((total, hint) => total + hint.penalty, 0);
    const penalty = 5;
    if (currentScore < penalty) return { success: false, penalty: 0, scienceScore: currentScore, reason: "İpucu için en az 5 Bilim ve Zekâ puanı gerekir." } as const;
    await tx.insert(scienceHintUses).values({ userId, questionId, penalty });
    return { success: true, penalty, scienceScore: currentScore - penalty } as const;
  });
}

export async function getScienceLeaderboard(viewerUserId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Bilim ve Zekâ sıralaması şu anda kullanılamıyor.");
  const students = await db.select({ userId: localAccounts.userId, displayName: users.name, username: localAccounts.username, avatarKey: learnerProfiles.avatarKey })
    .from(localAccounts)
    .innerJoin(users, eq(users.id, localAccounts.userId))
    .innerJoin(learnerProfiles, eq(learnerProfiles.userId, localAccounts.userId))
    .where(and(eq(localAccounts.accountRole, "student"), eq(localAccounts.isActive, true)));
  const entries = await db.select({ userId: scienceResults.userId, questionId: scienceResults.questionId, isCorrect: scienceResults.isCorrect }).from(scienceResults);
  const correctByUser = new Map<number, Set<string>>();
  for (const entry of entries) {
    if (!entry.isCorrect) continue;
    const correct = correctByUser.get(entry.userId) ?? new Set<string>();
    correct.add(entry.questionId);
    correctByUser.set(entry.userId, correct);
  }
  const ranked = students.map(student => ({ ...student, scienceScore: (correctByUser.get(student.userId)?.size ?? 0) * 10, name: maskStudentDisplayName(student.displayName, student.username) }))
    .sort((a, b) => b.scienceScore - a.scienceScore || a.userId - b.userId);
  const format = (student: (typeof ranked)[number], rank: number) => ({ rank, name: student.name, avatarKey: student.avatarKey, score: student.scienceScore });
  const personalIndex = viewerUserId === undefined ? -1 : ranked.findIndex(student => student.userId === viewerUserId);
  return {
    entries: ranked.slice(0, 20).map((student, index) => format(student, index + 1)),
    personal: personalIndex >= 0 ? format(ranked[personalIndex], personalIndex + 1) : null,
  };
}

export async function getTeacherScienceAnalysis(teacherUserId: number, filters: { gradeLevel?: "5" | "6" | "7"; track?: "explorer" | "innovator" | "designer" } = {}) {
  const db = await getDb();
  if (!db) throw new Error("Bilim ve Zekâ analizi şu anda kullanılamıyor.");
  const students = await db.select({       userId: localAccounts.userId, displayName: users.name, username: localAccounts.username, campusKey: localAccounts.campusKey, ageBand: learnerProfiles.ageBand, gradeLevel: learnerProfiles.gradeLevel, track: learnerProfiles.track })
    .from(localAccounts)
    .innerJoin(users, eq(users.id, localAccounts.userId))
    .innerJoin(learnerProfiles, eq(learnerProfiles.userId, localAccounts.userId))
    .where(and(eq(localAccounts.accountRole, "student"), eq(localAccounts.managedByUserId, teacherUserId), eq(localAccounts.isActive, true)));
  const filteredStudents = students.filter(student => (!filters.gradeLevel || student.gradeLevel === filters.gradeLevel) && (!filters.track || student.track === filters.track));
  if (!filteredStudents.length) return { students: [], skills: [], bands: [] };

  const studentResults = await Promise.all(filteredStudents.map(async student => ({ student, results: await db.select().from(scienceResults).where(eq(scienceResults.userId, student.userId)) })));
  const skillMap = new Map<string, { skill: string; attempts: number; wrong: number; correct: number }>();
  const studentRows = studentResults.map(({ student, results: entries }) => {
    for (const entry of entries) { const current = skillMap.get(entry.skill) ?? { skill: entry.skill, attempts: 0, wrong: 0, correct: 0 }; current.attempts += 1; current.wrong += entry.isCorrect ? 0 : 1; current.correct += entry.isCorrect ? 1 : 0; skillMap.set(entry.skill, current); }
    const uniqueCorrect = new Set(entries.filter(entry => entry.isCorrect).map(entry => entry.questionId)).size;
    return { userId: student.userId, name: maskStudentDisplayName(student.displayName, student.username), campusKey: student.campusKey, ageBand: student.ageBand, gradeLevel: student.gradeLevel, track: student.track, attempts: entries.length, correct: entries.filter(entry => entry.isCorrect).length, wrong: entries.filter(entry => !entry.isCorrect).length, uniqueCorrect, score: uniqueCorrect * 10 };
  });
  const bandMap = new Map<string, { campusKey: string; gradeLevel: string; track: string; students: number; totalScore: number; totalCorrect: number }>();
  for (const row of studentRows) {
    const key = `${row.campusKey}:${row.gradeLevel}:${row.track}`;
    const current = bandMap.get(key) ?? { campusKey: row.campusKey, gradeLevel: row.gradeLevel, track: row.track, students: 0, totalScore: 0, totalCorrect: 0 };
    current.students += 1;
    current.totalScore += row.score;
    current.totalCorrect += row.uniqueCorrect;
    bandMap.set(key, current);
  }
  const bands = Array.from(bandMap.values()).sort((a, b) => a.gradeLevel.localeCompare(b.gradeLevel) || a.track.localeCompare(b.track)).map(band => ({ campusKey: band.campusKey, gradeLevel: band.gradeLevel, track: band.track, label: `${band.gradeLevel}. sınıf · ${band.track}`, students: band.students, averageScore: Math.round(band.totalScore / band.students), successRate: Math.round(band.totalCorrect / (band.students * 20) * 100) }));
  return { students: studentRows, skills: Array.from(skillMap.values()).sort((a, b) => b.wrong - a.wrong || b.attempts - a.attempts), bands };
}

export async function updateManagedStudentGroup(teacherUserId: number, studentUserId: number, gradeLevel: "5" | "6" | "7", track: "explorer" | "innovator" | "designer") {
  const student = await getManagedStudentAccount(teacherUserId, studentUserId);
  if (!student) return null;
  await ensureLearnerProfile(studentUserId, { gradeLevel, track });
  const db = await getDb();
  if (!db) throw new Error("Öğrenci grubu şu anda güncellenemiyor.");
  await db.update(learnerProfiles).set({ gradeLevel, track }).where(eq(learnerProfiles.userId, studentUserId));
  return { success: true, studentUserId, gradeLevel, track } as const;
}

export async function bulkUpdateManagedStudentGroup(teacherUserId: number, studentUserIds: number[], gradeLevel: "5" | "6" | "7", track: "explorer" | "innovator" | "designer") {
  const results: Array<{ studentUserId: number; success: boolean }> = [];
  for (const studentUserId of studentUserIds) {
    const updated = await updateManagedStudentGroup(teacherUserId, studentUserId, gradeLevel, track);
    results.push({ studentUserId, success: Boolean(updated) });
  }
  return results;
}

export async function bulkCreateManagedStudents(teacherUserId: number, teacherCampusKey: string, rows: Array<{ displayName: string; username: string; passwordHash: string; gradeLevel: "5" | "6" | "7"; track: "explorer" | "innovator" | "designer" }>) {
  const results: Array<{ row: number; username: string; success: boolean; message: string }> = [];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    try {
      await createLocalAccount({ ...row, accountRole: "student", managedByUserId: teacherUserId, campusKey: teacherCampusKey });
      results.push({ row: index + 2, username: row.username, success: true, message: "Oluşturuldu" });
    } catch (error) {
      results.push({ row: index + 2, username: row.username, success: false, message: error instanceof Error ? error.message : "Satır işlenemedi" });
    }
  }
  return results;
}

export async function getCampusComparisonReport(range?: { from?: Date; to?: Date }) {
  const db = await getDb();
  if (!db) throw new Error("Kampüs raporu şu anda kullanılamıyor.");
  const students = await db.select({ campusKey: localAccounts.campusKey, gradeLevel: learnerProfiles.gradeLevel, track: learnerProfiles.track, completedMissionIds: learnerProfiles.completedMissionIds, userId: localAccounts.userId }).from(localAccounts).innerJoin(learnerProfiles, eq(learnerProfiles.userId, localAccounts.userId)).where(and(eq(localAccounts.accountRole, "student"), eq(localAccounts.isActive, true)));
  const dateCondition = range?.from && range?.to ? and(gte(scienceResults.completedAt, range.from), lte(scienceResults.completedAt, range.to)) : range?.from ? gte(scienceResults.completedAt, range.from) : range?.to ? lte(scienceResults.completedAt, range.to) : undefined;
  const science = await db.select({ userId: scienceResults.userId, questionId: scienceResults.questionId, isCorrect: scienceResults.isCorrect }).from(scienceResults).where(dateCondition);
  const learningDateCondition = range?.from && range?.to ? and(gte(learningResults.completedAt, range.from), lte(learningResults.completedAt, range.to)) : range?.from ? gte(learningResults.completedAt, range.from) : range?.to ? lte(learningResults.completedAt, range.to) : undefined;
  const learning = await db.select({ userId: learningResults.userId, activityKey: learningResults.activityKey }).from(learningResults).where(learningDateCondition);
  const scienceByUser = new Map<number, Set<string>>();
  for (const entry of science) if (entry.isCorrect) scienceByUser.set(entry.userId, (scienceByUser.get(entry.userId) ?? new Set()).add(entry.questionId));
  const missionsByUser = new Map<number, Set<string>>();
  for (const entry of learning) missionsByUser.set(entry.userId, (missionsByUser.get(entry.userId) ?? new Set()).add(entry.activityKey));
  const map = new Map<string, { campusKey: string; students: number; totalAtlas: number; totalScience: number; totalCorrect: number }>();
  for (const student of students) {
    const completed = range ? missionsByUser.get(student.userId)?.size ?? 0 : (JSON.parse(student.completedMissionIds ?? "[]") as unknown[]).length;
    const scienceCorrect = scienceByUser.get(student.userId)?.size ?? 0;
    const current = map.get(student.campusKey) ?? { campusKey: student.campusKey, students: 0, totalAtlas: 0, totalScience: 0, totalCorrect: 0 };
    current.students += 1; current.totalAtlas += Math.min(100, Math.round(completed / 35 * 100)); current.totalScience += scienceCorrect * 10; current.totalCorrect += scienceCorrect; map.set(student.campusKey, current);
  }
  return Array.from(map.values()).map(row => ({ ...row, atlasCompletion: Math.round(row.totalAtlas / row.students), averageScienceScore: Math.round(row.totalScience / row.students), scienceSuccessRate: Math.round(row.totalCorrect / (row.students * 20) * 100) })).sort((a, b) => b.atlasCompletion - a.atlasCompletion || a.campusKey.localeCompare(b.campusKey));
}

export async function getStudentAssignments(studentUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Atama sistemi şu anda kullanılamıyor.");
  return db.select().from(teacherAssignments).where(and(eq(teacherAssignments.studentUserId, studentUserId), eq(teacherAssignments.status, "assigned"))).orderBy(desc(teacherAssignments.createdAt)).limit(5);
}

export async function getTeacherStudentProgress(teacherUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Öğretmen görünümü şu anda kullanılamıyor.");
  const students = await db
    .select({
      userId: localAccounts.userId,
      username: localAccounts.username,
      displayName: users.name,
      mustChangePassword: localAccounts.mustChangePassword,
      isActive: localAccounts.isActive,
      ageBand: learnerProfiles.ageBand,
      gradeLevel: learnerProfiles.gradeLevel,
      track: learnerProfiles.track,
      campusKey: localAccounts.campusKey,
      merakPuani: learnerProfiles.merakPuani,
      completedMissionIds: learnerProfiles.completedMissionIds,
      lastActiveAt: learnerProfiles.lastActiveAt,
    })
    .from(localAccounts)
    .innerJoin(users, eq(users.id, localAccounts.userId))
    .leftJoin(learnerProfiles, eq(learnerProfiles.userId, localAccounts.userId))
    .where(and(eq(localAccounts.accountRole, "student"), eq(localAccounts.managedByUserId, teacherUserId)));

  return Promise.all(students.map(async student => {
    const [recent, latestTrial] = await Promise.all([
      db.select().from(learningResults).where(eq(learningResults.userId, student.userId)).orderBy(desc(learningResults.completedAt)).limit(1),
      db.select().from(learningResults).where(and(eq(learningResults.userId, student.userId), eq(learningResults.activityType, "trial"))).orderBy(desc(learningResults.completedAt)).limit(1),
    ]);
    const completed = JSON.parse(student.completedMissionIds ?? "[]") as unknown;
    return {
      ...student,
      completedCount: Array.isArray(completed) ? completed.length : 0,
      recentResult: recent[0] ?? null,
      latestTrial: latestTrial[0] ?? null,
    };
  }));
}

export async function getManagedStudentAccount(teacherUserId: number, studentUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Öğretmen görünümü şu anda kullanılamıyor.");
  const result = await db
    .select()
    .from(localAccounts)
    .where(and(eq(localAccounts.userId, studentUserId), eq(localAccounts.managedByUserId, teacherUserId), eq(localAccounts.accountRole, "student")))
    .limit(1);
  return result[0] ?? null;
}

export async function ensureLearnerProfile(userId: number, profileInput: { gradeLevel?: "5" | "6" | "7"; track?: "explorer" | "innovator" | "designer" } = {}) {
  const db = await getDb();
  if (!db) throw new Error("Öğrenme ilerlemesi şu anda kullanılamıyor.");

  const existing = await db.select().from(learnerProfiles).where(eq(learnerProfiles.userId, userId)).limit(1);
  if (existing[0]) return existing[0];

  await db.insert(learnerProfiles).values({
    userId,
    gradeLevel: profileInput.gradeLevel ?? "5",
    track: profileInput.track ?? "explorer",
    completedMissionIds: "[]",
  });

  const created = await db.select().from(learnerProfiles).where(eq(learnerProfiles.userId, userId)).limit(1);
  if (!created[0]) throw new Error("Öğrenme profili oluşturulamadı.");
  return created[0];
}

export async function getOrCreateDailyTask(userId: number, taskDate: string, missionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Günlük görev şu anda kullanılamıyor.");
  const existing = await db.select().from(dailyTasks).where(and(eq(dailyTasks.userId, userId), eq(dailyTasks.taskDate, taskDate))).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(dailyTasks).values({ userId, taskDate, missionId, completed: false });
  const created = await db.select().from(dailyTasks).where(and(eq(dailyTasks.userId, userId), eq(dailyTasks.taskDate, taskDate))).limit(1);
  if (!created[0]) throw new Error("Günlük görev oluşturulamadı.");
  return created[0];
}

export async function completeDailyTask(userId: number, taskDate: string, missionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Günlük görev şu anda kullanılamıyor.");
  const task = await getOrCreateDailyTask(userId, taskDate, missionId);
  if (!task.completed) await db.update(dailyTasks).set({ completed: true, completedAt: new Date() }).where(eq(dailyTasks.id, task.id));
  return getOrCreateDailyTask(userId, taskDate, missionId);
}

export async function updateLearnerAgeBand(userId: number, ageBand: "5-6" | "7-8") {
  const db = await getDb();
  if (!db) throw new Error("Öğrenme ilerlemesi şu anda kullanılamıyor.");
  await ensureLearnerProfile(userId);
  await db.update(learnerProfiles).set({ ageBand }).where(eq(learnerProfiles.userId, userId));
  return ensureLearnerProfile(userId);
}

export async function completeLearnerMission(userId: number, missionId: string, reward: number) {
  const db = await getDb();
  if (!db) throw new Error("Öğrenme ilerlemesi şu anda kullanılamıyor.");
  const profile = await ensureLearnerProfile(userId);
  const next = mergeMissionCompletion(profile.completedMissionIds, profile.merakPuani, missionId, reward);

  if (next.isNew) {
    await db
      .update(learnerProfiles)
      .set({ completedMissionIds: JSON.stringify(next.completedMissionIds), merakPuani: next.merakPuani })
      .where(eq(learnerProfiles.userId, userId));
  }

  const updatedProfile = await ensureLearnerProfile(userId);
  await awardEligibleBadges(userId, next.completedMissionIds.length, false);
  return updatedProfile;
}

type LearningResultInput = {
  activityType: "mission" | "trial";
  activityKey: string;
  correctCount: number;
  wrongCount: number;
  blankCount: number;
  durationSeconds: number;
  netMilli: number;
};

export async function recordLearningResult(userId: number, result: LearningResultInput) {
  const db = await getDb();
  if (!db) throw new Error("Öğrenme ilerlemesi şu anda kullanılamıyor.");
  await ensureLearnerProfile(userId);
  const previousAttempts = await db
    .select({ id: learningResults.id })
    .from(learningResults)
    .where(and(eq(learningResults.userId, userId), eq(learningResults.activityKey, result.activityKey)));
  await db.insert(learningResults).values({ userId, ...result, attemptNumber: previousAttempts.length + 1 });

  const profile = await ensureLearnerProfile(userId);
  const completedMissionIds = JSON.parse(profile.completedMissionIds) as unknown;
  const completedCount = Array.isArray(completedMissionIds) ? completedMissionIds.length : 0;
  await awardEligibleBadges(userId, completedCount, result.activityType === "trial");
  return getLearningDashboard(userId);
}

async function awardSpecificBadge(userId: number, badgeKey: string) {
  const db = await getDb();
  if (!db) return false;
  const existing = await db.select({ badgeKey: learnerBadges.badgeKey }).from(learnerBadges).where(and(eq(learnerBadges.userId, userId), eq(learnerBadges.badgeKey, badgeKey))).limit(1);
  if (existing[0]) return false;
  await db.insert(learnerBadges).values({ userId, badgeKey });
  return true;
}

async function awardEligibleBadges(userId: number, completedMissionCount: number, hasTrialResult: boolean) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select({ badgeKey: learnerBadges.badgeKey }).from(learnerBadges).where(eq(learnerBadges.userId, userId));
  const existingKeys = new Set(existing.map(item => item.badgeKey));
  const badgeKeys = deriveBadgeKeys(completedMissionCount, hasTrialResult);
  for (const badgeKey of badgeKeys) {
    if (!existingKeys.has(badgeKey)) await db.insert(learnerBadges).values({ userId, badgeKey });
  }
}

export async function updateLearnerAvatar(userId: number, avatarKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Öğrenme profili şu anda kullanılamıyor.");
  await ensureLearnerProfile(userId);
  await db.update(learnerProfiles).set({ avatarKey }).where(eq(learnerProfiles.userId, userId));
  return ensureLearnerProfile(userId);
}

export function maskStudentDisplayName(displayName: string | null | undefined, username: string) {
  const parts = (displayName ?? "").trim().split(/\s+/).filter(Boolean);
  const first = parts[0] || username.split(".")[0] || "Öğrenci";
  const last = parts.length > 1 ? parts[parts.length - 1] : "Öğrenci";
  const mask = (value: string) => `${Array.from(value).slice(0, 2).join("")}.....`;
  return `${mask(first)} ${mask(last)}`;
}

export async function getPublicLeaderboard() {
  const db = await getDb();
  if (!db) throw new Error("Genel sıralama şu anda kullanılamıyor.");
  const rows = await db
    .select({
      userId: users.id,
      username: localAccounts.username,
      displayName: users.name,
      merakPuani: learnerProfiles.merakPuani,
      avatarKey: learnerProfiles.avatarKey,
    })
    .from(localAccounts)
    .innerJoin(users, eq(users.id, localAccounts.userId))
    .innerJoin(learnerProfiles, eq(learnerProfiles.userId, localAccounts.userId))
    .where(and(eq(localAccounts.accountRole, "student"), eq(localAccounts.isActive, true)))
    .orderBy(desc(learnerProfiles.merakPuani), asc(users.id))
    .limit(20);

  return rows.map((row, index) => ({
    rank: index + 1,
    avatarKey: row.avatarKey,
    score: row.merakPuani,
    name: maskStudentDisplayName(row.displayName, row.username),
  }));
}

export async function getLearningDashboard(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Öğrenme ilerlemesi şu anda kullanılamıyor.");
  const profile = await ensureLearnerProfile(userId);
  const account = await getLocalAccountByUserId(userId);
  const [badges, results, scienceEntries] = await Promise.all([
    db.select().from(learnerBadges).where(eq(learnerBadges.userId, userId)).orderBy(desc(learnerBadges.awardedAt)),
    db.select().from(learningResults).where(eq(learningResults.userId, userId)).orderBy(desc(learningResults.completedAt)).limit(8),
    db.select({ questionId: scienceResults.questionId, isCorrect: scienceResults.isCorrect }).from(scienceResults).where(eq(scienceResults.userId, userId)),
  ]);
  const scienceCorrectCount = new Set(scienceEntries.filter(entry => entry.isCorrect).map(entry => entry.questionId)).size;
  return { profile, badges, results, studentGroup: { campusKey: account?.campusKey ?? "kosuyolu", gradeLevel: profile.gradeLevel, track: profile.track }, scienceProgress: { correctCount: scienceCorrectCount, total: 20, remaining: Math.max(0, 20 - scienceCorrectCount), score: scienceCorrectCount * 10 } };
}
