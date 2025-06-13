import { IResponse } from "@/infra/adapters/express/interfaces/express-adapter.interface";
import { IController } from "./interfaces/controller.interface";
import { IRepositoryFactory, RefreshAccessTokenUseCase } from "@/application";
import { DomainException } from "@/domain/error";

export class RefreshAccessTokenController implements IController {
  private refreshAccessTokenUseCase: RefreshAccessTokenUseCase;
  constructor(private repositoryFactory: IRepositoryFactory) {
    this.refreshAccessTokenUseCase = new RefreshAccessTokenUseCase(
      this.repositoryFactory,
    );
  }
  async execute(req: any): Promise<IResponse> {
    try {
      const input = { refreshToken: req.body.refreshToken };
      const output = await this.refreshAccessTokenUseCase.execute(input);
      return {
        data: output,
        message: "Token refreshed successfully",
      };
    } catch (err) {
      const error = err as DomainException;
      return {
        statusCode: error.statusCode,
        message: error.message,
      };
    }
  }
}
