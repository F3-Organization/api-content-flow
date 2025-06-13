import express, { Application } from "express";
import { ExpressAdapter } from "./express-adapter";
import { ExpressAdapterNamespace } from "./interfaces/express-adapter.interface";
import { env } from "@/config/env";
import { ICreateExpress, RouteConfig } from "./interfaces/express.interface";

export class CreateExpress implements ICreateExpress {
  private expressAdapter: ExpressAdapter;
  private app: Application;

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setPort();
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

  private setPort() {
    this.getApp().listen(env.api_port, () => {
      console.log(`INFO - Server is running on ${env.api_url}`);
    });
  }

  private async setMiddlewares(): Promise<void> {
    await this.app.use(express.json());
    await this.app.use(express.urlencoded({ extended: true }));
  }
}
