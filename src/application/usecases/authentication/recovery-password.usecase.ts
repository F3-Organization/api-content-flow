import {
  IQueueFactory,
  IRecoveryPasswordRepository,
  IRepositoryFactory,
  IUserRepository,
  RecoveryPasswordRepositoryNamespace,
} from "@/application";
import { IUseCase } from "../interfaces/usecase.interface";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { User } from "@/domain/entities";
import { v7 as uuidv7 } from "uuid";
import { IQueue } from "@/infra";

export namespace RecoveryPasswordNamespace {
  export interface Input {
    email: string;
  }

  export interface Output {
    message: string;
  }
}
export class RecoveryPasswordUseCase implements IUseCase {
  private emailQueue: IQueue;
  private userRepository: IUserRepository;
  private recoveryPasswordRepository: IRecoveryPasswordRepository;
  constructor(
    private repositoryFactory: IRepositoryFactory,
    private queueFactory: IQueueFactory,
  ) {
    this.userRepository = this.repositoryFactory.createUserRepository();
    this.recoveryPasswordRepository =
      this.repositoryFactory.createRecoveryPasswordRepository();
    this.emailQueue = this.queueFactory.createEmailQueue();
  }
  async execute(input: {
    email: string;
  }): Promise<RecoveryPasswordNamespace.Output> {
    const user = await this.userRepository.getByEmail(input.email);
    if (!user) {
      throw new DomainException("User not found", HttpStatus.NOT_FOUND);
    }
    const token = this.generateRecoveryToken();
    const entry = this.buildEntry({ user, token });
    await this.recoveryPasswordRepository.save(entry);
    this.emailQueue.enqueue({
      to: input.email,
      subject: "Password Recovery",
      html: `<p>Your recovery token is: <strong>${token}</strong></p>`,
    });
    return {
      message: "Password recovery email sent successfully",
    };
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

  private generateRecoveryToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
