import { IFactory } from "@/application/factories/factory.interface";
import { UserRepository } from "../repositories/user-repository";
import { ConnectionDatabase } from "../adapters/database/connection-database";
import { KnexConnection } from "../adapters/database/connection";
import { env } from "@/config/env";
import { CreateUserController } from "../http/controllers/create-user-controller";

const kenx = new KnexConnection(env.database);
const connection = new ConnectionDatabase(kenx.knexInstance);

export const Factory: IFactory = {
  connection: () => connection,

  repositoryFactory: {
    createUserRepository: () => new UserRepository(connection),
  },
  
  controllerFactory: {
    createCreateUSerController: () =>
      new CreateUserController(Factory.repositoryFactory),
  },
};
