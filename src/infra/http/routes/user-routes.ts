import { CreateExpress } from "@/infra/adapters/express/express";
import { IRoute } from "./interfaces/route.interface";
import { CreateUserController } from "../controllers/create-user.controller";
import { IFactory } from "@/application";

export class UserRoutes implements IRoute {
  private createUserController: CreateUserController;
  constructor(
    private http: CreateExpress,
    private factory: IFactory,
    private readonly basePath: string
  ) {
    this.createUserController =
      this.factory.controllerFactory.createCreateUSerController();
    this.setup();
  }
  async setup(): Promise<void> {
    await this.http.on({
      method: "post",
      url: this.basePath + "/create-user",
      controller: async (req: any) => {
        return await this.createUserController.execute(req);
      },
    });
  }
}
