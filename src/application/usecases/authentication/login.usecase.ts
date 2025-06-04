import { IRepositoryFactory } from "@/application/factories";
import { IUseCase } from "../usecase.interface";
import { IAuthRepository, IUserRepository } from "@/application/repositories";
import { AuthenticationNamespace } from "./interfaces/authentication.interface";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { comparePassword, generateToken, verifyToken } from "@/infra/services";
import { Authentication, User } from "@/domain/entities";

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
    await this.validateTokens(auth, user);
    return {
      accessToken: auth.getAccessToken,
      refreshToken: auth.getRefreshToken,
    };
  }

  private async validateTokens(auth: Authentication, user: User) {
    const isTokenAccessValid = verifyToken(auth.getAccessToken);
    const isTokenRefreshValid = verifyToken(auth.getRefreshToken);
    if (!isTokenAccessValid) {
      if (!isTokenRefreshValid) {
        auth.setRefreshToken = generateToken(
          {
            userId: user.getId,
            email: user.getEmail.getValue,
            role: user.getRole.getRoleValue,
          },
          "30d"
        );
      }
      auth.setAccessToken = generateToken({
        userId: user.getId,
        email: user.getEmail.getValue,
        role: user.getRole.getRoleValue,
      });
      await this.authRepository.update(auth);
    }
  }
}
