import { IControllerFactory } from "@/infra/http/controllers/interfaces/factory/controller-factory.interface";
import { IRepositoryFactory } from "./repository/repository-factory.interface";

export interface IFactory {
  connection: () => any;
  repositoryFactory: IRepositoryFactory;
  controllerFactory: IControllerFactory;
}
