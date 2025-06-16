import { SubscriptionDAO } from "@/application/dao/subscription-dao.interface";
import { IConnectionDatabase } from "../adapters/database/interfaces/connection-database.interface";
import { Models, Table } from "..";

export class SubscriptionDAODatabase implements SubscriptionDAO {
  constructor(private connection: IConnectionDatabase) {}

  async save(input: Models.Subscription): Promise<void> {
    await this.connection.insert({
      table: Table.Subscription,
      data: input,
    });
  }

  async update(input: Models.Subscription): Promise<void> {
    await this.connection.update({
      table: Table.Subscription,
      where: { id: input.id },
      data: input,
    });
  }

  async getByUserId(userId: string): Promise<Models.Subscription> {
    const [result] = await this.connection.query<Models.Subscription>({
      table: Table.Subscription,
      where: { userId: userId },
    });
    return result;
  }
}
