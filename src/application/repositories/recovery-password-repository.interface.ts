export namespace RecoveryPasswordRepositoryNamespace {
  export interface Data {
    id: string;
    userId: string;
    token: number;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
  }
}

export interface IRecoveryPasswordRepository {
  save(input: RecoveryPasswordRepositoryNamespace.Data): Promise<void>;
  update(input: RecoveryPasswordRepositoryNamespace.Data): Promise<void>;
  getByToken(
    token: number,
  ): Promise<RecoveryPasswordRepositoryNamespace.Data | null>;
}
