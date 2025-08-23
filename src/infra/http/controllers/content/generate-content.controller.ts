import { IController, IResponse } from "@/infra";
import {
  GenerateContentUseCase,
  IRepositoryFactory,
  IServiceFactory,
} from "@/application";
import { HttpStatus } from "@/infra/http/protocols.enum";

export class GenerateContentController implements IController {
  private useCase: GenerateContentUseCase;
  constructor(
    private repositoryFactory: IRepositoryFactory,
    private serviceFactory: IServiceFactory,
  ) {
    this.useCase = new GenerateContentUseCase(
      this.repositoryFactory,
      this.serviceFactory,
    );
  }
  async execute(req: any): Promise<IResponse> {
    const input = this.getParams(req);
    const output: string = await this.useCase.execute(input);
    return {
      success: true,
      data: output,
      statusCode: HttpStatus.OK,
    };
  }

  private getParams(req: any) {
    return {
      title: req.body.title,
      topic: req.body.topic,
      body: req.body.body,
      format: req.body.format,
      userId: req.boddy.userId,
    };
  }
}
