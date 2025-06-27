import { IFactory, RecoveryPasswordUseCase } from "@/application";
import { IController, IResponse } from "@/infra";
import { HttpStatus } from "../../protocols.enum";

export class RecoveryPasswordController implements IController {
  private recoveryPasswordUsecase: RecoveryPasswordUseCase;
  constructor(private factory: IFactory) {
    this.recoveryPasswordUsecase = new RecoveryPasswordUseCase(
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
