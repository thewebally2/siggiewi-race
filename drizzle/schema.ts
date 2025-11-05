import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Race editions (e.g., 2024, 2025)
 */
export const raceEditions = mysqlTable("raceEditions", {
  id: int("id").primaryKey().autoincrement(),
  year: int("year").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  status: mysqlEnum("status", ["draft", "published", "completed", "archived"]).default("draft").notNull(),
  heroImage: varchar("heroImage", { length: 500 }),
  charityName: varchar("charityName", { length: 255 }),
  charityDescription: text("charityDescription"),
  registrationOpen: boolean("registrationOpen").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type RaceEdition = typeof raceEditions.$inferSelect;
export type InsertRaceEdition = typeof raceEditions.$inferInsert;

/**
 * Race categories (5km, 1.5km, 500m)
 */
export const raceCategories = mysqlTable("raceCategories", {
  id: int("id").primaryKey().autoincrement(),
  editionId: int("editionId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  distance: varchar("distance", { length: 50 }).notNull(),
  description: text("description"),
  priceInCents: int("priceInCents").notNull().default(0),
  ageGroup: varchar("ageGroup", { length: 100 }),
  maxParticipants: int("maxParticipants"),
  startTime: varchar("startTime", { length: 20 }),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type RaceCategory = typeof raceCategories.$inferSelect;
export type InsertRaceCategory = typeof raceCategories.$inferInsert;

/**
 * Race routes with GPX files
 */
export const raceRoutes = mysqlTable("raceRoutes", {
  id: int("id").primaryKey().autoincrement(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  distance: varchar("distance", { length: 50 }),
  gpxFileUrl: varchar("gpxFileUrl", { length: 500 }),
  mapImageUrl: varchar("mapImageUrl", { length: 500 }),
  elevationGain: int("elevationGain"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type RaceRoute = typeof raceRoutes.$inferSelect;
export type InsertRaceRoute = typeof raceRoutes.$inferInsert;

/**
 * Participant registrations
 */
export const registrations = mysqlTable("registrations", {
  id: int("id").primaryKey().autoincrement(),
  editionId: int("editionId").notNull(),
  categoryId: int("categoryId").notNull(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  surname: varchar("surname", { length: 255 }).notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  club: varchar("club", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  dateOfBirth: timestamp("dateOfBirth"),
  gender: mysqlEnum("gender", ["male", "female"]),
  tshirtSize: varchar("tshirtSize", { length: 10 }),
  emergencyContact: varchar("emergencyContact", { length: 255 }),
  emergencyPhone: varchar("emergencyPhone", { length: 50 }),
  bibNumber: int("bibNumber"),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  paymentIntentId: varchar("paymentIntentId", { length: 255 }),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  amountPaidInCents: int("amountPaidInCents").default(0),
  registrationDate: timestamp("registrationDate").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = typeof registrations.$inferInsert;

/**
 * Race results
 */
export const raceResults = mysqlTable("raceResults", {
  id: int("id").primaryKey().autoincrement(),
  editionId: int("editionId").notNull(),
  categoryId: int("categoryId").notNull(),
  registrationId: int("registrationId"),
  participantName: varchar("participantName", { length: 255 }).notNull(),
  bibNumber: int("bibNumber"),
  finishTime: varchar("finishTime", { length: 20 }),
  position: int("position"),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  ageCategory: varchar("ageCategory", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type RaceResult = typeof raceResults.$inferSelect;
export type InsertRaceResult = typeof raceResults.$inferInsert;

/**
 * CMS content pages
 */
export const contentPages = mysqlTable("contentPages", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type ContentPage = typeof contentPages.$inferSelect;
export type InsertContentPage = typeof contentPages.$inferInsert;

/**
 * Photo gallery for previous editions
 */
export const galleryImages = mysqlTable("galleryImages", {
  id: int("id").primaryKey().autoincrement(),
  editionId: int("editionId").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  caption: text("caption"),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = typeof galleryImages.$inferInsert;

