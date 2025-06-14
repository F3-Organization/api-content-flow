import {
  IAuthRepository,
  IPlanRepository,
  ISubscriptionRepository,
  IUserRepository,
} from "@/application";

export interface IRepositoryFactory {
  createUserRepository(): IUserRepository;
  createAuthRepository(): IAuthRepository;
  createPlanRepository(): IPlanRepository;
  createSubscriptionRepository(): ISubscriptionRepository;
}
