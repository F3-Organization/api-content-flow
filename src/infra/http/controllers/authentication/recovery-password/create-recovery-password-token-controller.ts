import { IFactory, CreateRecoveryPasswordTokenUseCase } from "@/application";
import { IController, IResponse } from "@/infra";
import { HttpStatus } from "../../../protocols.enum";

export class CreateRecoveryPasswordTokenController implements IController {
  private recoveryPasswordUsecase: CreateRecoveryPasswordTokenUseCase;
  constructor(private factory: IFactory) {
    this.recoveryPasswordUsecase = new CreateRecoveryPasswordTokenUseCase(
      this.factory.repositoryFactory,
      this.factory.queueFactory,
    );
  }
  async execute(req: any): Promise<IResponse> {
    const { email } = req.body;
    const result = await this.recoveryPasswordUsecase.execute({ email });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: result.message,
    };
  }
}
