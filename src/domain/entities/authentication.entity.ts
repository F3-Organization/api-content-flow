export type AuthProvider = "local" | "google" | "github";

export interface AuthenticationProps {
  id: string;
  userId: string;
  provider: AuthProvider;
  passwordHash?: string;
  accessToken?: string;
  refreshToken?: string;
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
  get getPasswordHash() {
    return this.props.passwordHash;
  }
  get getAccessToken() {
    return this.props.accessToken;
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
