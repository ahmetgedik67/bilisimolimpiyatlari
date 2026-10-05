import { boolean, integer, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 *
 * Veri tabanı PostgreSQL / Supabase uyumludur.
 */
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const accountRoleEnum = pgEnum("account_role", ["teacher", "student"]);
export const assignmentStatusEnum = pgEnum("assignment_status", ["assigned", "completed"]);
export const ageBandEnum = pgEnum("age_band", ["5-6", "7-8"]);
export const gradeLevelEnum = pgEnum("grade_level", ["5", "6", "7"]);
export const trackEnum = pgEnum("track", ["explorer", "innovator", "designer"]);
export const activityTypeEnum = pgEnum("activity_type", ["mission", "trial"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Yerel eğitim hesapları OAuth kimliğinden ayrı tutulur. Parolanın kendisi
 * saklanmaz; yalnızca doğrulanmış parola özeti tutulur. Öğretmenler öğrenci
 * hesaplarını yönetir, öğrenciler ise yalnız kendi parolasını değiştirebilir.
 */
export const localAccounts = pgTable("localAccounts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().unique(),
  username: varchar("username", { length: 48 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  accountRole: accountRoleEnum("accountRole").notNull(),
  managedByUserId: integer("managedByUserId"),
  campusKey: varchar("campusKey", { length: 32 }).default("kosuyolu").notNull(),
  mustChangePassword: boolean("mustChangePassword").default(true).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type LocalAccount = typeof localAccounts.$inferSelect;

export const dailyTasks = pgTable(
  "dailyTasks",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull(),
    taskDate: varchar("taskDate", { length: 10 }).notNull(),
    missionId: varchar("missionId", { length: 48 }).notNull(),
    completed: boolean("completed").default(false).notNull(),
    completedAt: timestamp("completedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  table => [uniqueIndex("dailyTasks_userId_taskDate_unique").on(table.userId, table.taskDate)],
);

export type DailyTask = typeof dailyTasks.$inferSelect;

export const teacherAssignments = pgTable("teacherAssignments", {
  id: serial("id").primaryKey(),
  teacherUserId: integer("teacherUserId").notNull(),
  studentUserId: integer("studentUserId").notNull(),
  missionId: varchar("missionId", { length: 48 }).notNull(),
  note: varchar("note", { length: 240 }).notNull(),
  status: assignmentStatusEnum("status").default("assigned").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type TeacherAssignment = typeof teacherAssignments.$inferSelect;

export const studentPractice = pgTable("studentPractice", {
  userId: integer("userId").primaryKey(),
  hintBudget: integer("hintBudget").default(3).notNull(),
  streak: integer("streak").default(0).notNull(),
  lastPracticeDate: varchar("lastPracticeDate", { length: 10 }),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type StudentPractice = typeof studentPractice.$inferSelect;

/**
 * Kullanıcıya ait yalnızca öğrenme ilerlemesini tutar. Yaş, ad-soyad veya
 * cevap metni gibi ek öğrenci verileri saklanmaz; dersin çalışması için gerekli
 * olan seviye, görev listesi ve puan yeterlidir.
 */
export const learnerProfiles = pgTable("learnerProfiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().unique(),
  ageBand: ageBandEnum("ageBand").default("5-6").notNull(),
  gradeLevel: gradeLevelEnum("gradeLevel").default("5").notNull(),
  track: trackEnum("track").default("explorer").notNull(),
  merakPuani: integer("merakPuani").default(0).notNull(),
  avatarKey: varchar("avatarKey", { length: 32 }).default("robot-blue").notNull(),
  completedMissionIds: text("completedMissionIds").notNull(),
  lastActiveAt: timestamp("lastActiveAt").defaultNow().notNull().$onUpdate(() => new Date()),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LearnerProfile = typeof learnerProfiles.$inferSelect;
export type InsertLearnerProfile = typeof learnerProfiles.$inferInsert;

/** Kazanımlar; görev kimliği yerine öğrencinin eriştiği öğrenme eşiğini saklar. */
export const learnerBadges = pgTable(
  "learnerBadges",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull(),
    badgeKey: varchar("badgeKey", { length: 48 }).notNull(),
    awardedAt: timestamp("awardedAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("learnerBadges_userId_badgeKey_unique").on(table.userId, table.badgeKey)],
);

/**
 * Sorunun metnini ya da öğrencinin serbest cevaplarını tutmadan, yalnızca
 * görev sonucu özetini kaydeder. Böylece tekrar ve deneme ritmi izlenebilir.
 */
export const learningResults = pgTable("learningResults", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  activityType: activityTypeEnum("activityType").notNull(),
  activityKey: varchar("activityKey", { length: 48 }).notNull(),
  correctCount: integer("correctCount").default(0).notNull(),
  wrongCount: integer("wrongCount").default(0).notNull(),
  blankCount: integer("blankCount").default(0).notNull(),
  attemptNumber: integer("attemptNumber").default(1).notNull(),
  durationSeconds: integer("durationSeconds").default(0).notNull(),
  netMilli: integer("netMilli").default(0).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type LearnerBadge = typeof learnerBadges.$inferSelect;
export type LearningResult = typeof learningResults.$inferSelect;

/** Bilim ve Zekâ modülünde soru ve beceri bazlı öğretmen analizi için minimal sonuç özeti. */
export const scienceResults = pgTable("scienceResults", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  questionId: varchar("questionId", { length: 32 }).notNull(),
  skill: varchar("skill", { length: 64 }).notNull(),
  isCorrect: boolean("isCorrect").notNull(),
  durationSeconds: integer("durationSeconds").default(0).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type ScienceResult = typeof scienceResults.$inferSelect;

export const scienceHintUses = pgTable(
  "scienceHintUses",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull(),
    questionId: varchar("questionId", { length: 32 }).notNull(),
    penalty: integer("penalty").default(5).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("scienceHintUses_userId_questionId_unique").on(table.userId, table.questionId)],
);

export type ScienceHintUse = typeof scienceHintUses.$inferSelect;
