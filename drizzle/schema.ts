import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Yerel eğitim hesapları OAuth kimliğinden ayrı tutulur. Parolanın kendisi
 * saklanmaz; yalnızca doğrulanmış parola özeti tutulur. Öğretmenler öğrenci
 * hesaplarını yönetir, öğrenciler ise yalnız kendi parolasını değiştirebilir.
 */
export const localAccounts = mysqlTable("localAccounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  username: varchar("username", { length: 48 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  accountRole: mysqlEnum("accountRole", ["teacher", "student"]).notNull(),
  managedByUserId: int("managedByUserId"),
  campusKey: varchar("campusKey", { length: 32 }).default("kosuyolu").notNull(),
  mustChangePassword: boolean("mustChangePassword").default(true).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LocalAccount = typeof localAccounts.$inferSelect;

export const dailyTasks = mysqlTable(
  "dailyTasks",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    taskDate: varchar("taskDate", { length: 10 }).notNull(),
    missionId: varchar("missionId", { length: 48 }).notNull(),
    completed: boolean("completed").default(false).notNull(),
    completedAt: timestamp("completedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("dailyTasks_userId_taskDate_unique").on(table.userId, table.taskDate)],
);

export type DailyTask = typeof dailyTasks.$inferSelect;

export const teacherAssignments = mysqlTable("teacherAssignments", {
  id: int("id").autoincrement().primaryKey(),
  teacherUserId: int("teacherUserId").notNull(),
  studentUserId: int("studentUserId").notNull(),
  missionId: varchar("missionId", { length: 48 }).notNull(),
  note: varchar("note", { length: 240 }).notNull(),
  status: mysqlEnum("status", ["assigned", "completed"]).default("assigned").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type TeacherAssignment = typeof teacherAssignments.$inferSelect;

export const studentPractice = mysqlTable("studentPractice", {
  userId: int("userId").primaryKey(),
  hintBudget: int("hintBudget").default(3).notNull(),
  streak: int("streak").default(0).notNull(),
  lastPracticeDate: varchar("lastPracticeDate", { length: 10 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudentPractice = typeof studentPractice.$inferSelect;

/**
 * Kullanıcıya ait yalnızca öğrenme ilerlemesini tutar. Yaş, ad-soyad veya
 * cevap metni gibi ek öğrenci verileri saklanmaz; dersin çalışması için gerekli
 * olan seviye, görev listesi ve puan yeterlidir.
 */
export const learnerProfiles = mysqlTable("learnerProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  ageBand: mysqlEnum("ageBand", ["5-6", "7-8"]).default("5-6").notNull(),
  gradeLevel: mysqlEnum("gradeLevel", ["5", "6", "7"]).default("5").notNull(),
  track: mysqlEnum("track", ["explorer", "innovator", "designer"]).default("explorer").notNull(),
  merakPuani: int("merakPuani").default(0).notNull(),
    avatarKey: varchar("avatarKey", { length: 32 }).default("robot-blue").notNull(),
    completedMissionIds: text("completedMissionIds").notNull(),
  lastActiveAt: timestamp("lastActiveAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LearnerProfile = typeof learnerProfiles.$inferSelect;
export type InsertLearnerProfile = typeof learnerProfiles.$inferInsert;

/** Kazanımlar; görev kimliği yerine öğrencinin eriştiği öğrenme eşiğini saklar. */
export const learnerBadges = mysqlTable(
  "learnerBadges",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    badgeKey: varchar("badgeKey", { length: 48 }).notNull(),
    awardedAt: timestamp("awardedAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("learnerBadges_userId_badgeKey_unique").on(table.userId, table.badgeKey)],
);

/**
 * Sorunun metnini ya da öğrencinin serbest cevaplarını tutmadan, yalnızca
 * görev sonucu özetini kaydeder. Böylece tekrar ve deneme ritmi izlenebilir.
 */
export const learningResults = mysqlTable("learningResults", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  activityType: mysqlEnum("activityType", ["mission", "trial"]).notNull(),
  activityKey: varchar("activityKey", { length: 48 }).notNull(),
  correctCount: int("correctCount").default(0).notNull(),
  wrongCount: int("wrongCount").default(0).notNull(),
  blankCount: int("blankCount").default(0).notNull(),
  attemptNumber: int("attemptNumber").default(1).notNull(),
  durationSeconds: int("durationSeconds").default(0).notNull(),
  netMilli: int("netMilli").default(0).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type LearnerBadge = typeof learnerBadges.$inferSelect;
export type LearningResult = typeof learningResults.$inferSelect;

/** Bilim ve Zekâ modülünde soru ve beceri bazlı öğretmen analizi için minimal sonuç özeti. */
export const scienceResults = mysqlTable("scienceResults", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  questionId: varchar("questionId", { length: 32 }).notNull(),
  skill: varchar("skill", { length: 64 }).notNull(),
  isCorrect: boolean("isCorrect").notNull(),
  durationSeconds: int("durationSeconds").default(0).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type ScienceResult = typeof scienceResults.$inferSelect;

export const scienceHintUses = mysqlTable(
  "scienceHintUses",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    questionId: varchar("questionId", { length: 32 }).notNull(),
    penalty: int("penalty").default(5).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("scienceHintUses_userId_questionId_unique").on(table.userId, table.questionId)],
);

export type ScienceHintUse = typeof scienceHintUses.$inferSelect;
