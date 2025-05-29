import express, { Application } from "express";
import { ExpressAdapter } from "./express-adapter";
import { ExpressAdapterNamespace } from "./interfaces/express-adapter-interface";

export interface RouteConfig {
  method: ExpressAdapterNamespace.method;
  url: string;
  controller: ExpressAdapterNamespace.controller;
  middlewares?: ExpressAdapterNamespace.middleware[];
}

export class CreateExpress {
  private expressAdapter: ExpressAdapter;

  constructor(private readonly app: Application) {
    this.expressAdapter = new ExpressAdapter(this.app);
    this.setMiddlewares();
  }

  async on(config: RouteConfig): Promise<void> {
    await this.expressAdapter.handlerRequest(
      config.method,
      config.url,
      config.controller,
      config.middlewares
    );
  }

  async use(middleware: ExpressAdapterNamespace.middleware): Promise<void> {
    await this.expressAdapter.middlewareHandler(middleware);
  }

  getApp(): Application {
    return this.app;
  }

  private async setMiddlewares(): Promise<void> {
    await this.expressAdapter.middlewareHandler(express.json());
    await this.expressAdapter.middlewareHandler(
      express.urlencoded({ extended: true })
    );
  }
}
