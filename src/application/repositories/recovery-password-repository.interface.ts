export namespace RecoveryPasswordRepositoryNamespace {
  export interface Data {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
  }
}

export interface IRecoveryPasswordRepository {
  save(input: RecoveryPasswordRepositoryNamespace.Data): Promise<void>;
  getByToken(
    token: string,
  ): Promise<RecoveryPasswordRepositoryNamespace.Data | null>;
}
