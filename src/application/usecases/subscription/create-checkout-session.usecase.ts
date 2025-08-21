import { IUseCase, IUserRepository } from "@/application";
import { HttpStatus } from "@/infra/http/protocols.enum";
import { DomainException } from "@/domain/error";
import { IRepositoryFactory, IServiceFactory } from "@/application/factories";
import {
  IPaymentGatewayService,
  PaymentGatewayServiceInput,
} from "@/infra/services";
import CheckoutSessionOutput = PaymentGatewayServiceInput.CheckoutSessionOutput;
import { User } from "@/domain/entities";

export namespace CreateCheckoutSessionNamespace {
  export interface Input {
    userId: string;
    priceId: string;
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
  ): Promise<CheckoutSessionOutput> {
    const user: User | undefined = await this.userRepository.getById(
      input.userId,
    );
    if (!user) {
      throw new DomainException("User not found", HttpStatus.NOT_FOUND);
    }
    return await this.paymentGatewayService.createCheckoutSession({
      priceId: input.priceId,
      userId: input.userId,
    });
  }
}
