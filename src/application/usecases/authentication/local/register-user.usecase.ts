import { IQueueFactory, IRepositoryFactory } from "@/application/factories";
import { IUseCase } from "../../interfaces/usecase.interface";
import { IUserRepository } from "@/application/repositories";
import { v7 as uuidv7 } from "uuid";
import {
  Authentication,
  AuthProvider,
  CPF,
  Email,
  User,
  UserRole,
} from "@/domain/entities";
import { IRegisterUserNamespace } from "../interfaces/register-user.usecase.interface";
import {
  generatePasswordHash,
  generateToken,
  validatePassword,
} from "@/infra/services";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { DomainException } from "@/domain/error";
import { IQueue } from "@/infra";

export class RegisterUserUseCase implements IUseCase {
  private userRepository: IUserRepository;
  private queueEmail: IQueue;
  constructor(
    private repositoryFactory: IRepositoryFactory,
    private queueFactory: IQueueFactory,
  ) {
    this.userRepository = this.repositoryFactory.createUserRepository();
    this.queueEmail = this.queueFactory.createEmailQueue();
  }
  async execute(input: IRegisterUserNamespace.Input): Promise<any> {
    validatePassword(input.password);
    const { user, authentication } = await this.buildUser(input);
    const users = await this.userRepository.getByEmail(input.email);
    if (users) {
      throw new DomainException("User already exists", HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.save(user, authentication);
    this.queueEmail.enqueue({
      to: input.email,
      subject: "Welcome!",
      html: "<p>Thank you for registering.</p>",
    });
  }

  private async buildUser(input: IRegisterUserNamespace.Input) {
    const user = new User({
      id: uuidv7(),
      name: input.name,
      email: new Email(input.email),
      cpf: null,
      isActive: false,
      emailVerified: false,
      role: new UserRole(input.role),
      avatar: input.avatar,
      updatedAt: new Date(),
    });

    const authentication = new Authentication({
      id: uuidv7(),
      userId: user.getId,
      provider: input.provider as AuthProvider,
      passwordHash: await generatePasswordHash(input.password),
      refreshToken: await generateToken({ user: user, expiresIn: "30d" }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { user, authentication };
  }
}
