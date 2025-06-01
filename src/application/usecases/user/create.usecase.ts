import { IRepositoryFactory } from "@/application/factories";
import { IUseCase } from "../intefaces/usecase.interface";
import { IUserRepository } from "@/application/repositories";
import { v4 as uuidv4 } from 'uuid';
import {
  Authentication,
  AuthProvider,
  CPF,
  Email,
  User,
  UserRole,
} from "@/domain/entities";
import { ICreateUserNamespace } from "./interfaces/create-user.usecase.interface";
import {
  generateAccessToken,
  generatePasswordHash,
  generateRefreshToken,
} from "@/infra/services";

export class CreateUserUseCase implements IUseCase {
  private userRepository: IUserRepository;
  constructor(private repositoryFactory: IRepositoryFactory) {
    this.userRepository = this.repositoryFactory.createUserRepository();
  }
  async execute(input: {
    user: ICreateUserNamespace.CreateUser;
    auth: ICreateUserNamespace.CreateAuth;
  }): Promise<any> {
    const { user, authentication } = await this.buildUser(
      input.user,
      input.auth
    );
    const { userData, authData } = this.buildInput(user, authentication);

    await this.userRepository.createUser(userData, authData);
  }

  private async buildUser(
    inputUser: ICreateUserNamespace.CreateUser,
    inputAuth: ICreateUserNamespace.CreateAuth
  ) {
    const user = new User({
      id: uuidv4(),
      name: inputUser.name,
      email: new Email(inputUser.email),
      cpf: new CPF(inputUser.cpf),
      isActive: inputUser.isActive,
      emailVerified: inputUser.emailVerified,
      role: new UserRole(inputUser.role),
      avatar: inputUser.avatar,
      updatedAt: new Date(),
    });

    const authentication = new Authentication({
      id: uuidv4(),
      userId: user.getId,
      provider: inputAuth.provider as AuthProvider,
      passwordHash: await generatePasswordHash(inputAuth.passwordHash),
      accessToken: await generateAccessToken(user.getId),
      refreshToken: await generateRefreshToken(user.getId),
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
