CREATE TYPE "public"."account_role" AS ENUM('teacher', 'student');--> statement-breakpoint
CREATE TYPE "public"."activity_type" AS ENUM('mission', 'trial');--> statement-breakpoint
CREATE TYPE "public"."age_band" AS ENUM('5-6', '7-8');--> statement-breakpoint
CREATE TYPE "public"."assignment_status" AS ENUM('assigned', 'completed');--> statement-breakpoint
CREATE TYPE "public"."grade_level" AS ENUM('5', '6', '7');--> statement-breakpoint
CREATE TYPE "public"."track" AS ENUM('explorer', 'innovator', 'designer');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "dailyTasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"taskDate" varchar(10) NOT NULL,
	"missionId" varchar(48) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learnerBadges" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"badgeKey" varchar(48) NOT NULL,
	"awardedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learnerProfiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"ageBand" "age_band" DEFAULT '5-6' NOT NULL,
	"gradeLevel" "grade_level" DEFAULT '5' NOT NULL,
	"track" "track" DEFAULT 'explorer' NOT NULL,
	"merakPuani" integer DEFAULT 0 NOT NULL,
	"avatarKey" varchar(32) DEFAULT 'robot-blue' NOT NULL,
	"completedMissionIds" text NOT NULL,
	"lastActiveAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "learnerProfiles_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "learningResults" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"activityType" "activity_type" NOT NULL,
	"activityKey" varchar(48) NOT NULL,
	"correctCount" integer DEFAULT 0 NOT NULL,
	"wrongCount" integer DEFAULT 0 NOT NULL,
	"blankCount" integer DEFAULT 0 NOT NULL,
	"attemptNumber" integer DEFAULT 1 NOT NULL,
	"durationSeconds" integer DEFAULT 0 NOT NULL,
	"netMilli" integer DEFAULT 0 NOT NULL,
	"completedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "localAccounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"username" varchar(48) NOT NULL,
	"passwordHash" varchar(255) NOT NULL,
	"accountRole" "account_role" NOT NULL,
	"managedByUserId" integer,
	"campusKey" varchar(32) DEFAULT 'kosuyolu' NOT NULL,
	"mustChangePassword" boolean DEFAULT true NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "localAccounts_userId_unique" UNIQUE("userId"),
	CONSTRAINT "localAccounts_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "scienceHintUses" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"questionId" varchar(32) NOT NULL,
	"penalty" integer DEFAULT 5 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scienceResults" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"questionId" varchar(32) NOT NULL,
	"skill" varchar(64) NOT NULL,
	"isCorrect" boolean NOT NULL,
	"durationSeconds" integer DEFAULT 0 NOT NULL,
	"completedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studentPractice" (
	"userId" integer PRIMARY KEY NOT NULL,
	"hintBudget" integer DEFAULT 3 NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"lastPracticeDate" varchar(10),
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacherAssignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"teacherUserId" integer NOT NULL,
	"studentUserId" integer NOT NULL,
	"missionId" varchar(48) NOT NULL,
	"note" varchar(240) NOT NULL,
	"status" "assignment_status" DEFAULT 'assigned' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "dailyTasks_userId_taskDate_unique" ON "dailyTasks" USING btree ("userId","taskDate");--> statement-breakpoint
CREATE UNIQUE INDEX "learnerBadges_userId_badgeKey_unique" ON "learnerBadges" USING btree ("userId","badgeKey");--> statement-breakpoint
CREATE UNIQUE INDEX "scienceHintUses_userId_questionId_unique" ON "scienceHintUses" USING btree ("userId","questionId");