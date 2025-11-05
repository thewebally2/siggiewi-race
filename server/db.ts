import { eq, and, or, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  raceEditions, InsertRaceEdition,
  raceCategories, InsertRaceCategory,
  raceRoutes, InsertRaceRoute,
  registrations, InsertRegistration,
  raceResults, InsertRaceResult,
  contentPages, InsertContentPage,
  galleryImages, InsertGalleryImage
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Race Editions
export async function getAllRaceEditions() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(raceEditions).orderBy(desc(raceEditions.year));
}

export async function getPublishedRaceEditions() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(raceEditions)
    .where(or(
      eq(raceEditions.status, "published"),
      eq(raceEditions.status, "completed")
    ))
    .orderBy(desc(raceEditions.year));
}

export async function getRaceEditionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(raceEditions).where(eq(raceEditions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createRaceEdition(edition: InsertRaceEdition) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(raceEditions).values(edition);
  return Number(result[0].insertId);
}

export async function updateRaceEdition(id: number, edition: Partial<InsertRaceEdition>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(raceEditions).set(edition).where(eq(raceEditions.id, id));
}

export async function deleteRaceEdition(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(raceEditions).where(eq(raceEditions.id, id));
}

// Race Categories
export async function getCategoriesByEdition(editionId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(raceCategories)
    .where(eq(raceCategories.editionId, editionId))
    .orderBy(raceCategories.sortOrder);
}

export async function createRaceCategory(category: InsertRaceCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(raceCategories).values(category);
  return Number(result[0].insertId);
}

export async function updateRaceCategory(id: number, category: Partial<InsertRaceCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(raceCategories).set(category).where(eq(raceCategories.id, id));
}

export async function getRaceCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(raceCategories).where(eq(raceCategories.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteRaceCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(raceCategories).where(eq(raceCategories.id, id));
}

// Race Routes
export async function getRouteByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(raceRoutes)
    .where(eq(raceRoutes.categoryId, categoryId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createRaceRoute(route: InsertRaceRoute) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(raceRoutes).values(route);
  return Number(result[0].insertId);
}

export async function updateRaceRoute(id: number, route: Partial<InsertRaceRoute>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(raceRoutes).set(route).where(eq(raceRoutes.id, id));
}

// Registrations
export async function createRegistration(registration: InsertRegistration) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(registrations).values(registration);
  return Number(result[0].insertId);
}

export async function getRegistrationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(registrations).where(eq(registrations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateRegistration(id: number, registration: Partial<InsertRegistration>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(registrations).set(registration).where(eq(registrations.id, id));
}

export async function getRegistrationsByEdition(editionId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(registrations)
    .where(eq(registrations.editionId, editionId))
    .orderBy(desc(registrations.registrationDate));
}

export async function getRegistrationStats(editionId: number) {
  const db = await getDb();
  if (!db) return { total: 0, paid: 0, pending: 0 };
  
  const stats = await db.select({
    total: sql<number>`count(*)`,
    paid: sql<number>`sum(case when ${registrations.paymentStatus} = 'completed' then 1 else 0 end)`,
    pending: sql<number>`sum(case when ${registrations.paymentStatus} = 'pending' then 1 else 0 end)`,
  }).from(registrations).where(eq(registrations.editionId, editionId));
  
  return stats[0] || { total: 0, paid: 0, pending: 0 };
}

// Race Results
export async function createRaceResult(result: InsertRaceResult) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const insertResult = await db.insert(raceResults).values(result);
  return Number(insertResult[0].insertId);
}

export async function getResultsByEdition(editionId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(raceResults)
    .where(eq(raceResults.editionId, editionId))
    .orderBy(raceResults.categoryId, raceResults.position);
}

export async function getResultsByCategory(editionId: number, categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(raceResults)
    .where(and(
      eq(raceResults.editionId, editionId),
      eq(raceResults.categoryId, categoryId)
    ))
    .orderBy(raceResults.position);
}

export async function deleteRaceResult(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(raceResults).where(eq(raceResults.id, id));
}

// Content Pages
export async function getContentPageBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(contentPages)
    .where(and(
      eq(contentPages.slug, slug),
      eq(contentPages.status, "published")
    ))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllContentPages() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(contentPages).orderBy(desc(contentPages.updatedAt));
}

export async function createContentPage(page: InsertContentPage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contentPages).values(page);
  return Number(result[0].insertId);
}

export async function updateContentPage(id: number, page: Partial<InsertContentPage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contentPages).set(page).where(eq(contentPages.id, id));
}

export async function deleteContentPage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(contentPages).where(eq(contentPages.id, id));
}

// Gallery Images
export async function getGalleryImagesByEdition(editionId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(galleryImages)
    .where(eq(galleryImages.editionId, editionId))
    .orderBy(galleryImages.sortOrder);
}

export async function createGalleryImage(image: InsertGalleryImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(galleryImages).values(image);
  return Number(result[0].insertId);
}

export async function deleteGalleryImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
}

