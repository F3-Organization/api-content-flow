import { IResponse } from "@/infra/adapters/express/interfaces/express-adapter.interface";
import { IController } from "../../interfaces/controller.interface";
import {
  RegisterUserUseCase,
  IRepositoryFactory,
  IUseCase,
  IQueueFactory,
} from "@/application";
import { HttpStatus } from "../../../protocols.enum";

export class RegisterUserController implements IController {
  private createUser: IUseCase;
  constructor(
    private repositoryFactory: IRepositoryFactory,
    private queueFactory: IQueueFactory,
  ) {
    this.createUser = new RegisterUserUseCase(
      this.repositoryFactory,
      this.queueFactory,
    );
  }
  async execute(req: any): Promise<IResponse> {
    const params = this.getParams(req);
    await this.createUser.execute(params);
    const res: IResponse = {
      statusCode: HttpStatus.CREATED,
      message: "User created successfully",
      success: true,
    };
    return res;
  }

  private getParams(req: any) {
    return {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      provider: req.body.provider,
    };
  }
}
