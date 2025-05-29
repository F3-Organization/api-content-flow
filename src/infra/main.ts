import express from "express";
import { CreateExpress } from "./adapters/express/express";
import { AppRoutes } from "./http/routes/app-routes";

function CreateServer() {
  const app = express();
  const expressAdapter = new CreateExpress(app);
  new AppRoutes(expressAdapter)
}

CreateServer();
