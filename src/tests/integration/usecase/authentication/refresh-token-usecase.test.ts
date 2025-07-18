import {
  IFactory,
  IUseCase,
  RegisterUserUseCase,
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
import { registerUserMock } from "@/tests/infra/mocks/create-user-mocks";
import { Authentication, User } from "@/domain/entities";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { setupTestRabbitMq } from "@/tests/test-utils/setup-test-rabbitMq";
import { mockQueueFactory } from "@/tests/infra/mocks/factories/queue-factory-mock";

let factory: IFactory;
let createUserUseCase: IUseCase;
let userRepository: IUserRepository;
let authRepository: IAuthRepository;
let user: User | undefined;
let auth: Authentication;
let useCase: RefreshAccessTokenUseCase;

beforeAll(async () => {
  await startTestDB();
  factory = makeFactory(connection);
  userRepository = factory.repositoryFactory.createUserRepository();
  authRepository = factory.repositoryFactory.createAuthRepository();
  createUserUseCase = new RegisterUserUseCase(
    factory.repositoryFactory,
    mockQueueFactory,
  );
  await createUserUseCase.execute(registerUserMock.validUser);
  user = await userRepository.getByEmail(registerUserMock.validUser.email);
  auth = await authRepository.getByUserId(user!.getId);
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
