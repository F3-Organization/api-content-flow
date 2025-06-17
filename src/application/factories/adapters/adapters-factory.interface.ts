import { IPaymentGateway } from "@/infra";

export interface IAdaptersFactory {
  createStripeAdapter(): IPaymentGateway;
}
