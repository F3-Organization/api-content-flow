import {
  IPaymentGateway,
  IPaymentGatewayOutput,
  StripeAdapter,
} from "../../adapters";
import {
  IPaymentGatewayService,
  PaymentGatewayServiceInput,
} from "./interfaces/payment-gateway-service.interface";

export class PaymentGatewayService implements IPaymentGatewayService {
  constructor(private stripeAdapter: IPaymentGateway) {}

  async createSubscription(
    input: PaymentGatewayServiceInput.CreateSubscription,
  ): Promise<IPaymentGatewayOutput.CreateSubscription> {
    const customerId = await this.stripeAdapter.createCustomer(input.user);
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
    return subscription;
  }
}
