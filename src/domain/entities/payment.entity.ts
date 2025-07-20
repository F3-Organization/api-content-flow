export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod =
  | "credit_card"
  | "pix"
  | "boleto"
  | "paypal"
  | string;

export class Payment {
  public readonly id: string;
  public readonly user_id: string;
  public readonly plan_id: string;
  public readonly subscription_id?: string;
  public readonly amount: number;
  public status: PaymentStatus;
  public method: PaymentMethod;
  public created_at: Date;
  public updated_at: Date;
  public paid_at?: Date;
  public error_message?: string;

  constructor(props: {
    id: string;
    user_id: string;
    plan_id: string;
    amount: number;
    status: PaymentStatus;
    method: PaymentMethod;
    created_at: Date;
    updated_at: Date;
    subscription_id: string;
    paid_at?: Date;
    error_message?: string;
  }) {
    this.id = props.id;
    this.user_id = props.user_id;
    this.plan_id = props.plan_id;
    this.amount = props.amount;
    this.status = props.status;
    this.method = props.method;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.subscription_id = props.subscription_id;
    this.paid_at = props.paid_at;
    this.error_message = props.error_message;
  }
}
