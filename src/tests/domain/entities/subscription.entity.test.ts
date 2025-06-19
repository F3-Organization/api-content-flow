import { DomainException } from "@/domain/error";
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
    trialStart: new Date(),
    trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    isTrial: false,
    hadTrial: false,
  };

  it("should create a subscription with valid props", () => {
    const sub = new Subscription(validProps);
    expect(sub.userId).toBe(validProps.userId);
    expect(sub.planId).toBe(validProps.planId);
    expect(sub.status).toBe("active");
  });

  it("should return an error if trialEnd is before trialStart", () => {
    const invalidProps = {
      ...validProps,
      trialStart: new Date(),
      trialEnd: new Date(Date.now() - 1000),
    };
    expect(() => new Subscription(invalidProps)).toThrow(
      new DomainException("Trial start date cannot be after trial end date."),
    );
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
    sub.planId = "id-2";
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
