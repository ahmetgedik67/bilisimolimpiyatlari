CREATE TABLE `studentPractice` (
	`userId` int NOT NULL,
	`hintBudget` int NOT NULL DEFAULT 3,
	`streak` int NOT NULL DEFAULT 0,
	`lastPracticeDate` varchar(10),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studentPractice_userId` PRIMARY KEY(`userId`)
);
