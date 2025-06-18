import request from "supertest";
import {
  startTestDB,
  connection,
  stopTestDB,
} from "../test-utils/setup-test-db";
import { startTestHttp } from "../test-utils/setup-test-http";
import { Application } from "express";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { registerUserMock } from "../infra/mocks/create-user-mocks";

let app: Application;
let server: any;

beforeAll(async () => {
  await startTestDB();
  const express = startTestHttp(connection);
  app = express.getApp();
  server = express.getServer();
}, 20000);

afterAll(async () => {
  await stopTestDB();
  server.close();
});

describe("User Registration E2E Tests", () => {
  it("should register a user successfully", async () => {
    const response = await request(app)
      .post("/api/register")
      .send(registerUserMock.validUser);
    expect(response.status).toBe(HttpStatus.CREATED);
  });
});
