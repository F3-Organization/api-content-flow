import { IResponse } from "@/infra/adapters/express/interfaces/express-adapter.interface";
import { IController } from "@/infra";
import {
  CreateSubscriptionNamespace,
  CreateSubscriptionUseCase,
  IRepositoryFactory,
  IServiceFactory,
} from "@/application";
import { HttpStatus } from "../../protocols.enum";

export class CreateSubscriptionController implements IController {
  private useCase: CreateSubscriptionUseCase;
  constructor(
    private repositoryFactory: IRepositoryFactory,
    private serviceFactory: IServiceFactory,
  ) {
    this.useCase = new CreateSubscriptionUseCase(
      this.repositoryFactory,
      this.serviceFactory,
    );
  }

  async execute(req: any): Promise<IResponse> {
    const input = this.getParams(req);
    const output = await this.useCase.execute(input);
    return {
      success: true,
      data: output,
      statusCode: HttpStatus.CREATED,
    };
  }

  private getParams(req: any): CreateSubscriptionNamespace.Input {
    return {
      userId: req.body.userId,
      priceId: req.body.priceId,
      paymentMethodId: req.body.paymentMethodId,
    };
  }
}
