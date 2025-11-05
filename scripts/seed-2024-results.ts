import { drizzle } from "drizzle-orm/mysql2";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("Seeding 2024 edition with results...");

  // Create 2024 edition
  const edition2024Result = await db.execute(`
    INSERT INTO raceEditions (year, title, date, description, location, status, charityName, charityDescription, registrationOpen, heroImage)
    VALUES (2024, 'Is-Siggiewi End of Year Race 2024', '2024-12-29', 
    'The 2024 edition was a huge success with over 150 participants raising funds for Dar tal-Providenza.',
    'Siggiewi, Malta', 'completed', 'Dar tal-Providenza', 'Homes of Persons with Disabilities', 0, '/hero-banner.jpg')
  `);

  const edition2024Id = Number((edition2024Result as any)[0].insertId);
  console.log("Created 2024 edition:", edition2024Id);

  // Create categories for 2024
  await db.execute(`
    INSERT INTO raceCategories (editionId, name, distance, description, priceInCents, ageGroup, startTime, sortOrder)
    VALUES 
    (${edition2024Id}, '5KM Adult Race', '5km', 'A challenging course through the historic center and countryside', 1000, '16+', '09:00', 1),
    (${edition2024Id}, '1.5KM Kids Race', '1.5km', 'Fun run for kids through the village streets', 500, '8-15 years', '10:30', 2),
    (${edition2024Id}, '500M Family Fun Run', '500m', 'Short family-friendly run for all ages', 0, 'All ages', '11:00', 3)
  `);

  // Get category IDs
  const categories = await db.execute(`SELECT id, name FROM raceCategories WHERE editionId = ${edition2024Id} ORDER BY sortOrder`);
  const categoryRows = (categories as any)[0];

  // Sample results for 5KM Adult Race
  const category5km = categoryRows.find((c: any) => c.name.includes('5KM'));
  if (category5km) {
    const results5km = [
      { name: 'John Borg', time: '00:19:45', bib: 101, gender: 'male', age: 'Open' },
      { name: 'Sarah Vella', time: '00:20:12', bib: 102, gender: 'female', age: 'Open' },
      { name: 'Mark Camilleri', time: '00:20:58', bib: 103, gender: 'male', age: 'Open' },
      { name: 'Emma Farrugia', time: '00:21:34', bib: 104, gender: 'female', age: 'Open' },
      { name: 'David Zammit', time: '00:22:15', bib: 105, gender: 'male', age: '40+' },
      { name: 'Lisa Galea', time: '00:22:47', bib: 106, gender: 'female', age: 'Open' },
      { name: 'Paul Grech', time: '00:23:21', bib: 107, gender: 'male', age: '40+' },
      { name: 'Maria Azzopardi', time: '00:23:56', bib: 108, gender: 'female', age: '40+' },
      { name: 'Joseph Attard', time: '00:24:32', bib: 109, gender: 'male', age: 'Open' },
      { name: 'Claire Fenech', time: '00:25:08', bib: 110, gender: 'female', age: 'Open' }
    ];

    for (let i = 0; i < results5km.length; i++) {
      const r = results5km[i];
      await db.execute(`
        INSERT INTO raceResults (editionId, categoryId, participantName, finishTime, position, bibNumber, gender, ageCategory)
        VALUES (${edition2024Id}, ${category5km.id}, '${r.name}', '${r.time}', ${i + 1}, ${r.bib}, '${r.gender}', '${r.age}')
      `);
    }
    console.log("Added 5KM results");
  }

  // Sample results for 1.5KM Kids Race
  const category15km = categoryRows.find((c: any) => c.name.includes('1.5KM'));
  if (category15km) {
    const results15km = [
      { name: 'Jake Borg', time: '00:08:23', bib: 201, gender: 'male', age: '12-15' },
      { name: 'Sophie Vella', time: '00:08:45', bib: 202, gender: 'female', age: '12-15' },
      { name: 'Luke Camilleri', time: '00:09:12', bib: 203, gender: 'male', age: '12-15' },
      { name: 'Amy Farrugia', time: '00:09:34', bib: 204, gender: 'female', age: '8-11' },
      { name: 'Ryan Zammit', time: '00:09:56', bib: 205, gender: 'male', age: '8-11' },
      { name: 'Mia Galea', time: '00:10:18', bib: 206, gender: 'female', age: '12-15' },
      { name: 'Ben Grech', time: '00:10:42', bib: 207, gender: 'male', age: '8-11' },
      { name: 'Emma Azzopardi', time: '00:11:05', bib: 208, gender: 'female', age: '8-11' }
    ];

    for (let i = 0; i < results15km.length; i++) {
      const r = results15km[i];
      await db.execute(`
        INSERT INTO raceResults (editionId, categoryId, participantName, finishTime, position, bibNumber, gender, ageCategory)
        VALUES (${edition2024Id}, ${category15km.id}, '${r.name}', '${r.time}', ${i + 1}, ${r.bib}, '${r.gender}', '${r.age}')
      `);
    }
    console.log("Added 1.5KM results");
  }

  // Sample results for 500M Family Fun Run - use 'other' for mixed gender
  const category500m = categoryRows.find((c: any) => c.name.includes('500M'));
  if (category500m) {
    const results500m = [
      { name: 'Borg Family', time: '00:04:12', bib: 301, gender: 'other', age: 'Family' },
      { name: 'Vella Family', time: '00:04:35', bib: 302, gender: 'other', age: 'Family' },
      { name: 'Camilleri Family', time: '00:04:58', bib: 303, gender: 'other', age: 'Family' },
      { name: 'Farrugia Family', time: '00:05:21', bib: 304, gender: 'other', age: 'Family' },
      { name: 'Zammit Family', time: '00:05:44', bib: 305, gender: 'other', age: 'Family' }
    ];

    for (let i = 0; i < results500m.length; i++) {
      const r = results500m[i];
      await db.execute(`
        INSERT INTO raceResults (editionId, categoryId, participantName, finishTime, position, bibNumber, gender, ageCategory)
        VALUES (${edition2024Id}, ${category500m.id}, '${r.name}', '${r.time}', ${i + 1}, ${r.bib}, '${r.gender}', '${r.age}')
      `);
    }
    console.log("Added 500M results");
  }

  console.log("2024 edition seeding complete!");
}

seed().catch(console.error);
