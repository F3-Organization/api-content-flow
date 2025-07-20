import { User } from "@/domain/entities";
import Stripe from "stripe";

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

  export interface UpdateSubscription {
    subscriptionId: string;
    data: Stripe.Subscription;
  }

  export interface SaveCard {
    paymentMethod: string;
  }

  export interface CheckoutSessionOutput {
    sessionId: string;
    url: string;
  }
}

export interface IPaymentGateway {
  createCheckoutSession(
    priceId: string,
    userID: string,
  ): Promise<Stripe.Checkout.Session>;
  createCustomer(user: User): Promise<string>;
  charge(
    input: IPaymentGatewayInput.Charge,
  ): Promise<IPaymentGatewayOutput.Charge>;
  createSubscription(
    input: IPaymentGatewayInput.CreateSubscription,
  ): Promise<IPaymentGatewayOutput.CreateSubscription>;
  updateSubscription(
    subscriptionId: string,
    data: Stripe.SubscriptionUpdateParams,
  ): Promise<IPaymentGatewayOutput.UpdateSubscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  refund(paymentId: string): Promise<void>;
  saveCard(
    input: IPaymentGatewayInput.SaveCard,
  ): Promise<IPaymentGatewayOutput.SaveCard>;
  retrieveCustomer(
    customerId: string,
  ): Promise<Stripe.Customer | Stripe.DeletedCustomer>;
  retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription>;
  retrievePaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod>;
}
