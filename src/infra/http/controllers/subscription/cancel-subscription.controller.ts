import { IController, IResponse } from "@/infra";
import { IRepositoryFactory, IServiceFactory } from "@/application";
import { CancelSubscriptionUseCase } from "@/application/usecases/subscription/cancel-subscription.usecase";
import { HttpStatus } from "@/infra/http/protocols.enum";

export class CancelSubscriptionController implements IController {
  private useCase: CancelSubscriptionUseCase;
  constructor(
    private repositoryFactory: IRepositoryFactory,
    private serviceFactory: IServiceFactory,
  ) {
    this.useCase = new CancelSubscriptionUseCase(
      repositoryFactory,
      serviceFactory,
    );
  }
  async execute(req: any): Promise<IResponse> {
    const input: { userId: string } = this.getParams(req);
    await this.useCase.execute(input);
    return {
      success: true,
      message: "Subscription canceled",
      statusCode: HttpStatus.OK,
    };
  }

  private getParams(req: any): { userId: string } {
    return {
      userId: req.body.userId,
    };
  }
}
