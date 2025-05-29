import { DomainException } from "@/domain/error";

export type PublicationStatus = "scheduled" | "published" | "failed";

export interface PublicationProps {
  id: string;
  userId: string;
  contentId: string;
  platform: string;
  scheduledAt: Date;
  status: PublicationStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Publication {
  private props: PublicationProps;

  constructor(props: PublicationProps) {
    this.validateProps(props);
    this.props = { ...props };
  }

  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get contentId() {
    return this.props.contentId;
  }
  get platform() {
    return this.props.platform;
  }
  get scheduledAt() {
    return this.props.scheduledAt;
  }
  get status() {
    return this.props.status;
  }
  set status(value: PublicationStatus) {
    this.props.status = value;
    this.touch();
  }
  get publishedAt() {
    return this.props.publishedAt;
  }
  set publishedAt(value: Date | undefined) {
    this.props.publishedAt = value;
    this.touch();
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  markPublished(date: Date) {
    this.props.status = "published";
    this.props.publishedAt = date;
    this.touch();
  }
  markFailed() {
    this.props.status = "failed";
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  private validateProps(props: PublicationProps) {
    if (!props.userId) throw new DomainException("UserId is required");
    if (!props.contentId) throw new DomainException("ContentId is required");
    if (!props.platform) throw new DomainException("Platform is required");
    if (!props.scheduledAt) throw new DomainException("ScheduledAt is required");
    if (!props.status) throw new DomainException("Status is required");
  }
}
