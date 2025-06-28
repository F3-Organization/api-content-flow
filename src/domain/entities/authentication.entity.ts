export interface AuthenticationProps {
  id: string;
  userId: string;
  passwordHash: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Authentication {
  private props: AuthenticationProps;

  constructor(props: AuthenticationProps) {
    this.props = { ...props };
  }

  get getId() {
    return this.props.id;
  }
  get getUserId() {
    return this.props.userId;
  }
  set setPasswordHash(password: string) {
    this.props.passwordHash = password;
  }
  set setRefreshToken(token: string) {
    this.props.refreshToken = token;
  }
  get getPasswordHash() {
    return this.props.passwordHash;
  }
  get getRefreshToken() {
    return this.props.refreshToken;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
