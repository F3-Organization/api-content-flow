import {
  RegisterUserController,
  GetPlansController,
  LoginController,
  RefreshAccessTokenController,
  CreateSubscriptionController,
} from "@/infra/http";

export interface IControllerFactory {
  createRegisterUSerController(): RegisterUserController;
  createLoginController(): LoginController;
  createRefreshAccessTokenController(): RefreshAccessTokenController;
  createGetPlansController(): GetPlansController;
  createCreateSubscriptionController(): CreateSubscriptionController;
}
