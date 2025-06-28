import { userRoleEnum } from "@/domain/entities";

export namespace IRegisterUserNamespace {
  export interface Input {
    name: string;
    email: string;
    role: userRoleEnum;
    avatar?: string;
    password: string;
  }
}
