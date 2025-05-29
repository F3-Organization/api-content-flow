import { CreateExpress } from "@/infra/adapters/express/express";
import { Route } from "./interfaces/route.interface";

export class AppRoutes implements Route {
  constructor(private http: CreateExpress) {
    this.setup();
  }
  setup(): void {}
}
