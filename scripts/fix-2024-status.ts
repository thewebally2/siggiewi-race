import { drizzle } from "drizzle-orm/mysql2";

const db = drizzle(process.env.DATABASE_URL!);

async function fix() {
  console.log("Updating 2024 edition status to completed...");
  
  await db.execute(`
    UPDATE raceEditions 
    SET status = 'completed' 
    WHERE year = 2024
  `);
  
  console.log("Done!");
}

fix().catch(console.error);
