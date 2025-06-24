import { IFactory, IUseCase, CreateGoogleAuthUrlUseCase } from "@/application";
import { DomainException } from "@/domain/error";
import { makeFactory } from "@/infra/factories/factory";
import { HttpStatus } from "@/infra/http/protocols.enum";
import {
  startTestDB,
  connection,
  stopTestDB,
} from "@/tests/test-utils/setup-test-db";

let factory: IFactory;
let useCase: CreateGoogleAuthUrlUseCase;

beforeAll(async () => {
  await startTestDB();
  factory = makeFactory(connection);
  useCase = new CreateGoogleAuthUrlUseCase(factory.serviceFactory);
}, 30000);

afterAll(async () => {
  await stopTestDB();
});

describe("CreateGoogleAuthUrlUseCase", () => {
  it("should create a valid Google Auth URL", async () => {
    const output = await useCase.execute({});
    expect(output.url).toBeDefined();
    expect(output.state).toBeDefined();
    expect(output.nonce).toBeDefined();
  });
});
