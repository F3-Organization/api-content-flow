import { IUserRepository } from "@/application/repositories";

export interface IRepositoryFactory {
  createUserRepository(): IUserRepository;
}
