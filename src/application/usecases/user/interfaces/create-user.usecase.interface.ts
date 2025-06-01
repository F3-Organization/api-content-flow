import { AuthProvider, userRoleEnum } from "@/domain/entities";

export namespace ICreateUserNamespace {
  export interface CreateUser {
    id: string;
    name: string;
    email: string;
    cpf: string;
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
