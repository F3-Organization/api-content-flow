import { IRoute } from "./interfaces/route.interface";
import { CreateExpress } from "@/infra/adapters/express/express";
import { IFactory } from "@/application";
import { LoginController, RefreshAccessTokenController } from "../controllers";

export class AuthRoutes implements IRoute {
  private createLoginController: LoginController;
  private createRefreshAccessTokenController: RefreshAccessTokenController;
  constructor(
    private http: CreateExpress,
    private factory: IFactory,
    private readonly BasePath: string
  ) {
    this.createLoginController =
      this.factory.controllerFactory.createLoginController();
    this.createRefreshAccessTokenController =
      this.factory.controllerFactory.createRefreshAccessTokenController();
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

    await this.http.on({
      method: "post",
      url: this.BasePath + "/refresh-access-token",
      controller: async (req: any) => {
        return await this.createRefreshAccessTokenController.execute(req);
      },
    });
  }
}
