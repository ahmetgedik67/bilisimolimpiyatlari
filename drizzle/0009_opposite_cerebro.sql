CREATE TABLE `scienceHintUses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`questionId` varchar(32) NOT NULL,
	`penalty` int NOT NULL DEFAULT 5,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scienceHintUses_id` PRIMARY KEY(`id`),
	CONSTRAINT `scienceHintUses_userId_questionId_unique` UNIQUE(`userId`,`questionId`)
);
