import { Application } from "express";
import { ExpressAdapterNamespace } from "./express-adapter.interface";

export interface ICreateExpress {
  on(config: RouteConfig): Promise<void>;
  use(middleware: ExpressAdapterNamespace.middleware): Promise<void>;
  getApp(): Application;
}

export interface RouteConfig {
  method: ExpressAdapterNamespace.method;
  url: string;
  controller: ExpressAdapterNamespace.controller;
  middlewares?: ExpressAdapterNamespace.middleware[];
}
