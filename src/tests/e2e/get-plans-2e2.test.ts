import {
  startTestDB,
  connection,
  stopTestDB,
} from "../test-utils/setup-test-db";
import { startTestHttp } from "../test-utils/setup-test-http";
import { Application } from "express";
import request from "supertest";

let app: Application;
let server: any;

beforeAll(async () => {
  await startTestDB();
  const express = await startTestHttp(connection);
  app = express.getApp();
  server = express.getServer();
}, 20000);

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
