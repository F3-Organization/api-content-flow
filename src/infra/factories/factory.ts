import {
  AuthRepository,
  GetPlansController,
  PlanRepository,
  StripeAdapter,
  UserRepository,
} from "@/infra";
import {
  ConnectionDatabase,
  CreateUserController,
  LoginController,
  RefreshAccessTokenController,
} from "@/infra";

import { IFactory, ISubscriptionRepository } from "@/application";
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
      createSubscriptionRepository: () => new SubscriptionRepository(connection)
    },

    controllerFactory: {
      createCreateUSerController: () =>
        new CreateUserController(Factory.repositoryFactory),
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
