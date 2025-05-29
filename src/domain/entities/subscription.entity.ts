import { DomainException } from '@/domain/error';

export type SubscriptionStatus = "active" | "inactive" | "canceled" | "expired";

export interface SubscriptionProps {
  id: string;
  userId: string;
  plan: string;
  status: SubscriptionStatus;
  renewalDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Subscription {
  private props: SubscriptionProps;

  constructor(props: SubscriptionProps) {
    if (!props.userId) throw new DomainException("UserId is required");
    if (!props.plan) throw new DomainException("Plan is required");
    this.props = { ...props };
  }

  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get plan() {
    return this.props.plan;
  }
  set plan(value: string) {
    if (!value) throw new DomainException("Plan is required");
    this.props.plan = value;
    this.touch();
  }
  get status() {
    return this.props.status;
  }
  set status(value: SubscriptionStatus) {
    this.props.status = value;
    this.touch();
  }
  get renewalDate() {
    return this.props.renewalDate;
  }
  set renewalDate(value: Date) {
    this.props.renewalDate = value;
    this.touch();
  }
  get autoRenew() {
    return this.props.autoRenew;
  }
  set autoRenew(value: boolean) {
    this.props.autoRenew = value;
    this.touch();
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
}
