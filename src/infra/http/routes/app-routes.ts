import { CreateExpress } from "@/infra/adapters/express/express";
import { Route } from "./interfaces/route.interface";
import { UserRoutes } from "./user-routes";

export class AppRoutes implements Route {
  constructor(private http: CreateExpress) {
    this.setup();
  }
  async setup(): Promise<void> {
    const basePath = "/api";
    new UserRoutes(this.http, basePath);
  }
}
