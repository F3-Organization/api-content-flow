import { IResponse } from "@/infra/adapters";
import { CreateGoogleAuthUrlUseCase, IServiceFactory } from "@/application";
import { IController } from "@/infra";
import { HttpStatus } from "@/infra/http/protocols.enum";

export class CreateGoogleOAuthUrlController implements IController {
  private createGoogleOAuthUrlUseCase: CreateGoogleAuthUrlUseCase;
  constructor(private serviceFactory: IServiceFactory) {
    this.createGoogleOAuthUrlUseCase = new CreateGoogleAuthUrlUseCase(
      this.serviceFactory,
    );
  }
  async execute(req: any): Promise<IResponse> {
    const output = await this.createGoogleOAuthUrlUseCase.execute({});
    const res: IResponse = {
      statusCode: HttpStatus.OK,
      data: {
        url: output.url,
      },
      cookies: {
        state: output.state,
        nonce: output.nonce,
      },
    };
    return res;
  }
}
