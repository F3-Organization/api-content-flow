import { UserDAO } from "@/application";
import { ConnectionDatabase } from "../adapters/database/connection-database";
import { Models, Table } from "../models/tables";

export class UserDAODatabase implements UserDAO {
  constructor(private readonly connection: ConnectionDatabase) {}

  async getByEmail(email: string): Promise<any> {
    const result: any = await this.connection.query<Models.User>({
      table: Table.User,
      where: { email: email },
    });
    return result;
  }

  async createUser(
    user: Models.User,
    auth: Models.Authentication
  ): Promise<void> {
    await this.connection.transaction(async (trx) => {
      await trx.insert(user).into(Table.User);
      await trx.insert(auth).into(Table.Authentication);
    });
  }
}
