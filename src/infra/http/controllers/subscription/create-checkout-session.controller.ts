import { IResponse } from "@/infra/adapters";
import { IController } from "../interfaces";
import {
  CreateCheckoutSessionUseCase,
  IFactory,
  IRepositoryFactory,
  IServiceFactory,
} from "@/application";

export class CreateCheckoutSessionController implements IController {
  private useCase: CreateCheckoutSessionUseCase;
  constructor(private factory: IFactory) {
    this.useCase = new CreateCheckoutSessionUseCase(
      this.factory.repositoryFactory,
      this.factory.serviceFactory,
    );
  }
  async execute(req: any): Promise<IResponse> {
    const input = this.getParams(req);
    const output = await this.useCase.execute(input);
    const res: IResponse = {
      success: true,
      data: output,
    };
    return res;
  }
  private getParams(req: any) {
    return {
      userId: req.body.userId,
      priceId: req.body.priceId,
    };
  }
}
