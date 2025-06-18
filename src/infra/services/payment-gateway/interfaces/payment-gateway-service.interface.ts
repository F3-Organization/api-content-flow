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
}

export interface IPaymentGatewayService {
  createSubscription(
    input: PaymentGatewayServiceInput.CreateSubscription,
  ): Promise<IPaymentGatewayOutput.CreateSubscription>;
  retrieveCustomer(
    customerId: string,
  ): Promise<Stripe.Customer | Stripe.DeletedCustomer>;
  retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription>;
}
