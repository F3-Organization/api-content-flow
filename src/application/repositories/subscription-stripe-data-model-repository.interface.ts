export namespace ISubscriptionStripeDataRepositoryNamespace {
  export interface Output {
    id: number;
    subscriptionId: string;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    stripePriceId?: string;
    stripeInvoiceId?: string;
    stripeStatus?: string;
    cancellationReason?: string;
    lastStripeEvent?: string;
    createdAt: Date;
    updatedAt: Date;
  }
}

export interface ISubscriptionStripeDataRepository {
  save(input: ISubscriptionStripeDataRepositoryNamespace.Output): Promise<void>;
  getAll(): Promise<ISubscriptionStripeDataRepositoryNamespace.Output[]>;
  getById(
    id: string,
  ): Promise<ISubscriptionStripeDataRepositoryNamespace.Output>;
  getBySubscriptionId(
    subscriptionId: string,
  ): Promise<ISubscriptionStripeDataRepositoryNamespace.Output>;
}
