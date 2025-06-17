import { IUserRepository, IUserRepositoryNamespace } from "@/application";
import { UserDAODatabase } from "../dao/user-dao-database";
import { ConnectionDatabase } from "../adapters/database/connection-database";
import { CPF, Email, User, UserRole, userRoleEnum } from "@/domain/entities";
import { Models } from "../models/tables";

export class UserRepository implements IUserRepository {
  private userDAODatabase: UserDAODatabase;
  constructor(private connection: ConnectionDatabase) {
    this.userDAODatabase = new UserDAODatabase(this.connection);
  }

  async save(
    user: IUserRepositoryNamespace.CreateUser,
    auth: IUserRepositoryNamespace.CreateAuth,
  ): Promise<void> {
    const { formattedUser, formattedAuth } = this.formatToDatabase(user, auth);
    await this.userDAODatabase.save(formattedUser, formattedAuth);
  }

  async getById(id: string): Promise<User | undefined> {
    const result = await this.userDAODatabase.getById(id);
    return this.buildEntry(result);
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const result = await this.userDAODatabase.getByEmail(email);
    return this.buildEntry(result);
  }

  private formatToDatabase(
    user: IUserRepositoryNamespace.CreateUser,
    auth: IUserRepositoryNamespace.CreateAuth,
  ) {
    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      is_active: user.isActive,
      email_verified: user.emailVerified,
      role: new UserRole(user.role).getRoleValue,
      avatar: user.avatar,
      updated_at: user.updatedAt,
    };
    const formattedAuth = {
      id: auth.id,
      user_id: auth.userId,
      provider: auth.provider,
      password_hash: auth.passwordHash,
      refresh_token: auth.refreshToken,
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
