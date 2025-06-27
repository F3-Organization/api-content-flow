import { IRoute } from "./interfaces/route.interface";
import { CreateExpress } from "@/infra/adapters/express/express";
import { IFactory } from "@/application";
import {
  CreateGoogleOAuthUrlController,
  CreateSubscriptionController,
  LoginController,
  LoginOAuthGoogleController,
  RecoveryPasswordController,
  RefreshAccessTokenController,
} from "../controllers";

export class AuthRoutes implements IRoute {
  private LoginController: LoginController;
  private RefreshAccessTokenController: RefreshAccessTokenController;
  private GoogleOAuthUrlController: CreateGoogleOAuthUrlController;
  private LoginOAuthController: LoginOAuthGoogleController;
  private RecoveryPasswordController: RecoveryPasswordController;
  constructor(
    private http: CreateExpress,
    private factory: IFactory,
  ) {
    this.LoginController =
      this.factory.controllerFactory.createLoginController();
    this.RefreshAccessTokenController =
      this.factory.controllerFactory.createRefreshAccessTokenController();
    this.GoogleOAuthUrlController =
      this.factory.controllerFactory.createCreateGoogleOAuthUrlController();
    this.LoginOAuthController =
      this.factory.controllerFactory.createLoginOAuthController();
    this.RecoveryPasswordController =
      this.factory.controllerFactory.createRecoveryPasswordController();
    this.setup();
  }
  async setup(): Promise<void> {
    await this.http.on({
      method: "post",
      url: "/login",
      controller: async (req: any) => {
        return await this.LoginController.execute(req);
      },
    });

    await this.http.on({
      method: "post",
      url: "/refresh-access-token",
      controller: async (req: any) => {
        return await this.RefreshAccessTokenController.execute(req);
      },
    });

    await this.http.on({
      method: "post",
      url: "/create-google-auth-url",
      controller: async (req: any) => {
        return await this.GoogleOAuthUrlController.execute(req);
      },
    });

    await this.http.on({
      method: "get",
      url: "/login-oauth-google",
      controller: async (req: any) => {
        return await this.LoginOAuthController.execute(req);
      },
    });

    await this.http.on({
      method: "post",
      url: "/recovery-password",
      controller: async (req: any) => {
        return await this.RecoveryPasswordController.execute(req);
      },
    });
  }
}
