import { CreateExpress } from "@/infra/adapters/express/express";
import { IRoute } from "./interfaces/route.interface";
import { UserRoutes } from "./user-routes";
import { AuthRoutes } from "./auth-routes";
import { IFactory } from "@/application";

export class AppRoutes implements IRoute {
  constructor(private http: CreateExpress, private factory: IFactory) {
    this.setup();
  }
  async setup(): Promise<void> {
    new UserRoutes(this.http, this.factory);
    new AuthRoutes(this.http, this.factory);
  }
}
