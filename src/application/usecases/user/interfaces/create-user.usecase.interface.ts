import { AuthProvider, userRoleEnum } from "@/domain/entities";

export namespace ICreateUserNamespace {
  export interface Input {
    id: string;
    name: string;
    email: string;
    cpf: string;
    isActive: boolean;
    emailVerified: boolean;
    role: userRoleEnum;
    avatar?: string;
    provider: AuthProvider;
    password: string;
    updatedAt?: Date;
  }
}
