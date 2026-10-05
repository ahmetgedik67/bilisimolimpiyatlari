ALTER TABLE `learnerProfiles` ADD `gradeLevel` enum('5','6','7') DEFAULT '5' NOT NULL;--> statement-breakpoint
ALTER TABLE `learnerProfiles` ADD `track` enum('explorer','innovator','designer') DEFAULT 'explorer' NOT NULL;--> statement-breakpoint
ALTER TABLE `localAccounts` ADD `campusKey` varchar(32) DEFAULT 'kosuyolu' NOT NULL;