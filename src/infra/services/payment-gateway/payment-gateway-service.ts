import Stripe from "stripe";
import { IPaymentGateway, IPaymentGatewayOutput } from "@/infra";
import {
  IPaymentGatewayService,
  PaymentGatewayServiceInput,
} from "@/infra/services";
import {
  IRepositoryFactory,
  ISubscriptionStripeDataRepository,
  ISubscriptionStripeDataRepositoryNamespace,
} from "@/application";
import { v7 as uuidV7 } from "uuid";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";

export class PaymentGatewayService implements IPaymentGatewayService {
  subscriptionStripeDataRepository: ISubscriptionStripeDataRepository;
  constructor(
    private stripeAdapter: IPaymentGateway,
    private repositoryFactory: IRepositoryFactory,
  ) {
    this.subscriptionStripeDataRepository =
      this.repositoryFactory.createSubscriptionStripeDataModelRepository();
  }

  async createCheckoutSession(input: {
    priceId: string;
    userId: string;
  }): Promise<PaymentGatewayServiceInput.CheckoutSessionOutput> {
    const session = await this.stripeAdapter.createCheckoutSession(
      input.priceId,
      input.userId,
    );
    return {
      checkoutUrl: session.url,
    };
  }

  async createSubscription(
    input: PaymentGatewayServiceInput.CreateSubscription,
    subscriptionId: string,
  ): Promise<IPaymentGatewayOutput.CreateSubscription> {
    let customerId;
    const stripeData =
      await this.subscriptionStripeDataRepository.getBySubscriptionId(
        subscriptionId,
      );
    if (stripeData) customerId = stripeData.stripeCustomerId;
    else customerId = await this.stripeAdapter.createCustomer(input.user);

    const savedCard = await this.stripeAdapter.saveCard({
      customerId: customerId,
      paymentMethodId: input.paymentMethodId,
    });
    const subscription = await this.stripeAdapter.createSubscription({
      customerId: customerId,
      priceId: input.priceId,
      trialPeriodDays: input.trialPeriodDays,
      paymentMethod: savedCard.paymentMethod,
    });
    const formattedInput = this.buildToSave({
      subscriptionId: subscriptionId,
      subscription: subscription,
      customerId: customerId,
      savedCard: savedCard,
    });
    await this.subscriptionStripeDataRepository.save(formattedInput);
    return subscription;
  }

  async updateSubscription(
    input: PaymentGatewayServiceInput.CreateSubscription,
    stripeData: ISubscriptionStripeDataRepositoryNamespace.Data,
  ): Promise<IPaymentGatewayOutput.UpdateSubscription> {
    const savedCard = await this.stripeAdapter.saveCard({
      customerId: stripeData.stripeCustomerId,
      paymentMethodId: input.paymentMethodId,
    });
    const paymentMethod = this.getPaymentMethod(stripeData, savedCard);
    stripeData.stripePaymentMethodId = paymentMethod;
    await this.subscriptionStripeDataRepository.update(stripeData);
    return await this.stripeAdapter.updateSubscription(
      stripeData.stripeSubscriptionId,
      {
        default_payment_method: paymentMethod,
        items: [{ price: input.priceId }],
      },
    );
  }

  async retrieveCustomer(
    customerId: string,
  ): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    return this.stripeAdapter.retrieveCustomer(customerId);
  }

  async retrieveSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    return this.stripeAdapter.retrieveSubscription(subscriptionId);
  }

  private getPaymentMethod(
    stripeData: ISubscriptionStripeDataRepositoryNamespace.Data,
    savedCard: IPaymentGatewayOutput.SaveCard,
  ) {
    if (stripeData.stripePaymentMethodId !== savedCard.paymentMethod)
      return stripeData.stripePaymentMethodId;
    return savedCard.paymentMethod;
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    const stripeSubscriptionData:
      | ISubscriptionStripeDataRepositoryNamespace.Data
      | undefined =
      await this.subscriptionStripeDataRepository.getBySubscriptionId(
        subscriptionId,
      );
    if (!subscriptionId)
      throw new DomainException(
        "Stripe Subscription not found",
        HttpStatus.NOT_FOUND,
      );
    await this.stripeAdapter.cancelSubscription(subscriptionId);
    await this.subscriptionStripeDataRepository.update({
      ...stripeSubscriptionData!,
      stripeStatus: "canceled",
    });
    return true;
  }

  private buildToSave(input: {
    subscriptionId: string;
    subscription: IPaymentGatewayOutput.CreateSubscription;
    customerId: string;
    savedCard: IPaymentGatewayOutput.SaveCard;
  }): ISubscriptionStripeDataRepositoryNamespace.Data {
    return {
      id: uuidV7(),
      subscriptionId: input.subscriptionId,
      stripeSubscriptionId: input.subscription.subscriptionId!,
      stripeCustomerId: input.customerId,
      stripePaymentMethodId: input.savedCard.paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
