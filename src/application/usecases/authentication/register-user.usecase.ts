import { IRepositoryFactory } from "@/application/factories";
import { IUseCase } from "../interfaces/usecase.interface";
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
import { IRegisterUserNamespace } from "./interfaces/register-user.usecase.interface";
import { generatePasswordHash, generateToken } from "@/infra/services";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { DomainException } from "@/domain/error";

export class RegisterUserUseCase implements IUseCase {
  private userRepository: IUserRepository;
  constructor(private repositoryFactory: IRepositoryFactory) {
    this.userRepository = this.repositoryFactory.createUserRepository();
  }
  async execute(input: IRegisterUserNamespace.Input): Promise<any> {
    const { user, authentication } = await this.buildUser(input);
    const { userData, authData } = this.buildInput(user, authentication);
    const users = await this.userRepository.getByEmail(input.email);
    if (users) {
      throw new DomainException("User already exists", HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.save(userData, authData);
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
      refreshToken: await generateToken(user, "30d"),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { user, authentication };
  }

  private buildInput(user: User, authentication: Authentication) {
    const userData = {
      id: user.getId,
      name: user.getName,
      email: user.getEmail.getValue,
      cpf: user?.getCpf?.toString(),
      isActive: user.getIsActive,
      emailVerified: user.getEmailVerified,
      role: user.getRole.getRole,
      avatar: user.getAvatar,
      updatedAt: user.getUpdatedAt,
    };
    const authData = {
      id: authentication.getId,
      userId: authentication.getUserId,
      provider: authentication.getProvider,
      passwordHash: authentication.getPasswordHash,
      refreshToken: authentication.getRefreshToken,
      createdAt: authentication.createdAt,
      updatedAt: authentication.updatedAt,
    };
    return { userData, authData };
  }
}
