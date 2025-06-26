import {
  IRecoveryPasswordRepository,
  RecoveryPasswordRepositoryNamespace,
} from "@/application";
import { IConnectionDatabase } from "../adapters";
import { RecoveryPasswordDAODatabase } from "../dao/recovery-password-dao-database";
import { Models, PasswordRecoveryModel } from "../models";

export class RecoveryPasswordRepository implements IRecoveryPasswordRepository {
  private recoveryPasswordDAO: RecoveryPasswordDAODatabase;
  constructor(private connection: IConnectionDatabase) {
    this.recoveryPasswordDAO = new RecoveryPasswordDAODatabase(this.connection);
  }

  async save(input: RecoveryPasswordRepositoryNamespace.Data): Promise<void> {
    const formattedInput = this.formatToDatabase(input);
    await this.recoveryPasswordDAO.save(formattedInput);
  }

  async getByToken(
    token: string,
  ): Promise<RecoveryPasswordRepositoryNamespace.Data | null> {
    const output = await this.recoveryPasswordDAO.getByToken(token);
    return this.formatToInput(output);
  }
  formatToInput(
    output: PasswordRecoveryModel | null,
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
