import { IRoute } from "./interfaces/route.interface";
import { CreateExpress } from "@/infra/adapters/express/express";
import { LoginController } from "../controllers";
import { IFactory } from "@/application";

export class AuthRoutes implements IRoute {
  private createLoginController: LoginController;
  constructor(
    private http: CreateExpress,
    private factory: IFactory,
    private readonly BasePath: string
  ) {
    this.createLoginController =
      this.factory.controllerFactory.createLoginController();
    this.setup();
  }
  async setup(): Promise<void> {
    await this.http.on({
      method: "post",
      url: this.BasePath + "/login",
      controller: async (req: any) => {
        return await this.createLoginController.execute(req);
      },
    });
  }
}
