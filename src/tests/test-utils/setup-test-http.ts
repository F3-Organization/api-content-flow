import { AppRoutes, ConnectionDatabase } from "@/infra";
import { CreateExpress } from "@/infra/adapters/express/express";
import { makeFactory } from "@/infra/factories/factory";

export function startTestHttp(connection: ConnectionDatabase) {
  const expressAdapter = new CreateExpress();
  const factory = makeFactory(connection);
  new AppRoutes(expressAdapter, factory);
  return expressAdapter
}
