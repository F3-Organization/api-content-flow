import { IContentDAO } from "@/application/dao/content-dao.interface";
import { IConnectionDatabase, Models, Table } from "@/infra";

export class ContentDaoDatabase implements IContentDAO {
  constructor(private connection: IConnectionDatabase) {}

  async getById(id: string): Promise<Models.Content> {
    const [result] = await this.connection.query<Models.Content>({
      table: Table.Content,
      where: { id: id },
    });
    return result;
  }

  async getByUserId(userId: string): Promise<Models.Content> {
    const [result] = await this.connection.query<Models.Content>({
      table: Table.Content,
      where: { user_id: userId },
    });
    return result;
  }

  async save(input: Models.Content): Promise<void> {
    await this.connection.insert({
      table: Table.Content,
      data: input,
    });
  }

  async update(input: Models.Content): Promise<void> {
    await this.connection.update({
      table: Table.Content,
      data: input,
      where: { id: input.id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.connection.delete({
      table: Table.Content,
      where: { id: id },
    });
  }
}
