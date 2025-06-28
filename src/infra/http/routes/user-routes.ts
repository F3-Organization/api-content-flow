import { CreateExpress } from "@/infra/adapters/express/express";
import { IRoute } from "./interfaces/route.interface";
import { RegisterUserController } from "../controllers/authentication/local/register-user.controller";
import { IFactory } from "@/application";

export class UserRoutes implements IRoute {
  private createUserController: RegisterUserController;
  constructor(
    private http: CreateExpress,
    private factory: IFactory,
  ) {
    this.createUserController =
      this.factory.controllerFactory.createRegisterUSerController();
    this.setup();
  }
  async setup(): Promise<void> {
    await this.http.on({
      method: "post",
      url: "/register",
      controller: async (req: any) => {
        return await this.createUserController.execute(req);
      },
    });
  }
}
