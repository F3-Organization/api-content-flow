import {
  startTestDB,
  connection,
  stopTestDB,
} from "../test-utils/setup-test-db";
import { startTestHttp } from "../test-utils/setup-test-http";
import { Application } from "express";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { registerUserMock } from "../infra/mocks/create-user-mocks";
import request from "supertest";
import {
  setupTestRabbitMq,
  stopTestRabbit,
} from "../test-utils/setup-test-rabbitMq";
import { Workers } from "@/infra/message-broker/workers/workers";

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

describe("Refresh Access Token E2E Tests", () => {
  it("should refresh access token successfully", async () => {
    await request(app).post("/api/register").send(registerUserMock.validUser);
    const loginResponse = await request(app).post("/api/login").send({
      email: registerUserMock.validUser.email,
      password: registerUserMock.validUser.password,
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
