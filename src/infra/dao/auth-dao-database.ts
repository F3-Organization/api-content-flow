import { IAuthDAO } from "@/application/dao/auth-dao.interface";
import { IConnectionDatabase } from "@/infra";
import { Models, Table } from "@/infra";

export class AuthDAODatabase implements IAuthDAO {
  constructor(private connection: IConnectionDatabase) {}
  async update(input: Models.Authentication): Promise<void> {
    await this.connection.update<Models.Authentication>({
      table: Table.Authentication,
      data: input,
      where: { id: input.id },
    });
  }

  async getByUserId(id: string): Promise<Models.Authentication> {
    const [result] = await this.connection.query<Models.Authentication>({
      table: Table.Authentication,
      where: { user_id: id },
    });
    return result;
  }
}
