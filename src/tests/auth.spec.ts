import request from "supertest";
import app from "../app";
import mongoose from "mongoose";

describe("Auth", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/beetrack_test");
  });
  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it("rejects invalid login", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ email: "noone@example.com", password: "x" });
    expect(res.status).toBe(401);
  });

  it("can register and login a user (happy path)", async () => {
    const email = `test+${Date.now()}@example.com`;
    const reg = await request(app).post("/api/v1/auth/register").send({ name: "T", email, password: "password123" });
    expect(reg.status).toBe(201);
    const login = await request(app).post("/api/v1/auth/login").send({ email, password: "password123" });
    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty("accessToken");
  });
});