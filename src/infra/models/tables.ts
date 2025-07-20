export namespace Table {
  export const Plan = "content_flow.plan";
  export const User = "content_flow.users";
  export const Payment = "content_flow.payments";
  export const Subscription = "content_flow.subscription";
  export const Authentication = "content_flow.authentications";
  export const PasswordRecovery = "content_flow.password_recovery_tokens";
  export const subscriptionStripeData = "content_flow.subscription_stripe_data";
}

export namespace Models {
  export type User = UserModel;
  export type Plan = PlanModel;
  export type Subscription = SubscriptionModel;
  export type Authentication = AuthenticationModel;
  export type SubscriptionStripeData = SubscriptionStripeDataModel;
  export type PasswordRecovery = PasswordRecoveryModel;
  export type Payment = PaymentModel;
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
  password_hash: string;
  refresh_token: string;
  created_at: Date;
  updated_at: Date;
}

export interface PasswordRecoveryModel {
  id: string;
  user_id: string;
  token: number;
  expires_at: Date;
  used: boolean;
  created_at: Date;
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
  trial_start: Date;
  trial_end: Date;
  is_trial: boolean;
  had_trial: boolean;
  created_at: Date;
  updated_at: Date;
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

export interface SubscriptionStripeDataModel {
  id: string;
  subscription_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  stripe_payment_method_id: string;
  stripe_price_id?: string;
  stripe_invoice_id?: string;
  stripe_status?: string;
  cancellation_reason?: string;
  last_stripe_event?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentModel {
  id: string;
  user_id: string;
  plan_id: string;
  subscription_id: string;
  amount: number;
  status: string;
  method: string;
  created_at: Date;
  updated_at: Date;
  paid_at?: Date;
  error_message?: string;
}
