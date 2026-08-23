import { describe, expect, it } from "vitest";
import request from "supertest";
import { app, createTestVehicle, registerAndLogin } from "./helpers";

describe("POST /api/vehicles/:id/purchase", () => {
  it("decreases quantity by exactly one on a successful purchase", async () => {
    const vehicle = await createTestVehicle({ quantity: 3 });
    const { token } = await registerAndLogin("USER");

    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.quantity).toBe(2);
  });

  it("rejects purchase when quantity is zero", async () => {
    const vehicle = await createTestVehicle({ quantity: 0 });
    const { token } = await registerAndLogin("USER");

    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 404 when purchasing a missing vehicle", async () => {
    const { token } = await registerAndLogin("USER");

    const res = await request(app)
      .post(`/api/vehicles/999999/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("rejects unauthenticated purchase attempts", async () => {
    const vehicle = await createTestVehicle({ quantity: 3 });

    const res = await request(app).post(`/api/vehicles/${vehicle.id}/purchase`);

    expect(res.status).toBe(401);
  });

  it("never allows quantity to go negative under concurrent requests", async () => {
    const vehicle = await createTestVehicle({ quantity: 1 });
    const { token } = await registerAndLogin("USER");

    const [first, second] = await Promise.all([
      request(app).post(`/api/vehicles/${vehicle.id}/purchase`).set("Authorization", `Bearer ${token}`),
      request(app).post(`/api/vehicles/${vehicle.id}/purchase`).set("Authorization", `Bearer ${token}`)
    ]);

    const statuses = [first.status, second.status].sort();
    // Exactly one request succeeds (200), the other is rejected as out of stock (400).
    expect(statuses).toEqual([200, 400]);

    const check = await request(app).get(`/api/vehicles/${vehicle.id}`).set("Authorization", `Bearer ${token}`);
    expect(check.body.data.quantity).toBe(0);
  });
});
