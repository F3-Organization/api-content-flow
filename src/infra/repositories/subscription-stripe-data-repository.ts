import {
  ISubscriptionStripeDataDAO,
  ISubscriptionStripeDataRepository,
  ISubscriptionStripeDataRepositoryNamespace,
} from "@/application";
import { IConnectionDatabase } from "../adapters";
import { SubscriptionStripeDataDAODatabase } from "../dao";
import { Models } from "../models";

export class SubscriptionStripeDataRepository
  implements ISubscriptionStripeDataRepository
{
  private subscriptionStripeDataDAO: ISubscriptionStripeDataDAO;
  constructor(private connection: IConnectionDatabase) {
    this.subscriptionStripeDataDAO = new SubscriptionStripeDataDAODatabase(
      this.connection,
    );
  }

  async save(
    input: ISubscriptionStripeDataRepositoryNamespace.Data,
  ): Promise<void> {
    const formattedData = this.formatToDatabase(input);
    await this.subscriptionStripeDataDAO.save(formattedData);
  }

  async update(
    input: ISubscriptionStripeDataRepositoryNamespace.Data,
  ): Promise<void> {
    const formattedData = this.formatToDatabase(input);
    await this.subscriptionStripeDataDAO.update(formattedData);
  }

  async getAll(): Promise<(ISubscriptionStripeDataRepositoryNamespace.Data | undefined)[]> {
    const data = await this.subscriptionStripeDataDAO.getAll();
    const output = Promise.all(data.map((s) => this.formatToOutput(s)));
    return output;
  }

  async getById(
    id: string,
  ): Promise<ISubscriptionStripeDataRepositoryNamespace.Data | undefined> {
    const data = await this.subscriptionStripeDataDAO.getById(id);
    return this.formatToOutput(data);
  }

  async getBySubscriptionId(
    subscriptionId: string,
  ): Promise<ISubscriptionStripeDataRepositoryNamespace.Data | undefined> {
    const data =
      await this.subscriptionStripeDataDAO.getBySubscriptionId(subscriptionId);
    return this.formatToOutput(data);
  }

  private formatToDatabase(
    input: ISubscriptionStripeDataRepositoryNamespace.Data,
  ) {
    const output: Models.SubscriptionStripeData = {
      id: input.id,
      subscription_id: input.subscriptionId,
      stripe_subscription_id: input.stripeSubscriptionId,
      stripe_customer_id: input.stripeCustomerId,
      stripe_payment_method_id: input.stripePaymentMethodId,
      stripe_price_id: input.stripePriceId,
      stripe_invoice_id: input.stripeInvoiceId,
      stripe_status: input.stripeStatus,
      cancellation_reason: input.cancellationReason,
      last_stripe_event: input.lastStripeEvent,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return output;
  }

  private formatToOutput(input: Models.SubscriptionStripeData) {
    if (!input) return;
    const output: ISubscriptionStripeDataRepositoryNamespace.Data = {
      id: input.id,
      subscriptionId: input.subscription_id,
      stripeSubscriptionId: input.stripe_subscription_id,
      stripeCustomerId: input.stripe_customer_id,
      stripePaymentMethodId: input.stripe_payment_method_id,
      stripePriceId: input.stripe_price_id,
      stripeInvoiceId: input.stripe_invoice_id,
      stripeStatus: input.stripe_status,
      cancellationReason: input.cancellation_reason,
      lastStripeEvent: input.last_stripe_event,
      createdAt: input.created_at,
      updatedAt: input.updated_at,
    };
    return output;
  }
}
