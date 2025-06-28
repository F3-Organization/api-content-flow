import { RegisterUserUseCase, IFactory, IUseCase } from "@/application";
import { DomainException } from "@/domain/error";
import { makeFactory } from "@/infra/factories/factory";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { mockQueueFactory } from "@/tests/infra/mocks/factories/queue-factory-mock";
import {
  startTestDB,
  connection,
  stopTestDB,
} from "@/tests/test-utils/setup-test-db";

let factory: IFactory;
let useCase: IUseCase;

beforeAll(async () => {
  await startTestDB();
  factory = makeFactory(connection);
  useCase = new RegisterUserUseCase(
    factory.repositoryFactory,
    mockQueueFactory,
  );
}, 30000);

afterAll(async () => {
  await stopTestDB();
});

const input = {
  name: "Test User",
  email: "testuser@example.com",
  password: "securePassword123",
  role: 2,
  provider: "local",
};

describe("Create User Use Case", () => {
  it("should register an user successfully", async () => {
    await useCase.execute(input);
  });

  it("should return an error if user creation fails", async () => {
    await expect(useCase.execute(input)).rejects.toThrow(
      new DomainException("User already exists", HttpStatus.BAD_REQUEST),
    );
  });
});
