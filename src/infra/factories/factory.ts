import { IFactory } from "@/application";
import {
  GeminiService,
  GoogleOAuthService,
  PaymentGatewayService,
} from "../services";
import {
  AuthRepository,
  GetPlansController,
  PlanRepository,
  StripeAdapter,
  UserRepository,
  SubscriptionRepository,
  SubscriptionStripeDataRepository,
  CreateSubscriptionController,
  GoogleOAuthAdapter,
  CreateGoogleOAuthUrlController,
  LoginOAuthGoogleController,
  RabbitMQAdapter,
  NodemailerAdapter,
  ConnectionDatabase,
  RegisterUserController,
  LoginController,
  RefreshAccessTokenController,
  RecoveryPasswordRepository,
  EmailQueue,
  CreateRecoveryPasswordTokenController,
  RecoveryPasswordController,
  CreateCheckoutSessionController,
  PaymentRepository,
  CancelSubscriptionController,
  GeminiAdapter,
  ContentRepository,
  GenerateContentController,
  ContentFormatController,
} from "@/infra";

export function makeFactory(connection: ConnectionDatabase): IFactory {
  const Factory: IFactory = {
    connection: () => connection,

    adapterFactory: {
      createStripeAdapter: () => new StripeAdapter(),
      createGoogleOAuthAdapter: () => new GoogleOAuthAdapter(),
      createRabbitMqAdapter: async () => await RabbitMQAdapter.create(),
      createNodemailerAdapter: () => new NodemailerAdapter(),
      createGeminiAdapter: () => new GeminiAdapter(),
    },

    serviceFactory: {
      createPaymentGatewayService: () =>
        new PaymentGatewayService(
          Factory.adapterFactory.createStripeAdapter(),
          Factory.repositoryFactory,
        ),
      createGoogleOAuthService: () =>
        new GoogleOAuthService(Factory.adapterFactory),
      createGeminiService: () => new GeminiService(Factory.adapterFactory),
    },

    repositoryFactory: {
      createUserRepository: () => new UserRepository(connection),
      createAuthRepository: () => new AuthRepository(connection),
      createPlanRepository: () => new PlanRepository(connection),
      createSubscriptionRepository: () =>
        new SubscriptionRepository(connection),
      createSubscriptionStripeDataModelRepository: () =>
        new SubscriptionStripeDataRepository(connection),
      createRecoveryPasswordRepository: () =>
        new RecoveryPasswordRepository(connection),
      createPaymentRepository: () => new PaymentRepository(connection),
      createContentRepository: () => new ContentRepository(connection),
    },

    controllerFactory: {
      createRegisterUSerController: () =>
        new RegisterUserController(
          Factory.repositoryFactory,
          Factory.queueFactory,
        ),
      createLoginController: () =>
        new LoginController(Factory.repositoryFactory),
      createRefreshAccessTokenController: () =>
        new RefreshAccessTokenController(Factory.repositoryFactory),
      createGetPlansController: () =>
        new GetPlansController(Factory.repositoryFactory),
      createCreateSubscriptionController: () =>
        new CreateSubscriptionController(
          Factory.repositoryFactory,
          Factory.serviceFactory,
        ),
      createCreateGoogleOAuthUrlController: () =>
        new CreateGoogleOAuthUrlController(Factory.serviceFactory),
      createLoginOAuthController: () =>
        new LoginOAuthGoogleController(
          Factory.serviceFactory,
          Factory.repositoryFactory,
        ),
      createCreateRecoveryPasswordTokenController: () =>
        new CreateRecoveryPasswordTokenController(Factory),
      createRecoveryPasswordController: () =>
        new RecoveryPasswordController(Factory),
      createCreateCheckoutSessionController: () =>
        new CreateCheckoutSessionController(Factory),
      createCancelSubscriptionController: () =>
        new CancelSubscriptionController(
          Factory.repositoryFactory,
          Factory.serviceFactory,
        ),
      createContentFormatController: () => new ContentFormatController(),
      createGenerateContentController: () =>
        new GenerateContentController(
          Factory.repositoryFactory,
          Factory.serviceFactory,
        ),
    },

    queueFactory: {
      createEmailQueue: () => new EmailQueue(Factory.adapterFactory),
    },
  };
  return Factory;
}
