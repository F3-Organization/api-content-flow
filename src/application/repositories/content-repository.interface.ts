import { Content } from "@/domain/entities/content.entity";
import { Models } from "@/infra";

export interface IContentRepository {
  save(input: Content): Promise<void>;
  update(input: Content): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Models.Content | undefined>;
  getByUserId(userId: string): Promise<Models.Content | undefined>;
}
