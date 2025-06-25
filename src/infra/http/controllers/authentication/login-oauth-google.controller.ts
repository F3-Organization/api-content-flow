import { IResponse } from "@/infra/adapters";
import { IController } from "../interfaces";
import {
  IRepositoryFactory,
  IServiceFactory,
  LoginOAuthUseCase,
} from "@/application";
import { HttpStatus } from "../../protocols.enum";

export class LoginOAuthGoogleController implements IController {
  private loginOAuthUseCase: LoginOAuthUseCase;
  constructor(
    private serviceFactory: IServiceFactory,
    private repositoryFactory: IRepositoryFactory,
  ) {
    this.loginOAuthUseCase = new LoginOAuthUseCase(
      this.serviceFactory,
      this.repositoryFactory,
    );
  }

  async execute(req: any): Promise<IResponse> {
    const input = this.getParams(req);
    const output = await this.loginOAuthUseCase.execute(input);
    const res: IResponse = {
      statusCode: HttpStatus.OK,
      data: output,
      success: true,
    };
    return res;
  }

  private getParams(req: any) {
    return {
      code: req.query.code,
      returnedState: req.query.state,
      savedState: req.cookies["state"],
      nonce: req.cookies["nonce"],
    };
  }
}
