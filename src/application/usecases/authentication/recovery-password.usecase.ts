import {
  IRecoveryPasswordRepository,
  IRepositoryFactory,
  IUserRepository,
  RecoveryPasswordRepositoryNamespace,
} from "@/application";
import { IUseCase } from "../interfaces/usecase.interface";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { generateToken } from "@/infra/services";
import { User } from "@/domain/entities";
import { v7 as uuidv7 } from "uuid";

export namespace RecoveryPasswordNamespace {
  export interface Input {
    email: string;
  }

  export interface Output {
    success: boolean;
    message: string;
  }
}
export class RecoveryPasswordUseCase implements IUseCase {
  private userRepository: IUserRepository;
  private recoveryPasswordRepository: IRecoveryPasswordRepository;
  constructor(private repositoryFactory: IRepositoryFactory) {
    this.userRepository = this.repositoryFactory.createUserRepository();
    this.recoveryPasswordRepository =
      this.repositoryFactory.createRecoveryPasswordRepository();
  }
  async execute(input: { email: string }): Promise<any> {
    const user = await this.userRepository.getByEmail(input.email);
    if (!user) {
      throw new DomainException("User not found", HttpStatus.NOT_FOUND);
    }
    const token = generateToken({ user: user, expiresIn: "30min" });
    const entry = this.buildEntry({ user, token });
    await this.recoveryPasswordRepository.save(entry);
  }

  private buildEntry(input: {
    user: User;
    token: string;
  }): RecoveryPasswordRepositoryNamespace.Data {
    const { user, token } = input;
    return {
      id: uuidv7(),
      userId: user.getId,
      token: token,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      used: false,
      createdAt: new Date(),
    };
  }
}
