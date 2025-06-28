export namespace ISubscriptionStripeDataRepositoryNamespace {
  export interface Data {
    id: string;
    subscriptionId: string;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    stripePaymentMethodId: string;
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
  save(input: ISubscriptionStripeDataRepositoryNamespace.Data): Promise<void>;
  update(input: ISubscriptionStripeDataRepositoryNamespace.Data): Promise<void>;
  getAll(): Promise<
    (ISubscriptionStripeDataRepositoryNamespace.Data | undefined)[]
  >;
  getById(
    id: string,
  ): Promise<ISubscriptionStripeDataRepositoryNamespace.Data | undefined>;
  getBySubscriptionId(
    subscriptionId: string,
  ): Promise<ISubscriptionStripeDataRepositoryNamespace.Data | undefined>;
}
