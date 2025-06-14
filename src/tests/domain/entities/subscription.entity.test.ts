import {
  Subscription,
  SubscriptionProps,
  SubscriptionStatus,
} from "../../../domain/entities/subscription.entity";

describe("Subscription Entity", () => {
  const validProps: SubscriptionProps = {
    id: "sub-1",
    userId: "user-1",
    planId: "id-1",
    status: "active" as SubscriptionStatus,
    renewalDate: new Date(),
    autoRenew: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isTrial: false,
  };

  it("should create a subscription with valid props", () => {
    const sub = new Subscription(validProps);
    expect(sub.id).toBe(validProps.id);
    expect(sub.userId).toBe(validProps.userId);
    expect(sub.planId).toBe(validProps.planId);
    expect(sub.status).toBe("active");
    expect(sub.autoRenew).toBe(true);
  });

  it("should throw error if userId is empty", () => {
    expect(() => new Subscription({ ...validProps, userId: "" })).toThrow(
      "UserId is required",
    );
  });

  it("should update plan and updatedAt", async () => {
    const sub = new Subscription(validProps);
    const oldUpdatedAt = sub.updatedAt;
    await new Promise((r) => setTimeout(r, 2));
    sub.planId = "id-2"
    expect(sub.planId).toBe("id-2");
    expect(sub.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it("should update status and updatedAt", async () => {
    const sub = new Subscription(validProps);
    const oldUpdatedAt = sub.updatedAt;
    await new Promise((r) => setTimeout(r, 2));
    sub.status = "canceled";
    expect(sub.status).toBe("canceled");
    expect(sub.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it("should update renewalDate and updatedAt", async () => {
    const sub = new Subscription(validProps);
    const oldUpdatedAt = sub.updatedAt;
    const newDate = new Date(Date.now() + 100000);
    await new Promise((r) => setTimeout(r, 2));
    sub.renewalDate = newDate;
    expect(sub.renewalDate).toBe(newDate);
    expect(sub.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it("should update autoRenew and updatedAt", async () => {
    const sub = new Subscription(validProps);
    const oldUpdatedAt = sub.updatedAt;
    await new Promise((r) => setTimeout(r, 2));
    sub.autoRenew = false;
    expect(sub.autoRenew).toBe(false);
    expect(sub.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it("should activate, cancel, and expire subscription", () => {
    const sub = new Subscription(validProps);
    sub.cancel();
    expect(sub.status).toBe("canceled");
    sub.activate();
    expect(sub.status).toBe("active");
    sub.expire();
    expect(sub.status).toBe("expired");
  });
});
