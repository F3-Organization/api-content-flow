import {
  IAuthRepository,
  IPlanRepository,
  IUserRepository,
  ISubscriptionRepository,
  ISubscriptionStripeDataRepository,
  IRecoveryPasswordRepository,
} from "@/application";

export interface IRepositoryFactory {
  createUserRepository(): IUserRepository;
  createAuthRepository(): IAuthRepository;
  createPlanRepository(): IPlanRepository;
  createSubscriptionRepository(): ISubscriptionRepository;
  createSubscriptionStripeDataModelRepository(): ISubscriptionStripeDataRepository;
  createRecoveryPasswordRepository(): IRecoveryPasswordRepository;
}
