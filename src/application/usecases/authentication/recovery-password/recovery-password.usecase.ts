import { IQueueFactory, IRepositoryFactory } from "@/application/factories";
import { IUseCase } from "../../interfaces/usecase.interface";
import {
  IAuthRepository,
  IRecoveryPasswordRepository,
  IUserRepository,
  RecoveryPasswordRepositoryNamespace,
} from "@/application";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";
import {
  comparePassword,
  generatePasswordHash,
  validatePassword,
} from "@/infra/services";
import { Authentication } from "@/domain/entities";
import { IQueue } from "@/infra";

export namespace RecoveryPasswordNamespace {
  export interface Input {
    token: number;
    password: string;
  }
}

export class RecoveryPasswordUseCase implements IUseCase {
  private recoveryPasswordRepository: IRecoveryPasswordRepository;
  private authRepository: IAuthRepository;
  private userRepository: IUserRepository;
  private queueEmail: IQueue;
  constructor(
    private repositoryFactory: IRepositoryFactory,
    private queueFactory: IQueueFactory,
  ) {
    this.recoveryPasswordRepository =
      this.repositoryFactory.createRecoveryPasswordRepository();
    this.authRepository = this.repositoryFactory.createAuthRepository();
    this.queueEmail = this.queueFactory.createEmailQueue();
    this.userRepository = this.repositoryFactory.createUserRepository();
  }
  async execute(input: RecoveryPasswordNamespace.Input): Promise<any> {
    const token = await this.recoveryPasswordRepository.getByToken(input.token);
    if (!token)
      throw new DomainException("Token not found", HttpStatus.NOT_FOUND);
    const auth = await this.authRepository.getByUserId(token.userId);
    await this.validateToken(token, auth, input);
    validatePassword(input.password);
    auth.setPasswordHash = await generatePasswordHash(input.password);
    await this.authRepository.update(auth);
    const user = await this.userRepository.getById(auth.getUserId);
    this.queueEmail.enqueue({
      to: user?.getEmail.getValue!,
      subject: "Password updated",
      html: "<p>Your password has been successfully updated.</p>",
    });
  }

  private async validateToken(
    token: RecoveryPasswordRepositoryNamespace.Data,
    auth: Authentication,
    input: RecoveryPasswordNamespace.Input,
  ) {
    if (token.expiresAt > new Date())
      throw new DomainException("Token has expired", HttpStatus.UNAUTHORIZED);
    const compare = await comparePassword(input.password, auth.getPasswordHash);
    if (!compare)
      throw new DomainException(
        "The password cannot be the same as the old one",
        HttpStatus.UNAUTHORIZED,
      );
  }
}
