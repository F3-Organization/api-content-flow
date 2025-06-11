import {
  AuthRepository,
  GetPlansController,
  PlanRepository,
  UserRepository,
} from "@/infra";
import {
  ConnectionDatabase,
  CreateUserController,
  LoginController,
  RefreshAccessTokenController,
} from "@/infra";

import { IFactory } from "@/application";

export function makeFactory(connection: ConnectionDatabase): IFactory {
  const Factory: IFactory = {
    connection: () => connection,

    repositoryFactory: {
      createUserRepository: () => new UserRepository(connection),
      createAuthRepository: () => new AuthRepository(connection),
      createPlanRepository: () => new PlanRepository(connection),
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
