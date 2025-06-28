import { Models } from "@/infra";

export namespace RecoveryPasswordDAONamespace {
  export interface Data {
    id: string;
    user_id: string;
    token: number;
    expires_at: Date;
    used: boolean;
    created_at: Date;
  }
}

export interface IRecoveryPasswordDAO {
  save(data: RecoveryPasswordDAONamespace.Data): Promise<void>;
  getByToken(token: number): Promise<Models.PasswordRecovery | null>;
}
