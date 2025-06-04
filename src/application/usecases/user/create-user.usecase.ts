import { IRepositoryFactory } from "@/application/factories";
import { IUseCase } from "../usecase.interface";
import { IUserRepository } from "@/application/repositories";
import { v4 as uuidv4 } from "uuid";
import {
  Authentication,
  AuthProvider,
  CPF,
  Email,
  User,
  UserRole,
} from "@/domain/entities";
import { ICreateUserNamespace } from "./interfaces/create-user.usecase.interface";
import { generatePasswordHash, generateToken } from "@/infra/services";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { DomainException } from "@/domain/error";

export class CreateUserUseCase implements IUseCase {
  private userRepository: IUserRepository;
  constructor(private repositoryFactory: IRepositoryFactory) {
    this.userRepository = this.repositoryFactory.createUserRepository();
  }
  async execute(input: ICreateUserNamespace.Input): Promise<any> {
    const { user, authentication } = await this.buildUser(input);
    const { userData, authData } = this.buildInput(user, authentication);
    const users = await this.userRepository.getByEmail(input.email);
    if (users) {
      throw new DomainException("User already exists", HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.createUser(userData, authData);
  }

  private async buildUser(input: ICreateUserNamespace.Input) {
    const user = new User({
      id: uuidv4(),
      name: input.name,
      email: new Email(input.email),
      cpf: input.cpf ? new CPF(input.cpf) : null,
      isActive: input.isActive || false,
      emailVerified: input.emailVerified || false,
      role: new UserRole(input.role),
      avatar: input.avatar,
      updatedAt: new Date(),
    });

    const authentication = new Authentication({
      id: uuidv4(),
      userId: user.getId,
      provider: input.provider as AuthProvider,
      passwordHash: await generatePasswordHash(input.password),
      accessToken: await generateToken({
        userId: user.getId,
        email: user.getEmail.getValue,
        role: user.getRole.getRoleValue,
      }),
      refreshToken: await generateToken(
        {
          userId: user.getId,
          email: user.getEmail.getValue,
          role: user.getRole.getRoleValue,
        },
        "30d"
      ),
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
      accessToken: authentication.getAccessToken,
      refreshToken: authentication.getRefreshToken,
      createdAt: authentication.createdAt,
      updatedAt: authentication.updatedAt,
    };
    return { userData, authData };
  }
}
