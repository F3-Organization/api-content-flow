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
} from "@/application";
import { makeFactory } from "@/infra/factories/factory";
import { User } from "@/domain/entities";
import { registerUserMock } from "@/tests/infra/mocks/create-user-mocks";
import { env } from "@/config/env";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";

let factory: IFactory;
let useCase: CreateSubscriptionUseCase;
let user: User | undefined;
let subscriptionRepository: ISubscriptionRepository;
beforeEach(async () => {
  await startTestDB();
  factory = makeFactory(connection);
  useCase = new CreateSubscriptionUseCase(
    factory.repositoryFactory,
    factory.serviceFactory,
  );
  const registerUserUseCase = new RegisterUserUseCase(
    factory.repositoryFactory,
  );
  subscriptionRepository =
    factory.repositoryFactory.createSubscriptionRepository();
  const userRepository = factory.repositoryFactory.createUserRepository();
  await registerUserUseCase.execute({ ...registerUserMock.validUser });
  user = await userRepository.getByEmail(registerUserMock.validUser.email);
}, 30000);

afterEach(async () => {
  await stopTestDB();
});

describe("Create Subscription", () => {
  it("should create a subscription with trial period successfully", async () => {
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
