import {
  startTestDB,
  connection,
  stopTestDB,
} from "../test-utils/setup-test-db";
import { startTestHttp } from "../test-utils/setup-test-http";
import { Application } from "express";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { createUserMocks } from "../infra/mocks/create-user-mocks";
import request from "supertest";

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
