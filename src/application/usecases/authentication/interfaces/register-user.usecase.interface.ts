import { AuthProvider, userRoleEnum } from "@/domain/entities";

export namespace IRegisterUserNamespace {
  export interface Input {
    name: string;
    email: string;
    role: userRoleEnum;
    avatar?: string;
    provider: AuthProvider;
    password: string;
  }
}
