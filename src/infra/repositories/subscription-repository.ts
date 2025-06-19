import { ISubscriptionRepository } from "@/application";
import { Subscription, SubscriptionStatus } from "@/domain/entities";
import { IConnectionDatabase } from "../adapters";
import { SubscriptionDAODatabase } from "../dao";
import { Models, SubscriptionModel } from "../models";

export class SubscriptionRepository implements ISubscriptionRepository {
  subscriptionDAO: SubscriptionDAODatabase;
  constructor(private connection: IConnectionDatabase) {
    this.subscriptionDAO = new SubscriptionDAODatabase(this.connection);
  }
  async save(input: Subscription): Promise<void> {
    const formattedData = this.formatToDatabase(input);
    await this.subscriptionDAO.save(formattedData);
  }
  async update(input: Subscription): Promise<void> {
    const formattedData = this.formatToDatabase(input);
    await this.subscriptionDAO.update(formattedData);
  }

  async getByUserId(userId: string): Promise<Subscription | undefined> {
    const output = await this.subscriptionDAO.getByUserId(userId);
    const data = this.buildEntry(output);
    return data;
  }

  private formatToDatabase(input: Subscription): Models.Subscription {
    return {
      id: input.id,
      user_id: input.userId,
      plan_id: input.planId,
      status: input.status,
      trial_start: input.trialStart,
      trial_end: input.trialEnd,
      is_trial: input.isTrial,
      created_at: input.createdAt,
      updated_at: input.updatedAt,
    };
  }

  private buildEntry(output: SubscriptionModel) {
    if (!output) return;
    return new Subscription({
      id: output.id,
      userId: output.user_id,
      planId: output.plan_id,
      status: output.status as SubscriptionStatus,
      trialStart: output.trial_start,
      trialEnd: output.trial_end,
      isTrial: output.is_trial,
      createdAt: output.created_at,
      updatedAt: output.updated_at,
    });
  }
}
