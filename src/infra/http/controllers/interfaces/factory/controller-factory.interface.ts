import {
  RegisterUserController,
  GetPlansController,
  LoginController,
  RefreshAccessTokenController,
  CreateSubscriptionController,
  CreateGoogleOAuthUrlController,
  LoginOAuthGoogleController,
  CreateRecoveryPasswordTokenController,
  RecoveryPasswordController,
  CreateCheckoutSessionController,
} from "@/infra/http";
import { CancelSubscriptionController } from "@/infra/http/controllers/subscription/cancel-subscription.controller";

export interface IControllerFactory {
  createRegisterUSerController(): RegisterUserController;
  createLoginController(): LoginController;
  createCreateGoogleOAuthUrlController(): CreateGoogleOAuthUrlController;
  createRefreshAccessTokenController(): RefreshAccessTokenController;
  createGetPlansController(): GetPlansController;
  createCreateSubscriptionController(): CreateSubscriptionController;
  createLoginOAuthController(): LoginOAuthGoogleController;
  createCreateRecoveryPasswordTokenController(): CreateRecoveryPasswordTokenController;
  createRecoveryPasswordController(): RecoveryPasswordController;
  createCreateCheckoutSessionController(): CreateCheckoutSessionController;
  createCancelSubscriptionController(): CancelSubscriptionController;
}
