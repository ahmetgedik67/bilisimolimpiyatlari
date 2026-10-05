CREATE TABLE `learnerBadges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeKey` varchar(48) NOT NULL,
	`awardedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `learnerBadges_id` PRIMARY KEY(`id`),
	CONSTRAINT `learnerBadges_userId_badgeKey_unique` UNIQUE(`userId`,`badgeKey`)
);
--> statement-breakpoint
CREATE TABLE `learningResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`activityType` enum('mission','trial') NOT NULL,
	`activityKey` varchar(48) NOT NULL,
	`correctCount` int NOT NULL DEFAULT 0,
	`wrongCount` int NOT NULL DEFAULT 0,
	`blankCount` int NOT NULL DEFAULT 0,
	`durationSeconds` int NOT NULL DEFAULT 0,
	`netMilli` int NOT NULL DEFAULT 0,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `learningResults_id` PRIMARY KEY(`id`)
);
