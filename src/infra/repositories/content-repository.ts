import { IContentRepository } from "@/application";
import { Content } from "@/domain/entities/content.entity";
import { ContentDaoDatabase, IConnectionDatabase, Models } from "@/infra";

export class ContentRepository implements IContentRepository {
  private contentDAO: ContentDaoDatabase;
  constructor(private connection: IConnectionDatabase) {
    this.contentDAO = new ContentDaoDatabase(this.connection);
  }

  async save(input: Content): Promise<void> {
    const built: Models.Content = this.buildEntry(input);
    await this.contentDAO.save(built);
  }

  async update(input: Content): Promise<void> {
    const build: Models.Content = this.buildEntry(input);
    await this.contentDAO.update(build);
  }

  async delete(id: string): Promise<void> {
    await this.contentDAO.delete(id);
  }

  async getById(id: string): Promise<Models.Content | undefined> {
    return await this.contentDAO.getById(id);
  }

  async getByUserId(userId: string): Promise<Models.Content | undefined> {
    return await this.contentDAO.getByUserId(userId);
  }

  private buildEntry(input: Content): Models.Content {
    return {
      id: input.id,
      user_id: input.userId,
      title: input.title,
      body: input.body,
      format: input.format,
      topic: input.topic,
      created_at: input.createdAt,
      updated_at: input.updatedAt,
    };
  }
}
