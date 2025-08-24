import {
  IRecoveryPasswordRepository,
  RecoveryPasswordRepositoryNamespace,
} from "@/application";
import { IConnectionDatabase } from "@/infra";
import { RecoveryPasswordDAODatabase } from "@/infra";
import { Models } from "@/infra";

export class RecoveryPasswordRepository implements IRecoveryPasswordRepository {
  private recoveryPasswordDAO: RecoveryPasswordDAODatabase;
  constructor(private connection: IConnectionDatabase) {
    this.recoveryPasswordDAO = new RecoveryPasswordDAODatabase(this.connection);
  }

  async save(input: RecoveryPasswordRepositoryNamespace.Data): Promise<void> {
    const formattedInput = this.formatToDatabase(input);
    await this.recoveryPasswordDAO.save(formattedInput);
  }

  async update(input: RecoveryPasswordRepositoryNamespace.Data): Promise<void> {
    const formattedInput = this.formatToDatabase(input);
    await this.recoveryPasswordDAO.update(formattedInput);
  }

  async getByToken(
    token: number,
  ): Promise<RecoveryPasswordRepositoryNamespace.Data | null> {
    const output = await this.recoveryPasswordDAO.getByToken(token);
    return this.formatToInput(output);
  }

  formatToInput(
    output: Models.PasswordRecovery | null,
  ): RecoveryPasswordRepositoryNamespace.Data | null {
    if (!output) return null;
    return {
      id: output.id,
      userId: output.user_id,
      token: output.token,
      expiresAt: output.expires_at,
      used: output.used,
      createdAt: output.created_at,
    };
  }

  private formatToDatabase(
    input: RecoveryPasswordRepositoryNamespace.Data,
  ): Models.PasswordRecovery {
    return {
      id: input.id,
      user_id: input.userId,
      token: input.token,
      expires_at: input.expiresAt,
      used: input.used,
      created_at: input.createdAt,
    };
  }
}
