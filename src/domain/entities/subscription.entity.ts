import { DomainException } from "@/domain/error";

export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "canceled"
  | "expired"
  | "pending";

export interface SubscriptionProps {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  trialStart: Date;
  trialEnd: Date;
  isTrial: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Subscription {
  private props: SubscriptionProps;

  constructor(props: SubscriptionProps) {
    this.validateProps(props);
    this.props = { ...props };
  }

  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get planId() {
    return this.props.planId;
  }
  set planId(value: string) {
    if (!value) throw new DomainException("Plan is required");
    this.props.planId = value;
    this.touch();
  }
  get status() {
    return this.props.status;
  }
  set status(value: SubscriptionStatus) {
    this.props.status = value;
    this.touch();
  }
  get trialStart(): Date {
    return this.props.trialStart;
  }
  set trialStart(value: Date) {
    this.props.trialStart = value;
  }
  get trialEnd(): Date {
    return this.props.trialEnd;
  }
  set trialEnd(value: Date) {
    this.props.trialEnd = value;
  }
  get isTrial(): boolean {
    return this.props.isTrial;
  }
  set isTrial(value: boolean) {
    this.props.isTrial = value;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  activate() {
    this.props.status = "active";
    this.touch();
  }
  cancel() {
    this.props.status = "canceled";
    this.touch();
  }
  expire() {
    this.props.status = "expired";
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  private validateProps(props: SubscriptionProps) {
    if (!props.userId) {
      throw new DomainException("UserId is required");
    }
    if (!props.planId) {
      throw new DomainException("PlanId is required");
    }
    this.validateDates(props);
  }

  private validateDates(props: SubscriptionProps) {
    if (props.trialStart > props.trialEnd) {
      throw new DomainException(
        "Trial start date cannot be after trial end date.",
      );
    }
  }
}
