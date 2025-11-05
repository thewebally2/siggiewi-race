CREATE TABLE `contentPages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentPages_id` PRIMARY KEY(`id`),
	CONSTRAINT `contentPages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `galleryImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`editionId` int NOT NULL,
	`imageUrl` varchar(500) NOT NULL,
	`caption` text,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `galleryImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `raceCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`editionId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`distance` varchar(50) NOT NULL,
	`description` text,
	`priceInCents` int NOT NULL DEFAULT 0,
	`ageGroup` varchar(100),
	`maxParticipants` int,
	`startTime` varchar(20),
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `raceCategories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `raceEditions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`year` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`date` timestamp NOT NULL,
	`description` text,
	`location` varchar(255),
	`status` enum('draft','published','completed','archived') NOT NULL DEFAULT 'draft',
	`heroImage` varchar(500),
	`charityName` varchar(255),
	`charityDescription` text,
	`registrationOpen` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `raceEditions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `raceResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`editionId` int NOT NULL,
	`categoryId` int NOT NULL,
	`registrationId` int,
	`participantName` varchar(255) NOT NULL,
	`bibNumber` int,
	`finishTime` varchar(20),
	`position` int,
	`gender` enum('male','female','other'),
	`ageCategory` varchar(50),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `raceResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `raceRoutes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`distance` varchar(50),
	`gpxFileUrl` varchar(500),
	`mapImageUrl` varchar(500),
	`elevationGain` int,
	`description` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `raceRoutes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`editionId` int NOT NULL,
	`categoryId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`dateOfBirth` timestamp,
	`gender` enum('male','female','other'),
	`tshirtSize` varchar(10),
	`emergencyContact` varchar(255),
	`emergencyPhone` varchar(50),
	`bibNumber` int,
	`paymentStatus` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentIntentId` varchar(255),
	`amountPaidInCents` int DEFAULT 0,
	`registrationDate` timestamp DEFAULT (now()),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `registrations_id` PRIMARY KEY(`id`)
);
