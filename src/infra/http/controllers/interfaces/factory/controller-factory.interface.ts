import {
  CreateUserController,
  GetPlansController,
  LoginController,
  RefreshAccessTokenController,
} from "@/infra/http";

export interface IControllerFactory {
  createCreateUSerController(): CreateUserController;
  createLoginController(): LoginController;
  createRefreshAccessTokenController(): RefreshAccessTokenController;
  createGetPlansController(): GetPlansController;
}
