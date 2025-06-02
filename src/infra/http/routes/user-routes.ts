import { CreateExpress } from "@/infra/adapters/express/express";
import { Route } from "./interfaces/route.interface";
import { Factory } from "@/infra/factories/factory";
import { CreateUserController } from "../controllers/create-user-controller";

export class UserRoutes implements Route {
  private createUserController: CreateUserController;
  constructor(private http: CreateExpress, private readonly basePath: string) {
    this.createUserController =
      Factory.controllerFactory.createCreateUSerController();
    this.setup();
  }
  async setup(): Promise<void> {
    await this.http.on({
      method: "post",
      url: "/create-user",
      controller: async (req: any) => {
        return await this.createUserController.execute(req);
      },
    });
  }
}
