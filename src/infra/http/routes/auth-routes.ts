import { IRepositoryFactory } from "@/application";
import { IRoute } from "./interfaces/route.interface";
import { CreateExpress } from "@/infra/adapters/express/express";
import { Factory } from "@/infra/factories/factory";
import { LoginController } from "../controllers";

export class AuthRoutes implements IRoute {
  private createLoginController: LoginController;
  constructor(private http: CreateExpress, private readonly BasePath: string) {
    this.createLoginController =
      Factory.controllerFactory.createLoginController();
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
