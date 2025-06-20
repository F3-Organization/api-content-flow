import { IGoogleOAuthAdapter, IPaymentGateway } from "@/infra";

export interface IAdaptersFactory {
  createStripeAdapter(): IPaymentGateway;
  createGoogleOAuthAdapter(): IGoogleOAuthAdapter;
}
