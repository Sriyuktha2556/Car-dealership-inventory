import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { pool } from "../config/db";

async function seed() {
  const seedPath = path.join(__dirname, "seed.sql");
  const sql = fs.readFileSync(seedPath, "utf-8");

  console.log("Seeding vehicle inventory...");
  await pool.query(sql);

  console.log("Seeding demo accounts (development only)...");
  const demoPasswordHash = await bcrypt.hash("Password123!", 10);

  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'ADMIN')
     ON CONFLICT (email) DO NOTHING`,
    ["Demo Admin", "admin@dealership.dev", demoPasswordHash]
  );

  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'USER')
     ON CONFLICT (email) DO NOTHING`,
    ["Demo User", "user@dealership.dev", demoPasswordHash]
  );

  console.log("Seed complete.");
  console.log("DEMO ACCOUNTS (development only, do not use in production):");
  console.log("  admin@dealership.dev / Password123!");
  console.log("  user@dealership.dev  / Password123!");

  await pool.end();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
