import { IServiceFactory } from "@/application/factories";
import { IUseCase } from "../interfaces/usecase.interface";
import { IGoogleOAuthService } from "@/infra/services";

export namespace CreateGoogleAuthUrlNamespace {
  export interface Input {}

  export interface Output {
    url: string;
    state: string;
    nonce: string;
  }
}

export class CreateGoogleAuthUrlUseCase implements IUseCase {
  private googleOAuthService: IGoogleOAuthService;
  constructor(private serviceFactory: IServiceFactory) {
    this.googleOAuthService = this.serviceFactory.createGoogleOAuthService();
  }

  async execute(
    input: CreateGoogleAuthUrlNamespace.Input,
  ): Promise<CreateGoogleAuthUrlNamespace.Output> {
    return this.googleOAuthService.generateAuthUrl();
  }
}
