import {
  LoginUseCase,
  IFactory,
  IUseCase,
  RegisterUserUseCase,
} from "@/application";
import { makeFactory } from "@/infra/factories/factory";
import {
  startTestDB,
  connection,
  stopTestDB,
} from "@/tests/test-utils/setup-test-db";
import { registerUserMock } from "@/tests/infra/mocks/create-user-mocks";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { setupTestRabbitMq } from "@/tests/test-utils/setup-test-rabbitMq";
import { mockQueueFactory } from "@/tests/infra/mocks/factories/queue-factory-mock";

let factory: IFactory;
let createUserUseCase: IUseCase;
let loginUseCase: IUseCase;
beforeAll(async () => {
  await startTestDB();
  factory = makeFactory(connection);
  createUserUseCase = new RegisterUserUseCase(
    factory.repositoryFactory,
    mockQueueFactory,
  );
  loginUseCase = new LoginUseCase(factory.repositoryFactory);
}, 30000);

afterAll(async () => {
  await stopTestDB();
});

describe("Authentication Use Case", () => {
  it("should perform authentication correctly", async () => {
    await createUserUseCase.execute(registerUserMock.validUser);
    const output = await loginUseCase.execute({
      email: registerUserMock.validUser.email,
      password: registerUserMock.validUser.password,
    });
    expect(output.accessToken).toBeDefined();
    expect(output.refreshToken).toBeDefined();
  });

  it("Should return an error if user not found", async () => {
    await expect(
      loginUseCase.execute({
        email: registerUserMock.invalidUser.email,
        password: registerUserMock.invalidUser.password,
      }),
    ).rejects.toThrow(
      new DomainException("User not found", HttpStatus.NOT_FOUND),
    );
  });

  it("Should return an error if password is incorrect", async () => {
    await expect(
      loginUseCase.execute({
        email: registerUserMock.validUser.email,
        password: registerUserMock.invalidUser.password,
      }),
    ).rejects.toThrow(
      new DomainException("Invalid password", HttpStatus.UNAUTHORIZED),
    );
  });
});
