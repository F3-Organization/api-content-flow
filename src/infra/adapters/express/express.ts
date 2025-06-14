import express, { Application } from "express";
import { ExpressAdapter } from "./express-adapter";
import { ExpressAdapterNamespace } from "./interfaces/express-adapter.interface";
import { env } from "@/config/env";
import { ICreateExpress, RouteConfig } from "./interfaces/express.interface";

export class CreateExpress implements ICreateExpress {
  private expressAdapter: ExpressAdapter;
  private app: Application;
  server: any;

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setServer();
    this.expressAdapter = new ExpressAdapter(this.app);
  }

  async on(config: RouteConfig): Promise<void> {
    await this.expressAdapter.handlerRequest(
      config.method,
      config.url,
      config.controller,
      config.middlewares,
    );
  }

  async use(middleware: ExpressAdapterNamespace.middleware): Promise<void> {
    await this.expressAdapter.middlewareHandler(middleware);
  }

  getApp(): Application {
    return this.app;
  }

  getServer() {
    return this.server;
  }

  private setServer() {
    this.server = this.getApp().listen(env.api_port, () => {
      console.log(
        `INFO - Server is running on https://localhost:${env.api_port}`,
      );
    });
  }

  private async setMiddlewares(): Promise<void> {
    await this.app.use(express.json());
    await this.app.use(express.urlencoded({ extended: true }));
  }
}
