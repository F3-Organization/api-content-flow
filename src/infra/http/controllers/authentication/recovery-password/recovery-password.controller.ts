import { IResponse } from "@/infra/adapters";
import { IController } from "../../interfaces";
import { IFactory, RecoveryPasswordUseCase } from "@/application";
import { HttpStatus } from "@/infra/http/protocols.enum";

export class RecoveryPasswordController implements IController {
  private recoveryPasswordUseCase: RecoveryPasswordUseCase;
  constructor(private factory: IFactory) {
    this.recoveryPasswordUseCase = new RecoveryPasswordUseCase(
      this.factory.repositoryFactory,
      this.factory.queueFactory,
    );
  }
  async execute(req: any): Promise<IResponse> {
    const input = this.getParams(req);
    await this.recoveryPasswordUseCase.execute(input);
    return {
      success: true,
      statusCode: HttpStatus.NON_CONTENT,
    };
  }

  private getParams(req: any) {
    return {
      token: req.body.token,
      password: req.body.password,
    };
  }
}
