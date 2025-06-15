import { User } from "@/domain/entities";

export namespace IPaymentGatewayInput {
  export interface Charge {
    customerId: string;
    amount: number;
    currency: string;
    paymentMethodId: string;
    description: string;
  }

  export interface CreateSubscription {
    customerId: string;
    planId: string;
    priceId: string;
    startDate?: Date;
    trialPeriodDays?: number;
  }

  export interface SaveCard {
    customerId: string;
    sourceId: string;
  }
}

export interface IPaymentGateway {
  createCustomer(user: User): Promise<string>;
  charge(
    input: IPaymentGatewayInput.Charge,
  ): Promise<{ paymentId?: string; clientSecret?: string | null }>;
  createSubscription(
    input: IPaymentGatewayInput.CreateSubscription,
  ): Promise<{ subscriptionId?: string; clientSecret?: string }>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  refund(paymentId: string): Promise<void>;
  saveCard(input: IPaymentGatewayInput.SaveCard): Promise<void>;
}
