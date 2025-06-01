import { IResponse } from "@/infra/adapters/express/interfaces/express-adapter.interface";
import { IController } from "./interfaces/controller.interface";
import { CreateUserUseCase, IRepositoryFactory, IUseCase } from "@/application";

export class CreateUserController implements IController {
  private createUser: IUseCase;
  constructor(private repositoryFactory: IRepositoryFactory) {
    this.createUser = new CreateUserUseCase(this.repositoryFactory);
  }
  async execute(req: any): Promise<IResponse> {
    try {
      const params = this.getParams(req);
      await this.createUser.execute(params);
      const res: IResponse = {
        statusCode: 200,
        message: "User created successfully",
        success: true,
      };
      return res;
    } catch (error) {
      return {
        statusCode: 500,
        message: "An unexpected error occurred",
        success: false,
      };
    }
  }

  private getParams(req: any) {
    return {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      provider: req.body.provider,
      cpf: req.body.cpf,
    };
  }
}
