import {
  IGoogleOAuthAdapter,
  INodemailerAdapter,
  IPaymentGateway,
  IRabbitMQAdapter,
} from "@/infra";
import { IAiGenerationAdapter } from "@/infra/adapters/ai-adapter";

export interface IAdaptersFactory {
  createRabbitMqAdapter(): Promise<IRabbitMQAdapter>;
  createNodemailerAdapter(): INodemailerAdapter;
  createStripeAdapter(): IPaymentGateway;
  createGoogleOAuthAdapter(): IGoogleOAuthAdapter;
  createGeminiAdapter(): IAiGenerationAdapter;
}
