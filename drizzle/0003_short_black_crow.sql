CREATE TABLE `localAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`username` varchar(48) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`accountRole` enum('teacher','student') NOT NULL,
	`managedByUserId` int,
	`mustChangePassword` boolean NOT NULL DEFAULT true,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `localAccounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `localAccounts_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `localAccounts_username_unique` UNIQUE(`username`)
);
