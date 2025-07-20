import { IUseCase } from "../interfaces/usecase.interface";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { DomainException } from "@/domain/error";
import { IRepositoryFactory, IServiceFactory } from "@/application/factories";
import { IUserRepository } from "@/application";
import { IPaymentGatewayService } from "@/infra/services";

export namespace CreateCheckoutSessionNamespace {
  export interface Input {
    userId: string;
    priceId: string;
  }

  export interface Output {
    sessionId: string;
    successUrl: string | null;
    cancelUrl: string | null;
  }
}

export class CreateCheckoutSessionUseCase implements IUseCase {
  private userRepository: IUserRepository;
  private paymentGatewayService: IPaymentGatewayService;

  constructor(
    private repositoryFactory: IRepositoryFactory,
    private serviceFactory: IServiceFactory,
  ) {
    this.userRepository = this.repositoryFactory.createUserRepository();
    this.paymentGatewayService =
      this.serviceFactory.createPaymentGatewayService();
  }

  async execute(
    input: CreateCheckoutSessionNamespace.Input,
  ): Promise<CreateCheckoutSessionNamespace.Output> {
    const user = await this.userRepository.getById(input.userId);
    if (!user) {
      throw new DomainException("User not found", HttpStatus.NOT_FOUND);
    }
    const session = await this.paymentGatewayService.createCheckoutSession({
      priceId: input.priceId,
      userId: input.userId,
    });
    return {
      sessionId: session.sessionId,
      successUrl: session.successUrl,
      cancelUrl: session.cancelUrl,
    };
  }
}
