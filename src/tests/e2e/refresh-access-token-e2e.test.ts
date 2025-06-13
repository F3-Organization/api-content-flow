import request from "supertest";
import {
  startTestDB,
  connection,
  stopTestDB,
} from "../test-utils/setup-test-db";
import { startTestHttp } from "../test-utils/setup-test-http";
import { Application } from "express";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { createUserMocks } from "../infra/mocks/create-user-mocks";

let app: Application;

beforeAll(async () => {
  await startTestDB();
  const express = startTestHttp(connection);
  app = express.getApp();
});

afterAll(async () => {
  await stopTestDB();
});

describe("Refresh Access Token E2E Tests", () => {
  it("should refresh access token successfully", async () => {
    await request(app).post("/api/register").send(createUserMocks.validUser);
    const loginResponse = await request(app).post("/api/login").send({
      email: createUserMocks.validUser.email,
      password: createUserMocks.validUser.password,
    });
    const response = await request(app)
      .post("/api/refresh-access-token")
      .send({ refreshToken: loginResponse.body.data.refreshToken });
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.data.accessToken).not.toBe(
      loginResponse.body.data.accessToken,
    );
    expect(response.body.data.refreshToken).not.toEqual(
      loginResponse.body.data.refreshToken,
    );
  });
});
