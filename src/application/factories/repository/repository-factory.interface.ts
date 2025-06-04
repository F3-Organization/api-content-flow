import { IAuthRepository, IUserRepository } from "@/application/repositories";

export interface IRepositoryFactory {
  createUserRepository(): IUserRepository;
  createAuthRepository(): IAuthRepository;
}
