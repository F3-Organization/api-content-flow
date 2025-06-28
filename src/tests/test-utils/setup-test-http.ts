import { AppRoutes, ConnectionDatabase } from "@/infra";
import { CreateExpress } from "@/infra/adapters/express/express";
import { makeFactory } from "@/infra/factories/factory";
import { setupTestRabbitMq } from "./setup-test-rabbitMq";

export async function startTestHttp(connection: ConnectionDatabase) {
  const expressAdapter = new CreateExpress();
  await setupTestRabbitMq();
  const factory = makeFactory(connection);
  new AppRoutes(expressAdapter, factory);
  return expressAdapter;
}
