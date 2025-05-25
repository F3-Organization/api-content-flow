import { DomainError } from "@/domain/error";

export type TeamMemberRole = "owner" | "admin" | "member";

export interface TeamMemberProps {
  id: string;
  teamId: string;
  userId: string;
  role: TeamMemberRole;
  invitedAt: Date;
  joinedAt?: Date;
  permissions: string[];
}

export class TeamMember {
  private props: TeamMemberProps;

  constructor(props: TeamMemberProps) {
    this.validateProps(props);
    this.props = { ...props };
  }

  get id() {
    return this.props.id;
  }
  get teamId() {
    return this.props.teamId;
  }
  get userId() {
    return this.props.userId;
  }
  get role() {
    return this.props.role;
  }
  set role(value: TeamMemberRole) {
    if (!value) throw new DomainError("Role is required");
    this.props.role = value;
  }
  get invitedAt() {
    return this.props.invitedAt;
  }
  get joinedAt() {
    return this.props.joinedAt;
  }
  set joinedAt(value: Date | undefined) {
    this.props.joinedAt = value;
  }
  get permissions() {
    return this.props.permissions;
  }
  set permissions(value: string[]) {
    this.props.permissions = value;
  }

  private validateProps(props: TeamMemberProps) {
    if (!props.teamId) throw new DomainError("TeamId is required");
    if (!props.userId) throw new DomainError("UserId is required");
    if (!props.role) throw new DomainError("Role is required");
  }
}
