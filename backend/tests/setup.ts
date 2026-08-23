import { beforeAll, afterAll } from "vitest";
import fs from "fs";
import path from "path";
import { pool } from "../src/config/db";

beforeAll(async () => {
  const schema = fs.readFileSync(path.join(__dirname, "../src/db/schema.sql"), "utf-8");
  await pool.query(schema);
});

afterAll(async () => {
  await pool.end();
});
