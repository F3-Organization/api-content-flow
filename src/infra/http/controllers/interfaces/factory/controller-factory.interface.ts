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
  GenerateContentController,
} from "@/infra/http";
import { CancelSubscriptionController } from "@/infra/http/controllers/subscription/cancel-subscription.controller";
import { ContentFormatController } from "@/infra/http/controllers/content/content-format.controller";

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
  createContentFormatController(): ContentFormatController;
  createGenerateContentController(): GenerateContentController;
}
