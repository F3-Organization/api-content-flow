import {
  IAIService,
  IGoogleOAuthService,
  IPaymentGatewayService,
} from "@/infra/services";

export interface IServiceFactory {
  createPaymentGatewayService(): IPaymentGatewayService;
  createGoogleOAuthService(): IGoogleOAuthService;
  createGeminiService(): IAIService;
}
