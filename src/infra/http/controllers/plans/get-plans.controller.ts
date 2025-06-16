import { IResponse } from "@/infra/adapters/express/interfaces/express-adapter.interface";
import { IController } from "../interfaces";
import { IFactory, IRepositoryFactory } from "@/application";
import GetPlansUseCase from "@/application/usecases/plan/get-plans.usecase";
import { DomainException } from "@/domain/error";

export class GetPlansController implements IController {
  useCase: GetPlansUseCase;
  constructor(private repositoryFactory: IRepositoryFactory) {
    this.useCase = new GetPlansUseCase(this.repositoryFactory);
  }
  async execute(req: any): Promise<IResponse> {
    const output = await this.useCase.execute();
    return {
      data: output,
      success: true,
    };
  }
}
