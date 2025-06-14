import { Models } from "@/infra";

export interface SubscriptionDAO {
  save(input: any): Promise<void>;
  update(input: any): Promise<void>;
  getByUserId(userId: string): Promise<Models.Subscription>;
}
