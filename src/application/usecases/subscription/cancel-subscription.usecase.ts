import {
  IRepositoryFactory,
  IServiceFactory,
  ISubscriptionRepository,
  IUseCase,
} from "@/application";
import { IPaymentGatewayService } from "@/infra/services";
import { Subscription } from "@/domain/entities";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";

export namespace CreateSubscriptionNamespace {
  export interface Input {
    userId: string;
  }
}
export class CancelSubscriptionUseCase implements IUseCase {
  private subscriptionRepository: ISubscriptionRepository;
  private readonly paymentGatewayService: IPaymentGatewayService;
  constructor(
    private repositoryFactory: IRepositoryFactory,
    private serviceFactory: IServiceFactory,
  ) {
    this.subscriptionRepository =
      this.repositoryFactory.createSubscriptionRepository();
    this.paymentGatewayService =
      this.serviceFactory.createPaymentGatewayService();
  }

  async execute(input: CreateSubscriptionNamespace.Input): Promise<any> {
    const subscription: Subscription | undefined =
      await this.subscriptionRepository.getByUserId(input.userId);
    this.validate(subscription);
    await this.paymentGatewayService.cancelSubscription(subscription?.id!);
  }

  private validate(subscription?: Subscription): void {
    if (!subscription)
      throw new DomainException("Subscription not found", HttpStatus.NOT_FOUND);
    if (subscription.status === "inactive" || "canceled" || "expired")
      throw new DomainException(
        "Subscription is not active",
        HttpStatus.BAD_REQUEST,
      );
  }
}
