export namespace Table {
  export const User = "users";
  export const Authentication = "authentications";
  export const Plan = "plan";
  export const Subscription = "subscription";
}

export namespace Models {
  export type User = UserModel;
  export type Authentication = AuthenticationModel;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  is_active: boolean;
  email_verified: boolean;
  role: string;
  avatar?: string;
  updated_at: Date;
}

export interface AuthenticationModel {
  id: string;
  user_id: string;
  provider: string;
  password_hash: string;
  refresh_token: string;
  created_at: Date;
  updated_at: Date;
}

export interface PlanModel {
  id: string;
  name: string;
  price: number;
  description: string;
  features: Object; // Definir estrutura
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionModel {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  renewal_date: Date;
  trial_period: Date | null;
  is_trial: boolean;
  created_at: Date;
  end_date: Date;
}
