import { env } from "@/config/env";
import { User } from "@/domain/entities";
import { IPaymentGateway, StripeAdapter } from "@/infra";
import { userMocks } from "@/tests/infra/mocks/create-user-mocks";

let stripe: IPaymentGateway;
let user: User;
beforeAll(() => {
  stripe = new StripeAdapter();
  user = new User({ ...userMocks.validProps });
});

describe("Stripe Adapter Integration Tests", () => {
  it("Should handle succesful customer", async () => {
    const user = new User({ ...userMocks.validProps });
    const customerId = await stripe.createCustomer(user);
    expect(customerId).toBeDefined();
  });

  it("should handle successful charge", async () => {
    const customerId = await stripe.createCustomer(user);
    const output = await stripe.charge({
      customerId: customerId,
      amount: 49,
      currency: "BRL",
      paymentMethodId: "pm_card_visa",
      description: "Test charge for integration test",
    });
    expect(output.paymentId).toBeDefined();
    expect(output.clientSecret).toBeDefined();
  });

  it("should return an error for invalid payment method when trying to create a subscription", async () => {
    const customerId = await stripe.createCustomer(user);
    await expect(
      stripe.charge({
        customerId: customerId,
        amount: 49,
        currency: "BRL",
        paymentMethodId: "pm_card_vi",
        description: "Test charge for integration test",
      }),
    ).rejects.toThrow();
  });

  it("should create a subscription successfully", async () => {
    const customerId = await stripe.createCustomer(user);
    const cardOutput = await stripe.saveCard({
      customerId: customerId,
      paymentMethodId: "pm_card_visa",
    });
    const subscription = await stripe.createSubscription({
      customerId: customerId,
      priceId: env.stripe.price_ids.basic!,
      paymentMethod: cardOutput.paymentMethod,
    });
    expect(subscription.subscriptionId).toBeDefined();
    expect(subscription.clientSecret).toBeDefined();
  });

  it("should return an error for invalid payment method when trying to create a subscription", async () => {
    const customerId = await stripe.createCustomer(user);
    await stripe.saveCard({
      customerId: customerId,
      paymentMethodId: "pm_card_visa",
    });
    await expect(
      stripe.createSubscription({
        customerId: customerId,
        priceId: env.stripe.price_ids.basic!,
        paymentMethod: "pm_card_visa",
      }),
    ).rejects.toThrow();
  });

  it("should cancel a subscription successfully", async () => {
    const customerId = await stripe.createCustomer(user);
    const cardOutput = await stripe.saveCard({
      customerId: customerId,
      paymentMethodId: "pm_card_visa",
    });
    const subscription = await stripe.createSubscription({
      customerId: customerId,
      priceId: env.stripe.price_ids.basic!,
      paymentMethod: cardOutput.paymentMethod,
    });
    await stripe.cancelSubscription(subscription.subscriptionId!);
  }, 20000);

  it("should return an error if canceling a subscription fails", async () => {
    const customerId = await stripe.createCustomer(user);
    const cardOutput = await stripe.saveCard({
      customerId: customerId,
      paymentMethodId: "pm_card_visa",
    });
    await stripe.createSubscription({
      customerId: customerId,
      priceId: env.stripe.price_ids.basic!,
      paymentMethod: cardOutput.paymentMethod,
    });
    await expect(stripe.cancelSubscription("sub_id_invalid")).rejects.toThrow();
  }, 20000);

  it("should return an error if saveCard fails", async () => {
    const customerId = await stripe.createCustomer(user);
    await expect(
      stripe.saveCard({
        customerId: customerId,
        paymentMethodId: "invalid_payment_method_id",
      }),
    ).rejects.toThrow();
  });

  it("should refund a successful payment", async () => {
    const user = new User({ ...userMocks.validProps });
    const customerId = await stripe.createCustomer(user);

    await stripe.saveCard({
      customerId: customerId,
      paymentMethodId: "pm_card_visa",
    });
    const charge = await stripe.charge({
      customerId: customerId,
      amount: 49,
      currency: "BRL",
      paymentMethodId: "pm_card_visa",
      description: "Test charge for integration test",
    });
    await expect(stripe.refund(charge.paymentId!)).resolves.not.toThrow();
  });

  it("should return an error for invalid paymentId", async () => {
    await expect(stripe.refund("pi_invalido_ou_inexistente")).rejects.toThrow();
  });
});
