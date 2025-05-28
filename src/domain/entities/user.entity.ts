import { DomainError } from "@/domain/error/index";
import { CPF, Email, UserRole, userRoleEnum } from "@/domain/entities/value-objects";

export interface UserProps {
  id: string;
  name: string;
  email: Email;
  cpf: CPF;
  isActive: boolean;
  emailVerified: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.validateProps(props);
    this.props = { ...props };
  }

  get getId() {
    return this.props.id;
  }
  get getName() {
    return this.props.name;
  }
  set setName(value: string) {
    if (!value) throw new DomainError("Name is required");
    this.props.name = value;
    this.touch();
  }
  get getEmail() {
    return this.props.email;
  }
  set setEmail(value: string) {
    if (!value) throw new DomainError("Email is required");
    this.props.email = new Email(value);
    this.touch();
  }
  get setCpf() {
    return this.props.cpf;
  }

  set setCpf(value: CPF) {
    this.props.cpf = value;
    this.touch();
  }
  get getIsActive() {
    return this.props.isActive;
  }
  activate() {
    this.props.isActive = true;
    this.touch();
  }
  deactivate() {
    this.props.isActive = false;
    this.touch();
  }
  get getEmailVerified() {
    return this.props.emailVerified;
  }
  verifyEmail() {
    this.props.emailVerified = true;
    this.touch();
  }

  get getRoleValue() {
    return this.props.role.getRoleValue;
  }

  get getRole() {
    return this.props.role.getRole;
  }

  set setRole(value: userRoleEnum) {
    this.props.role = new UserRole(value);
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

  private validateProps(props: UserProps) {
    if (!props.name) throw new DomainError("Name is required");
    if (!props.email) throw new DomainError("Email is required");
    if (!props.cpf) throw new DomainError("CPF is required");
    if (!(props.cpf instanceof CPF))
      throw new DomainError("CPF must be a valid CPF value object");
  }
}
