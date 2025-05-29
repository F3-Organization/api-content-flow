import express, { Application } from "express";
import { ExpressAdapter } from "./express-adapter";
import { ExpressAdapterNamespace } from "./interfaces/express-adapter-interface";
import { env } from "@/config/env";

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
    this.setPort();
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

  private setPort() {
    this.getApp().listen(env.api_port, () => {
      console.log(`INFO - Server is running on ${env.api_url}`);
    });
  }

  private getRoutes() {
    this.getApp()._router.stack.forEach((route: any) => {
      if (route.route) {
        console.log(
          `Route: ${route.route.path}, Method: ${route.route.methods}`
        );
      } else if (route.name === "router") {
        route.handle.forEach((handler: any) => {
          if (handler.route) {
            console.log(
              `Route: ${handler.route.path}, Method: ${handler.route.methods}`
            );
          }
        });
      }
    });
  }

  private async setMiddlewares(): Promise<void> {
    await this.expressAdapter.middlewareHandler(express.json());
    await this.expressAdapter.middlewareHandler(
      express.urlencoded({ extended: true })
    );
  }
}
