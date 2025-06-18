import {
  IAuthRepository,
  IPlanRepository,
  IUserRepository,
  ISubscriptionRepository,
  ISubscriptionStripeDataRepository,
} from "@/application";

export interface IRepositoryFactory {
  createUserRepository(): IUserRepository;
  createAuthRepository(): IAuthRepository;
  createPlanRepository(): IPlanRepository;
  createSubscriptionRepository(): ISubscriptionRepository;
  createSubscriptionStripeDataModelRepository(): ISubscriptionStripeDataRepository;
}
