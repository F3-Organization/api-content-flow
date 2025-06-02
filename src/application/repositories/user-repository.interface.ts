import { AuthProvider, userRoleEnum } from "@/domain/entities";

export namespace IUserRepositoryNamespace {
  export interface CreateUser {
    id: string;
    name: string;
    email: string;
    cpf?: string;
    isActive: boolean;
    emailVerified: boolean;
    role: userRoleEnum;
    avatar?: string;
    updatedAt?: Date;
  }

  export interface CreateAuth {
    id: string;
    userId: string;
    provider: AuthProvider;
    passwordHash: string;
    accessToken: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
  }
}

export interface IUserRepository {
  createUser(
    user: IUserRepositoryNamespace.CreateUser,
    auth: IUserRepositoryNamespace.CreateAuth
  ): Promise<void>;
  getByEmail(email: string): Promise<any>;
}
