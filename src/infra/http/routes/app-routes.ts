import { CreateExpress } from "@/infra/adapters/express/express";
import { IRoute } from "./interfaces/route.interface";
import { UserRoutes } from "./user-routes";
import { AuthRoutes } from "./auth-routes";

export class AppRoutes implements IRoute {
  constructor(private http: CreateExpress) {
    this.setup();
  }
  async setup(): Promise<void> {
    const basePath = "/api";
    new UserRoutes(this.http, basePath);
    new AuthRoutes(this.http, basePath);
  }
}
