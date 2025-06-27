import { IFactory } from "@/application";
import { GoogleOAuthService, PaymentGatewayService } from "../services";
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
  IQueue,
  EmailQueue,
  RecoveryPasswordController,
} from "@/infra";

export function makeFactory(connection: ConnectionDatabase): IFactory {
  const Factory: IFactory = {
    connection: () => connection,

    adapterFactory: {
      createStripeAdapter: () => new StripeAdapter(),
      createGoogleOAuthAdapter: () => new GoogleOAuthAdapter(),
      createRabbitMqAdapter: async () => await RabbitMQAdapter.create(),
      createNodemailerAdapter: () => new NodemailerAdapter(),
    },

    serviceFactory: {
      createPaymentGatewayService: () =>
        new PaymentGatewayService(
          Factory.adapterFactory.createStripeAdapter(),
          Factory.repositoryFactory,
        ),
      createGoogleOAuthService: () =>
        new GoogleOAuthService(Factory.adapterFactory),
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
    },

    controllerFactory: {
      createRegisterUSerController: () =>
        new RegisterUserController(Factory.repositoryFactory),
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
      createRecoveryPasswordController: () =>
        new RecoveryPasswordController(Factory),
    },

    queueFactory: {
      createEmailQueue: () => new EmailQueue(Factory.adapterFactory),
    },
  };
  return Factory;
}
