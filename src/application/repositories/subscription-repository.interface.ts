import { Subscription, SubscriptionStatus } from "@/domain/entities";

export interface ISubscriptionRepository {
  save(input: Subscription): Promise<void>;
  update(input: Subscription): Promise<void>;
  getById(id: string): Promise<Subscription | undefined>;
  getByUserId(userId: string): Promise<Subscription | undefined>;
}
