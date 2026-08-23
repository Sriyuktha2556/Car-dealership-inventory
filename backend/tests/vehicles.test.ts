import { describe, expect, it } from "vitest";
import request from "supertest";
import { app, createTestVehicle, registerAndLogin } from "./helpers";

describe("POST /api/vehicles (create)", () => {
  it("allows an admin to create a vehicle", async () => {
    const { token } = await registerAndLogin("ADMIN");

    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Toyota", model: "Corolla", category: "Sedan", price: 21000, quantity: 5 });

    expect(res.status).toBe(201);
    expect(res.body.data.make).toBe("Toyota");
  });

  it("rejects vehicle creation from a normal user", async () => {
    const { token } = await registerAndLogin("USER");

    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Toyota", model: "Corolla", category: "Sedan", price: 21000, quantity: 5 });

    expect(res.status).toBe(403);
  });

  it("rejects invalid vehicle data (negative price)", async () => {
    const { token } = await registerAndLogin("ADMIN");

    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Toyota", model: "Corolla", category: "Sedan", price: -5, quantity: 5 });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/vehicles", () => {
  it("returns the vehicle inventory for an authenticated user", async () => {
    const { token } = await registerAndLogin("USER");
    await createTestVehicle();

    const res = await request(app).get("/api/vehicles").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("GET /api/vehicles/search", () => {
  it("finds vehicles by make (case-insensitive)", async () => {
    const { token } = await registerAndLogin("USER");
    await createTestVehicle({ make: "Subaru", model: "Impreza" });

    const res = await request(app)
      .get("/api/vehicles/search")
      .query({ q: "subaru" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.some((v: { make: string }) => v.make === "Subaru")).toBe(true);
  });

  it("returns an empty array, not an error, when nothing matches", async () => {
    const { token } = await registerAndLogin("USER");

    const res = await request(app)
      .get("/api/vehicles/search")
      .query({ q: "no-such-vehicle-xyz" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

describe("PUT /api/vehicles/:id (update)", () => {
  it("allows an admin to update a vehicle", async () => {
    const { token } = await registerAndLogin("ADMIN");
    const vehicle = await createTestVehicle();

    const res = await request(app)
      .put(`/api/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 25000 });

    expect(res.status).toBe(200);
    expect(Number(res.body.data.price)).toBe(25000);
  });

  it("rejects update from a normal user", async () => {
    const vehicle = await createTestVehicle();
    const { token } = await registerAndLogin("USER");

    const res = await request(app)
      .put(`/api/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 25000 });

    expect(res.status).toBe(403);
  });

  it("returns 404 for a missing vehicle", async () => {
    const { token } = await registerAndLogin("ADMIN");

    const res = await request(app)
      .put(`/api/vehicles/999999`)
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 25000 });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/vehicles/:id", () => {
  it("allows an admin to delete a vehicle", async () => {
    const { token } = await registerAndLogin("ADMIN");
    const vehicle = await createTestVehicle();

    const res = await request(app).delete(`/api/vehicles/${vehicle.id}`).set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("rejects delete from a normal user", async () => {
    const vehicle = await createTestVehicle();
    const { token } = await registerAndLogin("USER");

    const res = await request(app).delete(`/api/vehicles/${vehicle.id}`).set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});
