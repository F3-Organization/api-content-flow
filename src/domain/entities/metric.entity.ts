import { DomainError } from "@/domain/error";

export interface MetricProps {
  id: string;
  userId: string;
  contentId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  collectedAt: Date;
}

export class Metric {
  private props: MetricProps;

  constructor(props: MetricProps) {
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
  get views() {
    return this.props.views;
  }
  set views(value: number) {
    if (value < 0) throw new DomainError("Views must be >= 0");
    this.props.views = value;
  }
  get likes() {
    return this.props.likes;
  }
  set likes(value: number) {
    if (value < 0) throw new DomainError("Likes must be >= 0");
    this.props.likes = value;
  }
  get comments() {
    return this.props.comments;
  }
  set comments(value: number) {
    if (value < 0) throw new DomainError("Comments must be >= 0");
    this.props.comments = value;
  }
  get shares() {
    return this.props.shares;
  }
  set shares(value: number) {
    if (value < 0) throw new DomainError("Shares must be >= 0");
    this.props.shares = value;
  }
  get collectedAt() {
    return this.props.collectedAt;
  }

  private validateProps(props: MetricProps): void {
    if (!props.userId) throw new DomainError("UserId is required");
    if (!props.contentId) throw new DomainError("ContentId is required");
    if (props.views < 0) throw new DomainError("Views must be >= 0");
    if (props.likes < 0) throw new DomainError("Likes must be >= 0");
    if (props.comments < 0) throw new DomainError("Comments must be >= 0");
    if (props.shares < 0) throw new DomainError("Shares must be >= 0");
  }
}
