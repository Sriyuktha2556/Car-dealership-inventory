import { Pool } from "pg";
import { env } from "./env";

export const pool = new Pool({ connectionString: env.databaseUrl });

pool.on("error", (err) => {
  // Unexpected errors on idle clients should not crash silently.
  // eslint-disable-next-line no-console
  console.error("Unexpected database pool error", err);
});
