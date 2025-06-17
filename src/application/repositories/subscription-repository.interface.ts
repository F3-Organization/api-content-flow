import { Subscription, SubscriptionStatus } from "@/domain/entities";

export interface ISubscriptionRepository {
  save(input: Subscription): Promise<void>;
  update(input: Subscription): Promise<void>;
  getByUserId(userId: string): Promise<Subscription>;
}
