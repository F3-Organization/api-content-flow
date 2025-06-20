import {
  Authentication,
  AuthProvider,
  User,
  userRoleEnum,
} from "@/domain/entities";
import { GoogleOAuthAdapterNamespace } from "@/infra";

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
    updatedAt: Date;
  }

  export interface CreateAuth {
    id: string;
    userId: string;
    provider: AuthProvider;
    passwordHash: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
  }
}

export interface IUserRepository {
  save(user: User, auth: Authentication): Promise<void>;
  getById(id: string): Promise<User | undefined>;
  getByEmail(email: string): Promise<User | undefined>;
  saveFromGoogle(input: GoogleOAuthAdapterNamespace.Output): Promise<void>;
}
