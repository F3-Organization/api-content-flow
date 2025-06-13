import { CreateExpress } from "./adapters/express/express";
import { AppRoutes } from "./http/routes/app-routes";
import { KnexConnection } from "./adapters/database/connection";
import { ConnectionDatabase } from "./adapters/database/connection-database";
import { env } from "@/config/env";
import { makeFactory } from "./factories/factory";

function CreateServer() {
  const expressAdapter = new CreateExpress();
  const kenx = new KnexConnection(env.database);
  const connection = new ConnectionDatabase(kenx.knexInstance);
  const factory = makeFactory(connection);
  new AppRoutes(expressAdapter, factory);
}

CreateServer();
