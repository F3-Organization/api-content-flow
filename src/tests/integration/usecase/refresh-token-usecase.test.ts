import {
  IFactory,
  IUseCase,
  CreateUserUseCase,
  IAuthRepository,
  IUserRepository,
  RefreshAccessTokenUseCase,
} from "@/application";
import { makeFactory } from "@/infra/factories/factory";
import {
  startTestDB,
  connection,
  stopTestDB,
} from "@/tests/test-utils/setup-test-db";
import { createUserMocks } from "@/tests/infra/mocks/create-user-mocks";
import { Authentication, User } from "@/domain/entities";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";

let factory: IFactory;
let createUserUseCase: IUseCase;
let userRepository: IUserRepository;
let authRepository: IAuthRepository;
let user: User;
let auth: Authentication;
let useCase: RefreshAccessTokenUseCase;

beforeAll(async () => {
  await startTestDB();
  factory = makeFactory(connection);
  userRepository = factory.repositoryFactory.createUserRepository();
  authRepository = factory.repositoryFactory.createAuthRepository();
  createUserUseCase = new CreateUserUseCase(factory.repositoryFactory);
  await createUserUseCase.execute(createUserMocks.validUser);
  user = await userRepository.getByEmail(createUserMocks.validUser.email);
  auth = await authRepository.getByUserId(user.getId);
  useCase = new RefreshAccessTokenUseCase(factory.repositoryFactory);
}, 30000);

afterAll(async () => {
  await stopTestDB();
});

describe("Refresh Token Use Case", () => {
  it("should refresh the access token successfully", async () => {
    const output = await useCase.execute({
      refreshToken: auth.getRefreshToken,
    });
    expect(output).toBeDefined();
    expect(output.accessToken).toBeDefined();
    expect(output.accessToken).toBeDefined();
    expect(output.refreshToken).not.toEqual(auth.getRefreshToken);
  });

  it("shoul return an error if refresh token is invalid", async () => {
    await expect(
      useCase.execute({
        refreshToken: "invalid_token",
      }),
    ).rejects.toThrow(
      new DomainException("Invalid refresh token", HttpStatus.UNAUTHORIZED),
    );
  });
});
