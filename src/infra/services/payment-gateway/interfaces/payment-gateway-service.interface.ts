import { ISubscriptionStripeDataRepositoryNamespace } from "@/application";
import { User } from "@/domain/entities";
import { IPaymentGatewayOutput } from "@/infra/adapters";
import Stripe from "stripe";

export namespace PaymentGatewayServiceInput {
  export interface CreateSubscription {
    user: User;
    planId: string;
    priceId: string;
    paymentMethodId: string;
    trialPeriodDays?: number;
  }

  export interface UpdateSubscription {
    user: User;
    planId: string;
    priceId: string;
    paymentMethodId: string;
  }

  export interface CheckoutSessionOutput {
    checkoutUrl: string | null;
  }
}

export interface IPaymentGatewayService {
  createCheckoutSession(input: {
    priceId: string;
    userId: string;
  }): Promise<PaymentGatewayServiceInput.CheckoutSessionOutput>;
  createSubscription(
    input: PaymentGatewayServiceInput.CreateSubscription,
    subscriptionId: string,
  ): Promise<IPaymentGatewayOutput.CreateSubscription>;
  updateSubscription(
    input: PaymentGatewayServiceInput.UpdateSubscription,
    stripeData: ISubscriptionStripeDataRepositoryNamespace.Data,
  ): Promise<IPaymentGatewayOutput.UpdateSubscription>;
  retrieveCustomer(
    customerId: string,
  ): Promise<Stripe.Customer | Stripe.DeletedCustomer>;
  retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
}
