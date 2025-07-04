import { DomainException } from "@/domain/error";

export interface TopicSuggestionProps {
  id: string;
  userId: string;
  topic: string;
  source: string;
  createdAt: Date;
}

export class TopicSuggestion {
  private props: TopicSuggestionProps;

  constructor(props: TopicSuggestionProps) {
    this.validateProps(props);
    this.props = { ...props };
  }

  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get topic() {
    return this.props.topic;
  }
  get source() {
    return this.props.source;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  private validateProps(props: TopicSuggestionProps) {
    if (!props.userId) throw new DomainException("UserId is required");
    if (!props.topic) throw new DomainException("Topic is required");
    if (!props.source) throw new DomainException("Source is required");
  }
}
