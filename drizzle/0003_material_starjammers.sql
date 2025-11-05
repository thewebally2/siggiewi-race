ALTER TABLE `registrations` MODIFY COLUMN `gender` enum('male','female');--> statement-breakpoint
ALTER TABLE `registrations` ADD `firstName` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `registrations` ADD `surname` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `registrations` ADD `club` varchar(255);