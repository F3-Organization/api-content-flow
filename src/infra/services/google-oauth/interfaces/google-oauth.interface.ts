import { GoogleOAuthAdapterNamespace } from "@/infra";

export interface IGoogleOAuthService {
  generateAuthUrl(): { url: string; state: string; nonce: string };
  handlerCallback(input: {
    code: string;
    returnedState: string;
    savedState: string;
    savedNonce: string;
  }): Promise<GoogleOAuthAdapterNamespace.Output>;
}
