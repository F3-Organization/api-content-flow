import { DomainError } from "@/domain/error";

export type ContentFormat = "blog" | "social" | "email";

export interface ContentProps {
  id: string;
  userId: string;
  title: string;
  body: string;
  format: ContentFormat;
  topic: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Content {
  private props: ContentProps;

  constructor(props: ContentProps) {
    this.validateProps(props);
    this.props = { ...props };
  }

  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get title() {
    return this.props.title;
  }
  set title(value: string) {
    if (!value) throw new DomainError("Title is required");
    this.props.title = value;
    this.touch();
  }
  get body() {
    return this.props.body;
  }
  set body(value: string) {
    if (!value) throw new DomainError("Body is required");
    this.props.body = value;
    this.touch();
  }
  get format() {
    return this.props.format;
  }
  set format(value: ContentFormat) {
    if (!value) throw new DomainError("Format is required");
    this.props.format = value;
    this.touch();
  }
  get topic() {
    return this.props.topic;
  }
  set topic(value: string) {
    this.props.topic = value;
    this.touch();
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  private validateProps(props: ContentProps) {
    if (!props.userId) throw new DomainError("UserId is required");
    if (!props.title) throw new DomainError("Title is required");
    if (!props.body) throw new DomainError("Body is required");
    if (!props.format) throw new DomainError("Format is required");
  }
}
