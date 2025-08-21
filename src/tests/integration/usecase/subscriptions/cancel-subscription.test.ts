import {
  connection,
  startTestDB,
  stopTestDB,
} from "@/tests/test-utils/setup-test-db";
import { makeFactory } from "@/infra/factories/factory";
import { CancelSubscriptionUseCase } from "@/application/usecases/subscription/cancel-subscription.usecase";
import {
  CreateSubscriptionUseCase,
  ISubscriptionRepository,
  IUserRepository,
  IUserRepositoryNamespace,
  RegisterUserUseCase,
} from "@/application";
import { mockQueueFactory } from "@/tests/infra/mocks/factories/queue-factory-mock";
import { registerUserMock } from "@/tests/infra/mocks/create-user-mocks";
import { env } from "@/config/env";
import { Subscription, User } from "@/domain/entities";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";

let cancelSubscriptionUseCase: CancelSubscriptionUseCase;
let subscriptionRepository: ISubscriptionRepository;
let userRepository: IUserRepository;
let user: User | undefined;
let subscription: Subscription | undefined;
let otherUserEmail = "teste@testemail.com";

beforeAll(async () => {
  await startTestDB();
  const factory = makeFactory(connection);
  cancelSubscriptionUseCase = new CancelSubscriptionUseCase(
    factory.repositoryFactory,
    factory.serviceFactory,
  );
  const createSubscriptionUseCase = new CreateSubscriptionUseCase(
    factory.repositoryFactory,
    factory.serviceFactory,
  );
  const registerUserUseCase = new RegisterUserUseCase(
    factory.repositoryFactory,
    mockQueueFactory,
  );
  await registerUserUseCase.execute(registerUserMock.validUser);
  userRepository = factory.repositoryFactory.createUserRepository();
  user = await userRepository.getByEmail(registerUserMock.validUser.email);
  await createSubscriptionUseCase.execute({
    userId: user?.getId!,
    priceId: env.stripe.price_ids.basic!,
    paymentMethodId: "pm_card_visa",
  });
  subscriptionRepository =
    factory.repositoryFactory.createSubscriptionRepository();
  subscription = await factory.repositoryFactory
    .createSubscriptionRepository()
    .getByUserId(user?.getId!);
  await registerUserUseCase.execute({
    ...registerUserMock.validUser,
    email: otherUserEmail,
  });
}, 300000);

afterAll(async () => {
  await stopTestDB();
});

describe("Should test cancel subscription", () => {
  it("Should cancel successfully a subscription", async () => {
    subscription?.activate();
    await subscriptionRepository.update(subscription!);
    await expect(
      cancelSubscriptionUseCase.execute({ userId: user?.getId! }),
    ).resolves.not.toThrow();
  });

  it("Should return an error if subscriptions is inactive", async () => {
    // @ts-ignore
    subscription.status = "inactive";
    await subscriptionRepository.update(subscription!);
    await expect(
      cancelSubscriptionUseCase.execute({ userId: user?.getId! }),
    ).rejects.toThrow(
      new DomainException("Subscription is not active", HttpStatus.NOT_FOUND),
    );
  });
  it("Should return an error subscription not found", async (): Promise<void> => {
    const otherUser = await userRepository.getByEmail(otherUserEmail);
    await expect(
      cancelSubscriptionUseCase.execute({ userId: otherUser?.getId! }),
    ).rejects.toThrow(
      new DomainException("Subscription not found", HttpStatus.NOT_FOUND),
    );
  });
});
