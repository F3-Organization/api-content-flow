import { DomainError } from "@/domain/error";

export type NotificationType = "reminder" | "suggestion";

export interface NotificationProps {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  sentAt: Date;
  read: boolean;
}

export class Notification {
  private props: NotificationProps;

  constructor(props: NotificationProps) {
    this.validateProps(props);
    this.props = { ...props };
  }

  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get type() {
    return this.props.type;
  }
  get message() {
    return this.props.message;
  }
  get sentAt() {
    return this.props.sentAt;
  }
  get read() {
    return this.props.read;
  }
  markRead() {
    this.props.read = true;
  }

  private validateProps(props: NotificationProps) {
    if (!props.userId) throw new DomainError("UserId is required");
    if (!props.type) throw new DomainError("Type is required");
    if (!props.message) throw new DomainError("Message is required");
    if (!props.sentAt) throw new DomainError("SentAt is required");
  }
}
