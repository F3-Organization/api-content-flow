import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from "../../../domain/entities/payment.entity";

describe("Payment Entity", () => {
  const baseProps = {
    id: "pay-1",
    user_id: "user-1",
    plan_id: "plan-1",
    amount: 100.5,
    subscription_id: "sub-1",
    status: "pending" as PaymentStatus,
    method: "credit_card" as PaymentMethod,
    provider: "stripe",
    created_at: new Date("2023-01-01T00:00:00Z"),
    updated_at: new Date("2023-01-01T00:00:00Z"),
  };

  it("should create a Payment with required properties", () => {
    const payment = new Payment(baseProps);
    expect(payment.id).toBe(baseProps.id);
    expect(payment.user_id).toBe(baseProps.user_id);
    expect(payment.plan_id).toBe(baseProps.plan_id);
    expect(payment.amount).toBe(baseProps.amount);
    expect(payment.status).toBe(baseProps.status);
    expect(payment.method).toBe(baseProps.method);
    expect(payment.created_at).toEqual(baseProps.created_at);
    expect(payment.updated_at).toEqual(baseProps.updated_at);
  });

  it("should create a Payment with all optional properties", () => {
    const props = {
      ...baseProps,
      subscription_id: "sub-1",
      provider_payment_id: "ppid-1",
      provider_subscription_id: "psid-1",
      paid_at: new Date("2023-01-02T00:00:00Z"),
      error_message: "Some error",
      metadata: { foo: "bar" },
    };
    const payment = new Payment(props);
    expect(payment.subscription_id).toBe(props.subscription_id);

    expect(payment.paid_at).toEqual(props.paid_at);
    expect(payment.error_message).toBe(props.error_message);
  });

  it("should allow updating mutable fields", () => {
    const payment = new Payment(baseProps);
    payment.status = "paid";
    payment.method = "pix";
    payment.updated_at = new Date("2023-01-03T00:00:00Z");
    payment.paid_at = new Date("2023-01-04T00:00:00Z");
    payment.error_message = "Updated error";
    expect(payment.status).toBe("paid");
    expect(payment.method).toBe("pix");
    expect(payment.updated_at).toEqual(new Date("2023-01-03T00:00:00Z"));
    expect(payment.paid_at).toEqual(new Date("2023-01-04T00:00:00Z"));
    expect(payment.error_message).toBe("Updated error");
  });

  it("should handle different PaymentStatus and PaymentMethod values", () => {
    const statuses: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];
    const methods: PaymentMethod[] = [
      "credit_card",
      "pix",
      "boleto",
      "paypal",
      "custom_method",
    ];
    statuses.forEach((status) => {
      methods.forEach((method) => {
        const payment = new Payment({ ...baseProps, status, method });
        expect(payment.status).toBe(status);
        expect(payment.method).toBe(method);
      });
    });
  });
});
