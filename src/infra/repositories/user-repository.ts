import { IUserRepository, IUserRepositoryNamespace } from "@/application";
import { UserDAODatabase } from "../dao/user-dao-database";
import { ConnectionDatabase } from "../adapters/database/connection-database";
import { UserRole } from "@/domain/entities";

export class UserRepository implements IUserRepository {
  private userDAODatabase: UserDAODatabase;
  constructor(private connection: ConnectionDatabase) {
    this.userDAODatabase = new UserDAODatabase(this.connection);
  }
  async createUser(
    user: IUserRepositoryNamespace.CreateUser,
    auth: IUserRepositoryNamespace.CreateAuth
  ): Promise<void> {
    const { formattedUser, formattedAuth } = this.formatToDatabase(user, auth);
    const result = await this.userDAODatabase.createUser(
      formattedUser,
      formattedAuth
    );
    return result;
  }

  private formatToDatabase(
    user: IUserRepositoryNamespace.CreateUser,
    auth: IUserRepositoryNamespace.CreateAuth
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
      userId: auth.userId,
      provider: auth.provider,
      password_hash: auth.passwordHash,
      access_token: auth.accessToken,
      refresh_token: auth.refreshToken,
      created_at: auth.createdAt,
      updated_at: auth.updatedAt,
    };

    return { formattedUser, formattedAuth };
  }
}
