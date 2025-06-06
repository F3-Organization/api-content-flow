import { IRepositoryFactory } from "@/application/factories";
import { IUseCase } from "../usecase.interface";
import { IAuthRepository, IUserRepository } from "@/application/repositories";
import { AuthenticationNamespace } from "./interfaces/authentication.interface";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { comparePassword, generateToken } from "@/infra/services";
import { User } from "@/domain/entities";

export class LoginUseCase implements IUseCase {
  private userRepository: IUserRepository;
  private authRepository: IAuthRepository;
  constructor(private repositoryFactory: IRepositoryFactory) {
    this.userRepository = this.repositoryFactory.createUserRepository();
    this.authRepository = this.repositoryFactory.createAuthRepository();
  }

  async execute(input: AuthenticationNamespace.LoginInput): Promise<any> {
    const user = await this.userRepository.getByEmail(input.email);
    if (!user)
      throw new DomainException("User not found", HttpStatus.NOT_FOUND);
    const auth = await this.authRepository.getByUserId(user.getId);
    const passwordMatch = await comparePassword(
      input.password,
      auth.getPasswordHash
    );
    if (!passwordMatch) {
      throw new DomainException("Invalid password", HttpStatus.UNAUTHORIZED);
    }
    const { accessToken, refreshToken } = this.setTokens(user);
    auth.setRefreshToken = refreshToken;
    await this.authRepository.update(auth);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private setTokens(user: User) {
    const accessToken = generateToken(user, "1h");
    const refreshToken = generateToken(user, "30d");
    return { accessToken, refreshToken };
  }
}
