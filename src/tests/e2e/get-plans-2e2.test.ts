import request from "supertest";
import {
  startTestDB,
  connection,
  stopTestDB,
} from "../test-utils/setup-test-db";
import { startTestHttp } from "../test-utils/setup-test-http";
import { Application } from "express";

let app: Application;
let server: any;

beforeAll(async () => {
  await startTestDB();
  const express = startTestHttp(connection);
  app = express.getApp();
  server = express.getServer();
});

afterAll(async () => {
  await stopTestDB();
  server.close();
});

describe("Get Plans End-to-End Tests", () => {
  it("should retrieve plans successfully", async () => {
    const response = await request(app).get("/api/plans");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeDefined();
    expect(response.body.success).toBeTruthy();
  });
});
