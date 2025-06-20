import { OAuth2Client } from "google-auth-library";
import { GoogleOAuthAdapterNamespace, IGoogleOAuthAdapter } from "@/infra";
import { env } from "@/config/env";
import { DomainException } from "@/domain/error";
import { HttpStatus } from "@/infra/http/protocols.enum";

export class GoogleOAuthAdapter implements IGoogleOAuthAdapter {
  private oAuth2Client: OAuth2Client;
  constructor() {
    this.oAuth2Client = new OAuth2Client(
      env.o_auth.client_id,
      env.o_auth.client_secret,
      env.o_auth.redirect_uri,
    );
  }

  buildAuthUrl(input: { state: string; nonce: string }): string {
    return this.oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
      state: input.state,
      nonce: input.nonce,
    });
  }

  async getUserInfoFromCode(
    input: GoogleOAuthAdapterNamespace.Input,
  ): Promise<GoogleOAuthAdapterNamespace.Output> {
    const { tokens } = await this.oAuth2Client.getToken(input.code);
    this.oAuth2Client.setCredentials(tokens);

    const ticket = await this.oAuth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: env.o_auth.client_id,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload?.sub)
      throw new DomainException(
        "Invalid Google user info",
        HttpStatus.BAD_REQUEST,
      );

    if (payload?.nonce !== input.expectedNonce)
      throw new DomainException("Invalid nonce", HttpStatus.UNAUTHORIZED);

    return {
      email: payload.email,
      name: payload.name || "",
      picture: payload.picture,
      googleId: payload.sub,
    };
  }
}
