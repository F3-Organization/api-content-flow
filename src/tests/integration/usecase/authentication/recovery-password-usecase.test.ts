import {
  startTestDB,
  connection,
  stopTestDB,
} from "@/tests/test-utils/setup-test-db";
import {
  IFactory,
  RecoveryPasswordUseCase,
  RegisterUserUseCase,
} from "@/application";
import { makeFactory } from "@/infra/factories/factory";
import { setupTestRabbitMq } from "@/tests/test-utils/setup-test-rabbitMq";
import { registerUserMock } from "@/tests/infra/mocks/create-user-mocks";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { mockQueueFactory } from "@/tests/infra/mocks/factories/queue-factory-mock";

let useCase: RecoveryPasswordUseCase;
let registerUserUseCase: RegisterUserUseCase;
let factory: IFactory;
beforeAll(async () => {
  await startTestDB();
  factory = makeFactory(connection);
  useCase = new RecoveryPasswordUseCase(
    factory.repositoryFactory,
    mockQueueFactory,
  );
  registerUserUseCase = new RegisterUserUseCase(
    factory.repositoryFactory,
    mockQueueFactory,
  );
}, 200000);

afterAll(async () => {
  await stopTestDB();
});

describe("RecoveryPasswordUseCase Integration Tests", () => {
  it("should successfully recover the password for a valid user", async () => {
    await registerUserUseCase.execute(registerUserMock.validUser);
    const result = await useCase.execute({
      email: registerUserMock.validUser.email,
    });
    expect(result.message).toBe("Password recovery email sent successfully");
  });

  it("should fail to recover the password if user does not exist", async () => {
    await expect(
      useCase.execute({
        email: "nonexistent@example.com",
      }),
    ).rejects.toThrow(
      new DomainException("User not found", HttpStatus.NOT_FOUND),
    );
  });
});
