import { describe, expect, it } from "vitest";
import request from "supertest";
import { app, uniqueEmail } from "./helpers";

describe("POST /api/auth/register", () => {
  it("registers a new user and returns a token without the password", async () => {
    const email = uniqueEmail("register");

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Jane Doe", email, password: "Password123!" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTypeOf("string");
    expect(res.body.data.user.email).toBe(email);
    expect(res.body.data.user.role).toBe("USER");
    expect(res.body.data.user).not.toHaveProperty("password");
    expect(res.body.data.user).not.toHaveProperty("password_hash");
  });

  it("rejects duplicate email registration", async () => {
    const email = uniqueEmail("dup");
    const payload = { name: "Jane Doe", email, password: "Password123!" };

    await request(app).post("/api/auth/register").send(payload);
    const res = await request(app).post("/api/auth/register").send(payload);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("rejects invalid registration data", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "A", email: "not-an-email", password: "123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });
});

describe("POST /api/auth/login", () => {
  it("logs in a valid user and returns a token", async () => {
    const email = uniqueEmail("login");
    const password = "Password123!";
    await request(app).post("/api/auth/register").send({ name: "Login User", email, password });

    const res = await request(app).post("/api/auth/login").send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTypeOf("string");
  });

  it("rejects invalid credentials", async () => {
    const email = uniqueEmail("badlogin");
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Bad Login", email, password: "Password123!" });

    const res = await request(app).post("/api/auth/login").send({ email, password: "WrongPass1" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("never returns the password or password hash", async () => {
    const email = uniqueEmail("nopass");
    const password = "Password123!";
    await request(app).post("/api/auth/register").send({ name: "No Pass", email, password });

    const res = await request(app).post("/api/auth/login").send({ email, password });

    expect(res.body.data.user).not.toHaveProperty("password");
    expect(res.body.data.user).not.toHaveProperty("password_hash");
  });
});

describe("Protected routes", () => {
  it("rejects requests without a token", async () => {
    const res = await request(app).get("/api/vehicles");
    expect(res.status).toBe(401);
  });

  it("rejects requests with an invalid token", async () => {
    const res = await request(app).get("/api/vehicles").set("Authorization", "Bearer not-a-real-token");
    expect(res.status).toBe(401);
  });
});
