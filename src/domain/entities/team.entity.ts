import { DomainError } from "@/domain/error";

export interface TeamProps {
  id: string;
  ownerId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Team {
  private props: TeamProps;

  constructor(props: TeamProps) {
    if (!props.ownerId) throw new DomainError("OwnerId is required");
    if (!props.name) throw new DomainError("Name is required");
    this.props = { ...props };
  }

  get id() {
    return this.props.id;
  }
  get ownerId() {
    return this.props.ownerId;
  }
  get name() {
    return this.props.name;
  }
  set name(value: string) {
    if (!value) throw new DomainError("Name is required");
    this.props.name = value;
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
}
