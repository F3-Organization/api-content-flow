import { IRepositoryFactory, IServiceFactory } from "@/application/factories";
import { IUseCase } from "../interfaces/usecase.interface";
import { generateToken, IGoogleOAuthService } from "@/infra/services";
import { IUserRepository } from "@/application";
import { GoogleOAuthAdapterNamespace } from "@/infra";
import { Email, User, UserRole, userRoleEnum } from "@/domain/entities";
import { v7 as uuidv7 } from "uuid";

export namespace LoginOAuthUseCaseNamespace {
  export interface Input {
    code: string;
    returnedState: string;
    savedState: string;
    nonce: string;
  }

  export interface Output {
    accessToken: string;
    refreshToken: string;
  }
}

export class LoginOAuthUseCase implements IUseCase {
  private googleOAuthService: IGoogleOAuthService;
  private userRepository: IUserRepository;
  constructor(
    private serviceFactory: IServiceFactory,
    private repositoryFactory: IRepositoryFactory,
  ) {
    this.googleOAuthService = this.serviceFactory.createGoogleOAuthService();
    this.userRepository = this.repositoryFactory.createUserRepository();
  }

  async execute(
    input: LoginOAuthUseCaseNamespace.Input,
  ): Promise<LoginOAuthUseCaseNamespace.Output> {
    const { code, returnedState, savedState, nonce } = input;

    const userInfo = await this.googleOAuthService.handlerCallback({
      code: code,
      returnedState: returnedState,
      savedState: savedState,
      savedNonce: nonce,
    });
    let user = await this.userRepository.getByEmail(userInfo.email);
    if (!user) {
      const buildedUser = this.buildEntry(userInfo);
      await this.userRepository.saveFromGoogle(buildedUser);
    }
    const accessToken = generateToken(user!);
    const refreshToken = generateToken(user!, "30d");
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private buildEntry(userInfo: GoogleOAuthAdapterNamespace.Output) {
    return new User({
      id: uuidv7(),
      name: userInfo.name,
      email: new Email(userInfo.email),
      cpf: null,
      isActive: true,
      emailVerified: true,
      role: new UserRole(userRoleEnum.member),
      avatar: userInfo.picture,
      updatedAt: new Date(),
    });
  }
}
