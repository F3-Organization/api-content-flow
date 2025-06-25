import {
  IGoogleOAuthAdapter,
  INodemailerAdapter,
  IPaymentGateway,
  IRabbitMQAdapter,
} from "@/infra";

export interface IAdaptersFactory {
  createRabbitMqAdapter(): IRabbitMQAdapter;
  createNodemailerAdapter(): INodemailerAdapter;
  createStripeAdapter(): IPaymentGateway;
  createGoogleOAuthAdapter(): IGoogleOAuthAdapter;
}
