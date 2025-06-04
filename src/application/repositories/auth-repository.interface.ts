import { Authentication } from "@/domain/entities";

export interface IAuthRepository {
  update(input: Authentication): Promise<void>;
  getByUserId(id: string): Promise<Authentication>;
}
