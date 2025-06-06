import { IFactory } from "@/application/factories/factory.interface";
import { UserRepository } from "../repositories/user-repository";
import { ConnectionDatabase } from "../adapters/database/connection-database";
import { CreateUserController } from "../http/controllers/create-user.controller";
import { AuthRepository } from "../repositories";
import { LoginController } from "../http/controllers/login.controller";
import { RefreshAccessTokenController } from "../http";

export function makeFactory(connection: ConnectionDatabase): IFactory {
  const Factory: IFactory = {
    connection: () => connection,

    repositoryFactory: {
      createUserRepository: () => new UserRepository(connection),
      createAuthRepository: () => new AuthRepository(connection),
    },

    controllerFactory: {
      createCreateUSerController: () =>
        new CreateUserController(Factory.repositoryFactory),
      createLoginController: () =>
        new LoginController(Factory.repositoryFactory),
      createRefreshAccessTokenController: () =>
        new RefreshAccessTokenController(Factory.repositoryFactory),
    },
  };
  return Factory;
}
