import { ISubscriptionStripeDataDAO } from "@/application";
import { IConnectionDatabase } from "../adapters";
import { Models, Table } from "../models";

export class SubscriptionStripeDataDAODatabase
  implements ISubscriptionStripeDataDAO
{
  constructor(private connection: IConnectionDatabase) {}

  async save(data: Models.SubscriptionStripeData): Promise<void> {
    await this.connection.insert({
      table: Table.subscriptionStripeData,
      data: data,
    });
  }

  async update(data: Models.SubscriptionStripeData): Promise<void> {
    await this.connection.update({
      table: Table.subscriptionStripeData,
      where: { id: data.id },
      data: data,
    });
  }

  async getAll(): Promise<Models.SubscriptionStripeData[]> {
    return await this.connection.query<Models.SubscriptionStripeData>({
      table: Table.subscriptionStripeData,
      where: {},
    });
  }

  async getById(id: string): Promise<Models.SubscriptionStripeData> {
    const [result] = await this.connection.query<Models.SubscriptionStripeData>(
      {
        table: Table.subscriptionStripeData,
        where: { id: id },
      },
    );
    return result;
  }

  async getBySubscriptionId(subscriptionId: string): Promise<any> {
    const [result] = await this.connection.query<Models.SubscriptionStripeData>(
      {
        table: Table.subscriptionStripeData,
        where: { subscription_id: subscriptionId },
      },
    );
    return result;
  }
}
