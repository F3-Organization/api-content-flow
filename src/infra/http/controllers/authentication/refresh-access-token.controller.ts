import { IResponse } from "@/infra/adapters/express/interfaces/express-adapter.interface";
import { IRepositoryFactory, RefreshAccessTokenUseCase } from "@/application";
import { IController } from "@/infra";

export class RefreshAccessTokenController implements IController {
  private refreshAccessTokenUseCase: RefreshAccessTokenUseCase;
  constructor(private repositoryFactory: IRepositoryFactory) {
    this.refreshAccessTokenUseCase = new RefreshAccessTokenUseCase(
      this.repositoryFactory,
    );
  }
  async execute(req: any): Promise<IResponse> {
    const input = { refreshToken: req.body.refreshToken };
    const output = await this.refreshAccessTokenUseCase.execute(input);
    return {
      data: output,
      message: "Token refreshed successfully",
    };
  }
}
