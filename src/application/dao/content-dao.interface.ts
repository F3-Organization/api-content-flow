import { Content } from "@/domain/entities/content.entity";
import { Models } from "@/infra";

export interface IContentDAO {
  save(input: Models.Content): Promise<void>;
  update(input: Models.Content): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Models.Content | undefined>;
  getByUserId(userId: string): Promise<Models.Content | undefined>;
}
