import { IResponse } from "@/infra/adapters/express/interfaces/express-adapter.interface";
import { IController } from "./interfaces/controller.interface";
import { IRepositoryFactory, IUseCase, LoginUseCase } from "@/application";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "../protocols.enum";

export class LoginController implements IController {
  private login: IUseCase;
  constructor(private repositoryFactory: IRepositoryFactory) {
    this.login = new LoginUseCase(this.repositoryFactory);
  }
  async execute(req: any): Promise<IResponse> {
    try {
      const params = this.getParam(req);
      await this.login.execute(params);
      const res: IResponse = {
        statusCode: HttpStatus.OK,
        message: "Login successful",
        success: true,
      };
      return res;
    } catch (err) {
      const error = err as DomainException;
      return {
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        success: false,
      };
    }
  }
  private getParam(req: any) {
    return {
      email: req.body.email,
      password: req.body.password,
    };
  }
}
