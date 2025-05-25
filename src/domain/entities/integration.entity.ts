import { DomainError } from "@/domain/error";

export type IntegrationType =
  | "wordpress"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "google-analytics";

export interface IntegrationProps {
  id: string;
  userId: string;
  type: IntegrationType;
  accessToken: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Integration {
  private props: IntegrationProps;

  constructor(props: IntegrationProps) {
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
  get accessToken() {
    return this.props.accessToken;
  }
  set accessToken(value: string) {
    if (!value) throw new DomainError("AccessToken is required");
    this.props.accessToken = value;
    this.touch();
  }
  get isActive() {
    return this.props.isActive;
  }
  set isActive(value: boolean) {
    this.props.isActive = value;
    this.touch();
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  activate() {
    this.props.isActive = true;
    this.touch();
  }
  deactivate() {
    this.props.isActive = false;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
  private validateProps(props: IntegrationProps) {
    if (!props.userId) throw new DomainError("UserId is required");
    if (!props.type) throw new DomainError("Type is required");
    if (!props.accessToken) throw new DomainError("AccessToken is required");
  }
}
