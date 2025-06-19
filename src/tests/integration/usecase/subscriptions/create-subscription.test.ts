import {
  startTestDB,
  connection,
  stopTestDB,
} from "@/tests/test-utils/setup-test-db";
import {
  IFactory,
  CreateSubscription,
  RegisterUserUseCase,
  CreateSubscriptionNamespace,
} from "@/application";
import { makeFactory } from "@/infra/factories/factory";
import { Plan, User, userRoleEnum } from "@/domain/entities";
import { registerUserMock } from "@/tests/infra/mocks/create-user-mocks";
import { env } from "@/config/env";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";

let factory: IFactory;
let useCase: CreateSubscription;
let user: User | undefined;
let plans: Plan[];

beforeEach(async () => {
  await startTestDB();
  factory = makeFactory(connection);
  useCase = new CreateSubscription(
    factory.repositoryFactory,
    factory.serviceFactory,
  );
  const registerUserUseCase = new RegisterUserUseCase(
    factory.repositoryFactory,
  );
  const planRepository = factory.repositoryFactory.createPlanRepository();
  const userRepository = factory.repositoryFactory.createUserRepository();
  await registerUserUseCase.execute({ ...registerUserMock.validUser });
  user = await userRepository.getByEmail(registerUserMock.validUser.email);
  plans = await planRepository.getPlans();
}, 30000);

afterEach(async () => {
  await stopTestDB();
});

describe("Create Subscription", () => {
  it("should create a subscription without trial period successfully", async () => {
    const input: CreateSubscriptionNamespace.Input = {
      userId: user?.getId!,
      planId: plans[0].getId,
      priceId: env.stripe.price_ids.basic!,
      paymentMethodId: "pm_card_visa",
    };
    const output = await useCase.execute(input);
    expect(output.subscriptionId).toBeDefined();
    expect(output.clientSecret).toBeDefined();
  });

  it("should create a subscription with trial period successfully", async () => {
    const input: CreateSubscriptionNamespace.Input = {
      userId: user?.getId!,
      planId: plans[0].getId,
      priceId: env.stripe.price_ids.basic!,
      paymentMethodId: "pm_card_visa",
      trialPeriodDays: 7,
    };
    const output = await useCase.execute(input);
    expect(output.subscriptionId).toBeDefined();
    expect(output.clientSecret).toBeUndefined();
  });

  it("should return an error if subscription exists", async () => {
    const input: CreateSubscriptionNamespace.Input = {
      userId: user?.getId!,
      planId: plans[0].getId,
      priceId: env.stripe.price_ids.basic!,
      paymentMethodId: "pm_card_visa",
      trialPeriodDays: 7,
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
