import { UserDAO } from "@/application";
import { ConnectionDatabase } from "../adapters/database/connection-database";
import { Models, Table } from "../models/tables";

export class UserDAODatabase implements UserDAO {
  constructor(private readonly connection: ConnectionDatabase) {}
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
