import {
  connection,
  startTestDB,
  stopTestDB,
} from "@/tests/test-utils/setup-test-db";
import { makeFactory } from "@/infra/factories/factory";
import {
  CreateCheckoutSessionNamespace,
  CreateCheckoutSessionUseCase,
  IFactory,
  IUserRepository,
  RegisterUserUseCase,
} from "@/application";
import { mockQueueFactory } from "@/tests/infra/mocks/factories/queue-factory-mock";
import { registerUserMock } from "@/tests/infra/mocks/create-user-mocks";
import { env } from "@/config/env";
import Input = CreateCheckoutSessionNamespace.Input;
import { PaymentGatewayServiceInput } from "@/infra/services";
import CheckoutSessionOutput = PaymentGatewayServiceInput.CheckoutSessionOutput;
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { v7 } from "uuid";

let createCheckoutSessionUseCase: CreateCheckoutSessionUseCase;
let userRepository: IUserRepository;
let validInput: Input;

beforeAll(async (): Promise<void> => {
  await startTestDB();
  const factory: IFactory = makeFactory(connection);
  createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(
    factory.repositoryFactory,
    factory.serviceFactory,
  );
  const registerUserUseCase = new RegisterUserUseCase(
    factory.repositoryFactory,
    mockQueueFactory,
  );
  userRepository = factory.repositoryFactory.createUserRepository();
  await registerUserUseCase.execute({ ...registerUserMock.validUser });
  const user = await userRepository.getByEmail(
    registerUserMock.validUser.email,
  );
  validInput = {
    userId: user?.getId!,
    priceId: env.stripe.price_ids.basic!,
  };
});

afterAll(async (): Promise<void> => {
  await stopTestDB();
});

describe("Should create a checkout session for stripe", (): void => {
  it("Should create a checkout session successfully", async (): Promise<void> => {
    const output: CheckoutSessionOutput =
      await createCheckoutSessionUseCase.execute({
        ...validInput,
      });
    expect(output.checkoutUrl).toBeDefined();
  });

  it("Should return an error if user not found", async (): Promise<void> => {
    await expect(
      createCheckoutSessionUseCase.execute({
        ...validInput,
        userId: v7(),
      }),
    ).rejects.toThrow(
      new DomainException("User not found", HttpStatus.NOT_FOUND),
    );
  });
});
