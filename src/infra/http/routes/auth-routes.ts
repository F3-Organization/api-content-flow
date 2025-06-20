import { IRoute } from "./interfaces/route.interface";
import { CreateExpress } from "@/infra/adapters/express/express";
import { IFactory } from "@/application";
import {
  CreateGoogleOAuthUrlController,
  CreateSubscriptionController,
  LoginController,
  LoginOAuthGoogleController,
  RefreshAccessTokenController,
} from "../controllers";

export class AuthRoutes implements IRoute {
  private createLoginController: LoginController;
  private createRefreshAccessTokenController: RefreshAccessTokenController;
  private createGoogleOAuthUrlController: CreateGoogleOAuthUrlController;
  private createLoginOAuthController: LoginOAuthGoogleController;
  constructor(
    private http: CreateExpress,
    private factory: IFactory,
  ) {
    this.createLoginController =
      this.factory.controllerFactory.createLoginController();
    this.createRefreshAccessTokenController =
      this.factory.controllerFactory.createRefreshAccessTokenController();
    this.createGoogleOAuthUrlController =
      this.factory.controllerFactory.createCreateGoogleOAuthUrlController();
    this.createLoginOAuthController =
      this.factory.controllerFactory.createLoginOAuthController();
    this.setup();
  }
  async setup(): Promise<void> {
    await this.http.on({
      method: "post",
      url: "/login",
      controller: async (req: any) => {
        return await this.createLoginController.execute(req);
      },
    });

    await this.http.on({
      method: "post",
      url: "/refresh-access-token",
      controller: async (req: any) => {
        return await this.createRefreshAccessTokenController.execute(req);
      },
    });

    await this.http.on({
      method: "post",
      url: "/create-google-auth-url",
      controller: async (req: any) => {
        return await this.createGoogleOAuthUrlController.execute(req);
      },
    });

    await this.http.on({
      method: "post",
      url: "/login-oauth-google",
      controller: async (req: any) => {
        return await this.createLoginOAuthController.execute(req);
      },
    });
  }
}
