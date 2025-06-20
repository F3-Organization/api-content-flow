import { IUserRepository } from "@/application";
import { UserDAODatabase } from "../dao/user-dao-database";
import { ConnectionDatabase } from "../adapters/database/connection-database";
import {
  Authentication,
  CPF,
  Email,
  User,
  UserRole,
  userRoleEnum,
} from "@/domain/entities";
import { Models } from "../models/tables";
import { GoogleOAuthAdapterNamespace } from "../adapters";

export class UserRepository implements IUserRepository {
  private userDAODatabase: UserDAODatabase;
  constructor(private connection: ConnectionDatabase) {
    this.userDAODatabase = new UserDAODatabase(this.connection);
  }

  async save(user: User, auth: Authentication): Promise<void> {
    const { formattedUser, formattedAuth } = this.formatToDatabase(user, auth);
    await this.userDAODatabase.save(formattedUser, formattedAuth);
  }

  async saveFromGoogle(
    input: GoogleOAuthAdapterNamespace.Output,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getById(id: string): Promise<User | undefined> {
    const result = await this.userDAODatabase.getById(id);
    return this.buildEntry(result);
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const result = await this.userDAODatabase.getByEmail(email);
    return this.buildEntry(result);
  }

  private formatToDatabase(user: User, auth: Authentication) {
    const formattedUser = {
      id: user.getId,
      name: user.getName,
      email: user.getEmail.getValue,
      cpf: user.getCpf?.toString(),
      is_active: user.getIsActive,
      email_verified: user.getEmailVerified,
      role: user.getRole.getRoleValue,
      avatar: user.getAvatar,
      updated_at: user.getUpdatedAt,
    };
    const formattedAuth = {
      id: auth.getId,
      user_id: auth.getUserId,
      provider: auth.getProvider,
      password_hash: auth.getPasswordHash,
      refresh_token: auth.getRefreshToken,
      created_at: auth.createdAt,
      updated_at: auth.updatedAt,
    };

    return { formattedUser, formattedAuth };
  }

  private buildEntry(input: Models.User): User | undefined {
    if (!input) return;
    return new User({
      id: input.id,
      name: input.name,
      email: new Email(input.email),
      cpf: input.cpf ? new CPF(input.cpf) : undefined,
      isActive: input.is_active,
      emailVerified: input.email_verified,
      role: new UserRole(userRoleEnum[input.role as keyof typeof userRoleEnum]),
      avatar: input.avatar,
      updatedAt: input.updated_at,
    });
  }
}
