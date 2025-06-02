export namespace Table {
  export const User = "users";
  export const Authentication = "authentications";
}

export namespace Models {
  export type User = UserModel;
  export type Authentication = AuthenticationModel;
}

export interface UserModel {
  id?: string;
  name: string;
  cpf?: string;
  is_active: boolean;
  email_verified: boolean;
  role: string;
  avatar?: string;
  updated_at?: Date;
}

export interface AuthenticationModel {
  id?: string;
  user_id?: string;
  provider?: string;
  password_hash: string;
  refresh_token?: string;
  created_at?: Date;
  updated_at?: Date;
}
