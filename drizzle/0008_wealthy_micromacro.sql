CREATE TABLE `scienceResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`questionId` varchar(32) NOT NULL,
	`skill` varchar(64) NOT NULL,
	`isCorrect` boolean NOT NULL,
	`durationSeconds` int NOT NULL DEFAULT 0,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scienceResults_id` PRIMARY KEY(`id`)
);
