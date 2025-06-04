import { UserDAO } from "@/application";
import { Models, Table } from "../models/tables";
import { IConnectionDatabase } from "../adapters/database/interfaces/connection-database.interface";

export class UserDAODatabase implements UserDAO {
  constructor(private readonly connection: IConnectionDatabase) {}

  async getByEmail(email: string): Promise<Models.User[]> {
    const result = await this.connection.query<Models.User>({
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
