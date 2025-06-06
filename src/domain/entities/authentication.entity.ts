export type AuthProvider = "local" | "google" | "github";

export interface AuthenticationProps {
  id: string;
  userId: string;
  provider: AuthProvider;
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
  get getProvider() {
    return this.props.provider;
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
