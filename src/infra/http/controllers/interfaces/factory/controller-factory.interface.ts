import {
  RegisterUserController,
  GetPlansController,
  LoginController,
  RefreshAccessTokenController,
} from "@/infra/http";

export interface IControllerFactory {
  createRegisterUSerController(): RegisterUserController;
  createLoginController(): LoginController;
  createRefreshAccessTokenController(): RefreshAccessTokenController;
  createGetPlansController(): GetPlansController;
}
