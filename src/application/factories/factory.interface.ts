import { IControllerFactory } from "@/infra/http/controllers/interfaces/factory/controller-factory.interface";
import { IConnectionDatabase } from "@/infra";
import {
  IAdaptersFactory,
  IQueueFactory,
  IRepositoryFactory,
  IServiceFactory,
} from "@/application/factories";

export interface IFactory {
  connection: () => IConnectionDatabase;
  adapterFactory: IAdaptersFactory;
  serviceFactory: IServiceFactory;
  repositoryFactory: IRepositoryFactory;
  controllerFactory: IControllerFactory;
  queueFactory: IQueueFactory;
}
