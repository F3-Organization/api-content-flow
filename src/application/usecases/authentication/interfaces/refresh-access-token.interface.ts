export namespace RefreshAccessTokenNamespace {
    export interface Input {
        refreshToken: string;
    }

    export interface Output {
        accessToken: string;
        refreshToken: string;
    }
}