export namespace Table {
  export const User = "content_flow.users";
  export const Authentication = "content_flow.authentications";
  export const Plan = "content_flow.plan";
  export const Subscription = "content_flow.subscription";
}

export namespace Models {
  export type User = UserModel;
  export type Plan = PlanModel;
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
  trial_days: number;
  description: string;
  features: PlanFeatures;
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

export interface PlanFeatures {
  users: number;
  metrics: string[];
  support: string[];
  integrations: string[];
  content_formats: string[];
  posts_per_month: string;
  editorial_calendar: string[];
}
