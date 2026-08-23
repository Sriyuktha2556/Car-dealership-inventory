import { describe, expect, it } from "vitest";
import request from "supertest";
import { app, createTestVehicle, registerAndLogin } from "./helpers";

describe("POST /api/vehicles/:id/restock", () => {
  it("increases quantity by the requested amount for an admin", async () => {
    const { token } = await registerAndLogin("ADMIN");
    const vehicle = await createTestVehicle({ quantity: 2 });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.data.quantity).toBe(7);
  });

  it("rejects an invalid (non-positive) restock quantity", async () => {
    const { token } = await registerAndLogin("ADMIN");
    const vehicle = await createTestVehicle();

    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 0 });

    expect(res.status).toBe(400);
  });

  it("returns 404 for a missing vehicle", async () => {
    const { token } = await registerAndLogin("ADMIN");

    const res = await request(app)
      .post(`/api/vehicles/999999/restock`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(404);
  });

  it("rejects restock from a normal user", async () => {
    const vehicle = await createTestVehicle();
    const { token } = await registerAndLogin("USER");

    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(403);
  });
});
