import request from "supertest";
import {
  startTestDB,
  connection,
  stopTestDB,
} from "../test-utils/setup-test-db";
import { startTestHttp } from "../test-utils/setup-test-http";
import { Application } from "express";
import { HttpStatus } from "@/infra/http/protocols.enum";

let app: Application;

beforeAll(async () => {
  await startTestDB();
  const express = startTestHttp(connection);
  app = express.getApp();
});

afterAll(async () => {
  await stopTestDB();
});

describe("Login End-to-End Tests", () => {
  it("should successfully log in a user", async () => {
    await request(app).post("/api/register").send({
      name: "testuser",
      email: "testuser@example.com",
      password: "testpassword",
      role: 1,
      provider: "local",
    });
    const response = await request(app)
      .post("/api/login")
      .send({ email: "testuser@example.com", password: "testpassword" });
    expect(response.status).toBe(HttpStatus.OK);
  });
});
