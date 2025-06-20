import {
  IAdaptersFactory,
  IRepositoryFactory,
  IUserRepository,
} from "@/application";
import { GoogleOAuthAdapterNamespace, IGoogleOAuthAdapter } from "@/infra";
import { IGoogleOAuthService } from "./interfaces";
import { v4 as uuid } from "uuid";
import { env } from "@/config/env";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";

export class GoogleOAuthService implements IGoogleOAuthService {
  private googleoAuthAdapter: IGoogleOAuthAdapter;
  constructor(private adapterFactory: IAdaptersFactory) {
    this.googleoAuthAdapter = this.adapterFactory.createGoogleOAuthAdapter();
  }

  generateAuthUrl(): { url: string; state: string; nonce: string } {
    const state = uuid();
    const nonce = uuid();
    const url = this.googleoAuthAdapter.buildAuthUrl({
      state,
      nonce,
    });
    return { url, state, nonce };
  }

  async handlerCallback(input: {
    code: string;
    returnedState: string;
    savedState: string;
    savedNonce: string;
  }): Promise<GoogleOAuthAdapterNamespace.Output> {
    const { code, returnedState, savedState, savedNonce } = input;

    if (!savedState || returnedState !== savedState) {
      throw new DomainException("Invalid state", HttpStatus.BAD_REQUEST);
    }
    return await this.googleoAuthAdapter.getUserInfoFromCode({
      code: code,
      redirectUri: env.o_auth.redirect_uri!,
      expectedNonce: savedNonce,
    });
  }
}
