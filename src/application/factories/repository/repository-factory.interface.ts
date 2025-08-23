import {
  IAuthRepository,
  IPlanRepository,
  IUserRepository,
  ISubscriptionRepository,
  ISubscriptionStripeDataRepository,
  IRecoveryPasswordRepository,
  IPaymentRepository,
  IContentRepository,
} from "@/application";

export interface IRepositoryFactory {
  createUserRepository(): IUserRepository;
  createAuthRepository(): IAuthRepository;
  createPlanRepository(): IPlanRepository;
  createSubscriptionRepository(): ISubscriptionRepository;
  createSubscriptionStripeDataModelRepository(): ISubscriptionStripeDataRepository;
  createRecoveryPasswordRepository(): IRecoveryPasswordRepository;
  createPaymentRepository(): IPaymentRepository;
  createContentRepository(): IContentRepository;
}
