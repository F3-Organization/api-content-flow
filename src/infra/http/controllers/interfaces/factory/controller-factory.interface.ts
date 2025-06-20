import {
  RegisterUserController,
  GetPlansController,
  LoginController,
  RefreshAccessTokenController,
  CreateSubscriptionController,
  CreateGoogleOAuthUrlController,
  LoginOAuthGoogleController,
} from "@/infra/http";

export interface IControllerFactory {
  createRegisterUSerController(): RegisterUserController;
  createLoginController(): LoginController;
  createCreateGoogleOAuthUrlController(): CreateGoogleOAuthUrlController;
  createRefreshAccessTokenController(): RefreshAccessTokenController;
  createGetPlansController(): GetPlansController;
  createCreateSubscriptionController(): CreateSubscriptionController;
  createLoginOAuthController(): LoginOAuthGoogleController;
}
