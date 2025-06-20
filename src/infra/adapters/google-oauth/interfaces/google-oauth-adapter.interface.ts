export namespace GoogleOAuthAdapterNamespace {
  export interface Input {
    code: string;
    redirectUri: string;
    expectedNonce: string;
  }

  export interface Output {
    email: string;
    name: string;
    picture?: string;
    googleId: string;
  }
}
export interface IGoogleOAuthAdapter {
  getUserInfoFromCode(
    input: GoogleOAuthAdapterNamespace.Input,
  ): Promise<GoogleOAuthAdapterNamespace.Output>;
}
