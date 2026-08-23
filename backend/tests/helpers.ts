import request from "supertest";
import { createApp } from "../src/app";
import { pool } from "../src/config/db";

export const app = createApp();

let counter = 0;

export function uniqueEmail(prefix: string): string {
  counter += 1;
  return `${prefix}.${Date.now()}.${counter}@example.com`;
}

export async function registerAndLogin(role: "USER" | "ADMIN" = "USER") {
  const email = uniqueEmail(role.toLowerCase());
  const password = "Password123!";

  await request(app).post("/api/auth/register").send({
    name: "Test User",
    email,
    password
  });

  if (role === "ADMIN") {
    await pool.query("UPDATE users SET role = 'ADMIN' WHERE email = $1", [email]);
  }

  const loginRes = await request(app).post("/api/auth/login").send({ email, password });

  return { token: loginRes.body.data.token as string, email };
}

export async function createTestVehicle(overrides: Partial<Record<string, unknown>> = {}) {
  const { token } = await registerAndLogin("ADMIN");
  const res = await request(app)
    .post("/api/vehicles")
    .set("Authorization", `Bearer ${token}`)
    .send({
      make: "TestMake",
      model: "TestModel",
      category: "Sedan",
      price: 20000,
      quantity: 3,
      ...overrides
    });
  return res.body.data as { id: number; quantity: number };
}
