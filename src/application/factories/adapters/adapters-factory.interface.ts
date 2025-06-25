import {
  IGoogleOAuthAdapter,
  INodemailerAdapter,
  IPaymentGateway,
  IRabbitMQAdapter,
} from "@/infra";

export interface IAdaptersFactory {
  createRabbitMqAdapter(): Promise<IRabbitMQAdapter>;
  createNodemailerAdapter(): INodemailerAdapter;
  createStripeAdapter(): IPaymentGateway;
  createGoogleOAuthAdapter(): IGoogleOAuthAdapter;
}
