import {
  AuthRepository,
  GetPlansController,
  PlanRepository,
  StripeAdapter,
  UserRepository,
  SubscriptionRepository,
  SubscriptionStripeDataRepository,
} from "@/infra";
import {
  ConnectionDatabase,
  RegisterUserController,
  LoginController,
  RefreshAccessTokenController,
} from "@/infra";

import { IFactory } from "@/application";
import { PaymentGatewayService } from "../services";

export function makeFactory(connection: ConnectionDatabase): IFactory {
  const Factory: IFactory = {
    connection: () => connection,

    adapters: {
      createStripeAdapter: () => new StripeAdapter(),
    },

    serviceFactory: {
      createPaymentGatewayService: () =>
        new PaymentGatewayService(Factory.adapters.createStripeAdapter()),
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
    },
  };
  return Factory;
}
