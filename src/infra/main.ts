import express from "express";
import { CreateExpress } from "./adapters/express/express";

function CreateServer() {
  const app = express();
  new CreateExpress(app);
}

CreateServer();
