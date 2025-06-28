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

describe("Login End-to-End Tests", () => {
  it("should successfully log in a user", async () => {
    await request(app).post("/api/register").send(registerUserMock.validUser);
    const response = await request(app).post("/api/login").send({
      email: registerUserMock.validUser.email,
      password: registerUserMock.validUser.password,
    });
    expect(response.status).toBe(HttpStatus.OK);
  });
});
