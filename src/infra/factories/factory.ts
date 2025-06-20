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
} from "@/infra";
import {
  ConnectionDatabase,
  RegisterUserController,
  LoginController,
  RefreshAccessTokenController,
} from "@/infra";

import { GoogleOAuthService, PaymentGatewayService } from "../services";
import { IFactory } from "@/application";

export function makeFactory(connection: ConnectionDatabase): IFactory {
  const Factory: IFactory = {
    connection: () => connection,

    adapterFactory: {
      createStripeAdapter: () => new StripeAdapter(),
      createGoogleOAuthAdapter: () => new GoogleOAuthAdapter(),
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
    },
  };
  return Factory;
}
