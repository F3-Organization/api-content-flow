import { IAuthRepository } from "@/application";
import { IConnectionDatabase } from "../adapters/database/interfaces/connection-database.interface";
import { Models } from "../models/tables";
import { Authentication } from "@/domain/entities";
import { IAuthDAO } from "@/application/dao/auth-dao.interface";
import { AuthDAODatabase } from "../dao";

export class AuthRepository implements IAuthRepository {
  private authDAO: IAuthDAO;
  constructor(private connection: IConnectionDatabase) {
    this.authDAO = new AuthDAODatabase(this.connection);
  }
  async update(input: Authentication): Promise<void> {
    const formattedAuth = this.formatToDatabase(input);
    await this.authDAO.update(formattedAuth);
  }

  async getByUserId(id: string): Promise<Authentication> {
    const result = await this.authDAO.getByUserId(id);
    const output = this.buildEntry(result);
    return output;
  }

  private formatToDatabase(input: Authentication): Models.Authentication {
    return {
      id: input.getId,
      user_id: input.getUserId,
      password_hash: input.getPasswordHash,
      refresh_token: input.getRefreshToken,
      created_at: input.createdAt,
      updated_at: input.updatedAt,
    };
  }

  private buildEntry(input: Models.Authentication) {
    return new Authentication({
      id: input.id,
      userId: input.user_id,
      passwordHash: input.password_hash,
      refreshToken: input.refresh_token,
      createdAt: input.created_at,
      updatedAt: input.updated_at,
    });
  }
}
