import { Models } from "@/infra";

export interface ISubscriptionStripeDataDAO {
  save(data: Models.SubscriptionStripeData): Promise<void>;
  getAll(): Promise<Models.SubscriptionStripeData[]>;
  getById(id: string): Promise<Models.SubscriptionStripeData>;
  getBySubscriptionId(
    subscriptionId: string,
  ): Promise<Models.SubscriptionStripeData>;
}
