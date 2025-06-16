import { DomainException } from "@/domain/error";
import { IUseCase } from "../interfaces/usecase.interface";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { IRepositoryFactory } from "@/application/factories";
import { ISubscriptionRepository } from "@/application";

export enum actionEnum {
  SUBSCRIBE = "subscribe",
  CANCEL = "cancel",
}
export namespace SubscribeUseCaseNamespace {
  export interface Input {
    userId: string;
    planId: string;
    action: actionEnum;
  }
}

export class SubscribeUseCase implements IUseCase {
  subscriptionRepository: ISubscriptionRepository;
  constructor(private repositoryFactory: IRepositoryFactory) {
    this.subscriptionRepository =
      this.repositoryFactory.createSubscriptionRepository();
  }
  async execute(input: SubscribeUseCaseNamespace.Input): Promise<any> {
    switch (input.action) {
      case actionEnum.SUBSCRIBE:
        await this.makeSubscription(input.userId, input.planId);
        break;
      case actionEnum.CANCEL:
        await this.cancelSubscription(input.userId, input.planId);
        break;
      default:
        throw new DomainException("Invalid action", HttpStatus.BAD_REQUEST);
    }
  }

  private async makeSubscription(userId: string, planId: string) {
    throw new Error("Method not implemented.");
  }

  private async cancelSubscription(userId: string, planId: string) {
    throw new Error("Method not implemented.");
  }
}
