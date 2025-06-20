import { IResponse } from "@/infra/adapters";
import { IController } from "../interfaces";
import { CreateGoogleAuthUrlUseCase, IServiceFactory } from "@/application";
import { HttpStatus } from "../../protocols.enum";
import { DomainException } from "@/domain/error";

export class CreateGoogleOAuthUrlController implements IController {
  private createGoogleOAuthUrlUseCase: CreateGoogleAuthUrlUseCase;
  constructor(private serviceFactory: IServiceFactory) {
    this.createGoogleOAuthUrlUseCase = new CreateGoogleAuthUrlUseCase(
      this.serviceFactory,
    );
  }
  async execute(req: any): Promise<IResponse> {
    try {
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
    } catch (err) {
      const error = err as DomainException;
      return {
        success: false,
        message: error.message,
        statusCode: error.statusCode,
      };
    }
  }
}
