import { drizzle } from "drizzle-orm/mysql2";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("Seeding database...");

  const editionResult = await db.execute(`
    INSERT INTO raceEditions (year, title, date, description, location, status, charityName, charityDescription, registrationOpen)
    VALUES (2025, 'Is-Siggiewi End of Year Race 2025', '2025-12-29', 
    'Join us for the annual Is-Siggiewi End of Year Race, a community event celebrating fitness, family, and charity.',
    'Siggiewi, Malta', 'published', 'Dar tal-Providenza', 'Homes of Persons with Disabilities', 1)
  `);

  const editionId = Number((editionResult as any)[0].insertId);
  
  await db.execute(`
    INSERT INTO raceCategories (editionId, name, distance, description, priceInCents, ageGroup, startTime, sortOrder)
    VALUES 
    (${editionId}, '5KM Adult Race', '5km', 'A challenging course through the historic center and countryside', 1000, '16+', '09:00', 1),
    (${editionId}, '1.5KM Kids Race', '1.5km', 'Fun run for kids through the village streets', 500, '8-15 years', '10:30', 2),
    (${editionId}, '500M Family Fun Run', '500m', 'Short family-friendly run for all ages', 0, 'All ages', '11:00', 3)
  `);

  console.log("Seeding complete!");
}

seed().catch(console.error);
