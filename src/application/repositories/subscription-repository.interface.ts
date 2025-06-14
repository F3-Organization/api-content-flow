import { Subscription, SubscriptionStatus } from "@/domain/entities";

export namespace ISubscriptionRepositoryNamespace {
  export interface Input {
    id: string;
    userId: string;
    planId: string;
    status: SubscriptionStatus;
    renewalDate: Date;
    autoRenew: boolean;
    trialStart: Date | null;
    trialEnd: Date | null;
    isTrial: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
}

export interface ISubscriptionRepository {
  save(input: ISubscriptionRepositoryNamespace.Input): Promise<void>;
  update(input: ISubscriptionRepositoryNamespace.Input): Promise<void>;
  getByUserId(userId: string): Promise<Subscription>;
}
