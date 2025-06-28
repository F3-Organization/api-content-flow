import {
  startTestDB,
  connection,
  stopTestDB,
} from "@/tests/test-utils/setup-test-db";
import {
  IFactory,
  CreateSubscriptionUseCase,
  RegisterUserUseCase,
  CreateSubscriptionNamespace,
  ISubscriptionRepository,
  IUserRepository,
  IQueueFactory,
} from "@/application";
import { makeFactory } from "@/infra/factories/factory";
import { registerUserMock } from "@/tests/infra/mocks/create-user-mocks";
import { env } from "@/config/env";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";
import {
  setupTestRabbitMq,
  stopTestRabbit,
} from "@/tests/test-utils/setup-test-rabbitMq";
import { mockQueueFactory } from "@/tests/infra/mocks/factories/queue-factory-mock";

let factory: IFactory;
let useCase: CreateSubscriptionUseCase;
let userRepository: IUserRepository;
let registerUserUseCase: RegisterUserUseCase;
let subscriptionRepository: ISubscriptionRepository;
beforeAll(async () => {
  await startTestDB();
  factory = makeFactory(connection);
  useCase = new CreateSubscriptionUseCase(
    factory.repositoryFactory,
    factory.serviceFactory,
  );
  registerUserUseCase = new RegisterUserUseCase(
    factory.repositoryFactory,
    mockQueueFactory,
  );
  subscriptionRepository =
    factory.repositoryFactory.createSubscriptionRepository();
  userRepository = factory.repositoryFactory.createUserRepository();
}, 30000);

afterAll(async () => {
  await stopTestDB();
});

describe("Create Subscription", () => {
  it("should create a subscription with trial period successfully", async () => {
    await registerUserUseCase.execute({ ...registerUserMock.validUser });
    const user = await userRepository.getByEmail(
      registerUserMock.validUser.email,
    );
    const input: CreateSubscriptionNamespace.Input = {
      userId: user?.getId!,
      priceId: env.stripe.price_ids.basic!,
      paymentMethodId: "pm_card_visa",
    };
    const output = await useCase.execute(input);
    expect(output.subscriptionId).toBeDefined();
    expect(output.clientSecret).toBeUndefined();
  });

  it("should create a subscription without trial period successfully", async () => {
    await registerUserUseCase.execute({
      ...registerUserMock.validUser,
      email: "teste@testemail.com",
    });
    const user = await userRepository.getByEmail("teste@testemail.com");
    const input: CreateSubscriptionNamespace.Input = {
      userId: user?.getId!,
      priceId: env.stripe.price_ids.basic!,
      paymentMethodId: "pm_card_visa",
    };
    await useCase.execute(input);
    const subs = await subscriptionRepository.getByUserId(user?.getId!);
    subs!.status = "inactive";
    await subscriptionRepository.update(subs!);
    const output = await useCase.execute(input);
    expect(output.subscriptionId).toBeDefined();
    expect(output.clientSecret).toBeDefined();
  }, 20000);

  it("should return an error if subscription exists", async () => {
    await registerUserUseCase.execute({
      ...registerUserMock.validUser,
      email: "teste@testemail2.com",
    });
    const user = await userRepository.getByEmail("teste@testemail2.com");
    const input: CreateSubscriptionNamespace.Input = {
      userId: user?.getId!,
      priceId: env.stripe.price_ids.basic!,
      paymentMethodId: "pm_card_visa",
    };
    await useCase.execute(input);
    await expect(useCase.execute(input)).rejects.toThrow(
      new DomainException(
        "You already have an active subscription.",
        HttpStatus.FORBIDDEN,
      ),
    );
  }, 20000);
});
