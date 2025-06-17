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
import { Plan, Subscription, User } from "@/domain/entities";
import { v7 as uuid } from "uuid";
import { env } from "@/config/env";

export namespace CreateSubscriptionNamespace {
  export interface Input {
    userId: string;
    planId: string;
    priceId: string;
    paymentMethodId: string;
    trialPeriodDays: number;
  }
}

export class CreateSubscription implements IUseCase {
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
  async execute(input: CreateSubscriptionNamespace.Input): Promise<any> {
    const user = await this.userRepository.getById(input.userId);
    if (!user) {
      throw new DomainException("User not found", HttpStatus.NOT_FOUND);
    }
    const plan = await this.getPlan(input.priceId);
    const subscription = await this.subscriptionRepository.getByUserId(
      user.getId,
    );
    if (!subscription) {
      const newSubscription = this.buildEntry(user, plan);
      await this.subscriptionRepository.save(newSubscription);
    } else {
      if (subscription.status === "active") {
        throw new DomainException("Cannot update an active subscription.");
      }
      subscription.activate();
    }
    const stripeSubscritption =
      await this.paymentGatewayService.createSubscription({
        user: user,
        planId: input.planId,
        priceId: input.priceId,
        paymentMethodId: input.paymentMethodId,
        trialPeriodDays: input.trialPeriodDays,
      });
    return stripeSubscritption;
  }

  private async getPlan(priceId: string): Promise<Plan> {
    const plans = await this.planRepository.getPlans();
    switch (priceId) {
      case env.stripe.price_ids.basic:
        return plans.find((plan) => plan.getName === "Básico")!;
      case env.stripe.price_ids.standard:
        return plans.find((plan) => plan.getName === "Padrão")!;
      case env.stripe.price_ids.premium:
        return plans.find((plan) => plan.getName === "Premium")!;
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
      renewalDate: new Date(),
      autoRenew: true,
      trialStart: new Date(),
      trialEnd: new Date(
        new Date().setDate(new Date().getDate() + plan.getTrialDays),
      ),
      isTrial: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
