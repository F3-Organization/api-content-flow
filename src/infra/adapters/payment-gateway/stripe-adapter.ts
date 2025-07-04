import Stripe from "stripe";
import {
  IPaymentGateway,
  IPaymentGatewayInput,
  IPaymentGatewayOutput,
} from "./interfaces/payment-gateway.interface";
import { env } from "@/config/env";
import { User } from "@/domain/entities";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";

export class StripeAdapter implements IPaymentGateway {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(env.stripe.stripe_secret!);
  }

  async createCustomer(user: User): Promise<string> {
    const costumer = await this.stripe.customers.create({
      name: user.getName,
      email: user.getEmail.getValue,
      metadata: { userId: user.getId },
    });
    return costumer.id;
  }

  async charge(
    input: IPaymentGatewayInput.Charge,
  ): Promise<IPaymentGatewayOutput.Charge> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        customer: input.customerId,
        amount: Math.round(input.amount * 100),
        currency: input.currency,
        payment_method: input.paymentMethodId,
        confirm: true,
        description: input.description,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });
      return {
        paymentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (err) {
      throw new DomainException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createSubscription(
    input: IPaymentGatewayInput.CreateSubscription,
  ): Promise<IPaymentGatewayOutput.CreateSubscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: input.customerId,
        items: [{ price: input.priceId, quantity: 1 }],
        default_payment_method: input.paymentMethod,
        payment_settings: {
          payment_method_types: ["card"],
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.confirmation_secret"],
        trial_period_days: input.trialPeriodDays,
      });
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      return {
        subscriptionId: subscription.id,
        clientSecret: invoice.confirmation_secret?.client_secret,
      };
    } catch (err) {
      throw new DomainException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSubscription(
    subscriptionId: string,
    data: Stripe.SubscriptionUpdateParams,
  ): Promise<IPaymentGatewayOutput.UpdateSubscription> {
    try {
      const subscription = await this.stripe.subscriptions.update(
        subscriptionId,
        data,
      );
      return {
        subscriptionId: subscription.id,
        data: subscription,
      };
    } catch (err) {
      throw new DomainException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
    } catch (err) {
      throw new DomainException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refund(paymentId: string): Promise<void> {
    try {
      await this.stripe.refunds.create({ payment_intent: paymentId });
    } catch (err) {
      throw new DomainException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveCard(
    input: IPaymentGatewayInput.SaveCard,
  ): Promise<IPaymentGatewayOutput.SaveCard> {
    try {
      const attached = await this.stripe.paymentMethods.attach(
        input.paymentMethodId,
        {
          customer: input.customerId,
        },
      );
      await this.stripe.customers.update(input.customerId, {
        invoice_settings: { default_payment_method: attached.id },
      });
      return { paymentMethod: attached.id };
    } catch (err) {
      throw new DomainException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async retrieveCustomer(
    customerId: string,
  ): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    return await this.stripe.customers.retrieve(customerId);
  }

  async retrieveSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }
}
