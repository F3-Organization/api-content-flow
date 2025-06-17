import { IControllerFactory } from "@/infra/http/controllers/interfaces/factory/controller-factory.interface";
import { IConnectionDatabase } from "@/infra";
import {
  IAdaptersFactory,
  IRepositoryFactory,
  IServiceFactory,
} from "@/application/factories";

export interface IFactory {
  connection: () => IConnectionDatabase;
  adapters: IAdaptersFactory;
  serviceFactory: IServiceFactory;
  repositoryFactory: IRepositoryFactory;
  controllerFactory: IControllerFactory;
}
