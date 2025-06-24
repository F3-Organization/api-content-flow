import { IResponse } from "@/infra/adapters";
import { IController } from "../interfaces";
import {
  IRepositoryFactory,
  IServiceFactory,
  LoginOAuthUseCase,
} from "@/application";
import { HttpStatus } from "../../protocols.enum";
import { DomainException } from "@/domain/error";

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
      code: req.body.code,
      returnedState: req.body.returnedState,
      savedState: req.body.savedState,
      nonce: req.body.nonce,
    };
  }
}