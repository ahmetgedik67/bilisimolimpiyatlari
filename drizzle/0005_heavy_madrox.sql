CREATE TABLE `teacherAssignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teacherUserId` int NOT NULL,
	`studentUserId` int NOT NULL,
	`missionId` varchar(48) NOT NULL,
	`note` varchar(240) NOT NULL,
	`status` enum('assigned','completed') NOT NULL DEFAULT 'assigned',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `teacherAssignments_id` PRIMARY KEY(`id`)
);
