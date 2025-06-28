import {
  IAuthRepository,
  IRepositoryFactory,
  IUseCase,
  IUserRepository,
} from "@/application";
import { RefreshAccessTokenNamespace } from "../interfaces";
import { decodeToken, generateToken, verifyToken } from "@/infra/services";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { User } from "@/domain/entities";

export class RefreshAccessTokenUseCase implements IUseCase {
  private userRepository: IUserRepository;
  private authRepository: IAuthRepository;
  constructor(private repositoryFactory: IRepositoryFactory) {
    this.userRepository = this.repositoryFactory.createUserRepository();
    this.authRepository = this.repositoryFactory.createAuthRepository();
  }

  async execute(
    input: RefreshAccessTokenNamespace.Input,
  ): Promise<RefreshAccessTokenNamespace.Output> {
    const { refreshToken } = input;
    const isRefreshTokenValid = verifyToken(refreshToken);
    if (!isRefreshTokenValid) {
      throw new DomainException(
        "Invalid refresh token",
        HttpStatus.UNAUTHORIZED,
      );
    }
    const decodedToken = decodeToken(refreshToken);
    const user = await this.userRepository.getByEmail(decodedToken.email);
    if (!user) {
      throw new DomainException("User not found", HttpStatus.NOT_FOUND);
    }
    const auth = await this.authRepository.getByUserId(decodedToken.userId);
    const { newAccessToken, newRefreshToken } = this.getTokens(user);
    auth.setRefreshToken = newRefreshToken;
    await this.authRepository.update(auth);
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  private getTokens(user: User) {
    const newAccessToken = generateToken({ user: user, expiresIn: "1d" });
    const newRefreshToken = generateToken({ user: user, expiresIn: "30d" });
    return { newAccessToken, newRefreshToken };
  }
}
