import { IPaymentGatewayService } from "@/infra/services";

export interface IServiceFactory {
  createPaymentGatewayService(): IPaymentGatewayService;
}
