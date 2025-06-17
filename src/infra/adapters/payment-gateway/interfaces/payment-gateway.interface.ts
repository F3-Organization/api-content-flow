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
    priceId: string;
    trialPeriodDays?: number;
    paymentMethod: string;
  }

  export interface SaveCard {
    customerId: string;
    paymentMethodId: string;
  }
}

export namespace IPaymentGatewayOutput {
  export interface Charge {
    paymentId?: string;
    clientSecret?: string | null;
  }
  export interface CreateSubscription {
    subscriptionId?: string;
    clientSecret?: string;
  }

  export interface SaveCard {
    paymentMethod: string;
  }
}

export interface IPaymentGateway {
  createCustomer(user: User): Promise<string>;
  charge(
    input: IPaymentGatewayInput.Charge,
  ): Promise<IPaymentGatewayOutput.Charge>;
  createSubscription(
    input: IPaymentGatewayInput.CreateSubscription,
  ): Promise<IPaymentGatewayOutput.CreateSubscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  refund(paymentId: string): Promise<void>;
  saveCard(
    input: IPaymentGatewayInput.SaveCard,
  ): Promise<IPaymentGatewayOutput.SaveCard>;
}
