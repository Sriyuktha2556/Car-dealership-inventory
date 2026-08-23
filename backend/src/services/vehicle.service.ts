import { pool } from "../config/db";
import { AppError } from "../utils/AppError";
import { Vehicle } from "../types";

interface VehicleInput {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

interface SearchOptions {
  q?: string;
  category?: string;
  available?: "true" | "false";
  sort?: "price_asc" | "price_desc" | "name_asc";
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  const result = await pool.query<Vehicle>(
    `INSERT INTO vehicles (make, model, category, price, quantity)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [input.make, input.model, input.category, input.price, input.quantity]
  );
  return result.rows[0];
}

export async function listVehicles(options: SearchOptions): Promise<Vehicle[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (options.q) {
    params.push(`%${options.q.toLowerCase()}%`);
    conditions.push(
      `(LOWER(make) LIKE $${params.length} OR LOWER(model) LIKE $${params.length} OR LOWER(category) LIKE $${params.length})`
    );
  }

  if (options.category) {
    params.push(options.category.toLowerCase());
    conditions.push(`LOWER(category) = $${params.length}`);
  }

  if (options.available === "true") {
    conditions.push("quantity > 0");
  } else if (options.available === "false") {
    conditions.push("quantity = 0");
  }

  let orderBy = "id ASC";
  if (options.sort === "price_asc") orderBy = "price ASC";
  if (options.sort === "price_desc") orderBy = "price DESC";
  if (options.sort === "name_asc") orderBy = "make ASC, model ASC";

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await pool.query<Vehicle>(`SELECT * FROM vehicles ${where} ORDER BY ${orderBy}`, params);
  return result.rows;
}

export async function getVehicleById(id: number): Promise<Vehicle> {
  const result = await pool.query<Vehicle>("SELECT * FROM vehicles WHERE id = $1", [id]);
  const vehicle = result.rows[0];
  if (!vehicle) {
    throw new AppError(404, "Vehicle not found");
  }
  return vehicle;
}

export async function updateVehicle(id: number, input: Partial<VehicleInput>): Promise<Vehicle> {
  const fields: string[] = [];
  const params: unknown[] = [];

  const allowedFields: Array<keyof VehicleInput> = ["make", "model", "category", "price", "quantity"];
  for (const key of allowedFields) {
    const value = input[key];
    if (value === undefined) continue;
    params.push(value);
    fields.push(`${key} = $${params.length}`);
  }

  if (fields.length === 0) {
    throw new AppError(400, "At least one field must be provided");
  }

  params.push(id);
  const result = await pool.query<Vehicle>(
    `UPDATE vehicles SET ${fields.join(", ")} WHERE id = $${params.length} RETURNING *`,
    params
  );

  const vehicle = result.rows[0];
  if (!vehicle) {
    throw new AppError(404, "Vehicle not found");
  }
  return vehicle;
}

export async function deleteVehicle(id: number): Promise<void> {
  const result = await pool.query("DELETE FROM vehicles WHERE id = $1", [id]);
  if (result.rowCount === 0) {
    throw new AppError(404, "Vehicle not found");
  }
}

/**
 * Purchases one unit of a vehicle.
 *
 * The decrement is done in a single atomic UPDATE guarded by `quantity > 0`
 * inside a transaction, so concurrent requests cannot drive stock negative:
 * only one of two simultaneous requests will match the WHERE clause once the
 * other has already decremented the row.
 */
export async function purchaseVehicle(id: number): Promise<Vehicle> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query<Vehicle>(
      `UPDATE vehicles
       SET quantity = quantity - 1
       WHERE id = $1 AND quantity > 0
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      // Either the vehicle doesn't exist, or it's out of stock.
      const existing = await client.query("SELECT id FROM vehicles WHERE id = $1", [id]);
      await client.query("ROLLBACK");

      if (existing.rowCount === 0) {
        throw new AppError(404, "Vehicle not found");
      }
      throw new AppError(400, "Vehicle is out of stock");
    }

    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }
}

export async function restockVehicle(id: number, amount: number): Promise<Vehicle> {
  const result = await pool.query<Vehicle>(
    `UPDATE vehicles SET quantity = quantity + $1 WHERE id = $2 RETURNING *`,
    [amount, id]
  );

  const vehicle = result.rows[0];
  if (!vehicle) {
    throw new AppError(404, "Vehicle not found");
  }
  return vehicle;
}
