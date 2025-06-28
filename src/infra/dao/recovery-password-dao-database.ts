import {
  IRecoveryPasswordDAO,
  RecoveryPasswordDAONamespace,
} from "@/application";
import { IConnectionDatabase } from "../adapters";
import { Models, Table } from "../models";

export class RecoveryPasswordDAODatabase implements IRecoveryPasswordDAO {
  constructor(private connection: IConnectionDatabase) {}

  async save(data: RecoveryPasswordDAONamespace.Data): Promise<void> {
    await this.connection.insert({ table: Table.PasswordRecovery, data: data });
  }

  async update(data: RecoveryPasswordDAONamespace.Data): Promise<void> {
    await this.connection.update({
      table: Table.PasswordRecovery,
      where: { id: data.id },
      data: data,
    });
  }

  async getByToken(token: number): Promise<Models.PasswordRecovery | null> {
    const [result] = await this.connection.query<Models.PasswordRecovery>({
      table: Table.PasswordRecovery,
      where: { token: token },
    });
    return result;
  }
}
