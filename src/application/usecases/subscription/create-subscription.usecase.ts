import { DomainException } from "@/domain/error";
import { IUseCase } from "../interfaces/usecase.interface";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { IRepositoryFactory, IServiceFactory } from "@/application/factories";
import {
  IPlanRepository,
  ISubscriptionRepository,
  IUserRepository,
} from "@/application";
import { IPaymentGatewayService } from "@/infra/services";
import {
  Plan,
  Subscription,
  SubscriptionStatus,
  User,
} from "@/domain/entities";
import { v7 as uuid } from "uuid";
import { env } from "@/config/env";
import { IPaymentGatewayOutput } from "@/infra";

export namespace CreateSubscriptionNamespace {
  export interface Input {
    userId: string;
    priceId: string;
    paymentMethodId: string;
  }
}

export class CreateSubscriptionUseCase implements IUseCase {
  private subscriptionRepository: ISubscriptionRepository;
  private userRepository: IUserRepository;
  private planRepository: IPlanRepository;
  private paymentGatewayService: IPaymentGatewayService;
  constructor(
    private repositoryFactory: IRepositoryFactory,
    private serviceFactory: IServiceFactory,
  ) {
    this.subscriptionRepository =
      this.repositoryFactory.createSubscriptionRepository();
    this.userRepository = this.repositoryFactory.createUserRepository();
    this.planRepository = this.repositoryFactory.createPlanRepository();
    this.paymentGatewayService =
      this.serviceFactory.createPaymentGatewayService();
  }
  async execute(
    input: CreateSubscriptionNamespace.Input,
  ): Promise<IPaymentGatewayOutput.CreateSubscription> {
    const user = await this.userRepository.getById(input.userId);
    if (!user) {
      throw new DomainException("User not found", HttpStatus.NOT_FOUND);
    }
    const plan = await this.getPlan(input.priceId);
    let subscription = await this.subscriptionRepository.getByUserId(
      user.getId,
    );
    if (!subscription) {
      subscription = this.buildEntry(user, plan);
      await this.subscriptionRepository.save(subscription);
    } else {
      if (subscription.status === "active") {
        throw new DomainException(
          "You already have an active subscription.",
          HttpStatus.FORBIDDEN,
        );
      }
      if (subscription.status === "pending") {
        throw new DomainException(
          "You have a pending subscription. Please wait for it to be processed.",
          HttpStatus.FORBIDDEN,
        );
      }
      if (subscription.status === "inactive") subscription.activate();
    }
    const createInput = this.createIput(
      user,
      plan,
      input,
      subscription.hadTrial,
    );
    const stripeSubscritption =
      await this.paymentGatewayService.createSubscription(
        createInput,
        subscription.id,
      );
    if (stripeSubscritption)
      await this.updateSubscriptionProperties(
        subscription,
        stripeSubscritption.subscriptionId!,
      );
    await this.subscriptionRepository.update(subscription);
    return stripeSubscritption;
  }

  private async updateSubscriptionProperties(
    subscription: Subscription,
    stripeSubscritptionId: string,
  ) {
    const stripeSubscritption =
      await this.paymentGatewayService.retrieveSubscription(
        stripeSubscritptionId,
      );
    if (stripeSubscritption.trial_start)
      subscription.trialStart = new Date(
        stripeSubscritption.trial_start * 1000,
      );
    if (stripeSubscritption.trial_end)
      subscription.trialEnd = new Date(stripeSubscritption.trial_end * 1000);
    if (stripeSubscritption.status)
      subscription.status = this.mapStripeStatusToDomain(
        stripeSubscritption.status,
      );
    if (stripeSubscritption.status === "trialing") subscription.isTrial = true;
    if (stripeSubscritption.status === "trialing") subscription.hadTrial = true;
  }

  private async getPlan(priceId: string): Promise<Plan> {
    const plans = await this.planRepository.getPlans();
    switch (priceId) {
      case env.stripe.price_ids.basic:
        return plans.find((plan) => plan.getName === env.plan_name.basic)!;
      case env.stripe.price_ids.standard:
        return plans.find((plan) => plan.getName === env.plan_name.standard)!;
      case env.stripe.price_ids.premium:
        return plans.find((plan) => plan.getName === env.plan_name.premium)!;
      default:
        throw new DomainException(
          "Invalid priceId provided",
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  private buildEntry(user: User, plan: Plan) {
    return new Subscription({
      id: uuid(),
      userId: user.getId,
      planId: plan.getId,
      status: "pending",
      trialStart: new Date(),
      trialEnd: new Date(
        new Date().setDate(new Date().getDate() + plan.getTrialDays),
      ),
      isTrial: false,
      hadTrial: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  private mapStripeStatusToDomain(stripeStatus: string): SubscriptionStatus {
    switch (stripeStatus) {
      case "trialing":
      case "active":
        return "active";
      case "canceled":
        return "canceled";
      case "incomplete":
      case "incomplete_expired":
      case "past_due":
      case "unpaid":
        return "pending";
      case "paused":
        return "inactive";
      case "expired":
        return "expired";
      default:
        return "pending";
    }
  }

  private createIput(
    user: User,
    plan: Plan,
    input: CreateSubscriptionNamespace.Input,
    hadTrial: boolean,
  ) {
    if (!hadTrial)
      return {
        user: user,
        planId: plan.getId,
        priceId: input.priceId,
        paymentMethodId: input.paymentMethodId,
        trialPeriodDays: plan.getTrialDays,
      };
    return {
      user: user,
      planId: plan.getId,
      priceId: input.priceId,
      paymentMethodId: input.paymentMethodId,
    };
  }
}
