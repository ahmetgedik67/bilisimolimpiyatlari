CREATE TABLE `dailyTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`taskDate` varchar(10) NOT NULL,
	`missionId` varchar(48) NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailyTasks_id` PRIMARY KEY(`id`),
	CONSTRAINT `dailyTasks_userId_taskDate_unique` UNIQUE(`userId`,`taskDate`)
);
