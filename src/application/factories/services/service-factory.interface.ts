import { IGoogleOAuthService, IPaymentGatewayService } from "@/infra/services";

export interface IServiceFactory {
  createPaymentGatewayService(): IPaymentGatewayService;
  createGoogleOAuthService(): IGoogleOAuthService;
}
