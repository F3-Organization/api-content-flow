import {
  IAuthRepository,
  IPlanRepository,
  IUserRepository,
} from "@/application";

export interface IRepositoryFactory {
  createUserRepository(): IUserRepository;
  createAuthRepository(): IAuthRepository;
  createPlanRepository(): IPlanRepository;
}
