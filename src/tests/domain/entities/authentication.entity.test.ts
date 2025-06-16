import {
  Authentication,
  AuthenticationProps,
  AuthProvider,
} from "@/domain/entities";

describe("Authentication Entity", () => {
  const baseProps: AuthenticationProps = {
    id: "auth-1",
    userId: "user-1",
    provider: "local",
    passwordHash: "hashed-password",
    refreshToken: "refresh-token",
    createdAt: new Date("2023-01-01T00:00:00Z"),
    updatedAt: new Date("2023-01-02T00:00:00Z"),
  };

  it("should create an Authentication instance with correct properties", () => {
    const auth = new Authentication(baseProps);
    expect(auth.getId).toBe(baseProps.id);
    expect(auth.getUserId).toBe(baseProps.userId);
    expect(auth.getProvider).toBe(baseProps.provider);
    expect(auth.getPasswordHash).toBe(baseProps.passwordHash);
    expect(auth.getRefreshToken).toBe(baseProps.refreshToken);
    expect(auth.createdAt).toEqual(baseProps.createdAt);
    expect(auth.updatedAt).toEqual(baseProps.updatedAt);
  });

  it("should set password hash via setter", () => {
    const auth = new Authentication(baseProps);
    auth.setPasswordHash = "new-hash";
    expect(auth.getPasswordHash).toBe("new-hash");
  });

  it("should set refresh token via setter", () => {
    const auth = new Authentication(baseProps);
    auth.setRefreshToken = "new-refresh";
    expect(auth.getRefreshToken).toBe("new-refresh");
  });

  it("should reflect changes in getters after setters", () => {
    const auth = new Authentication(baseProps);
    auth.setPasswordHash = "changed-hash";
    auth.setRefreshToken = "changed-refresh";
    expect(auth.getPasswordHash).toBe("changed-hash");
    expect(auth.getRefreshToken).toBe("changed-refresh");
  });

  it("should support all AuthProvider values", () => {
    const providers: AuthProvider[] = ["local", "google", "github"];
    for (const provider of providers) {
      const props = { ...baseProps, provider };
      const auth = new Authentication(props);
      expect(auth.getProvider).toBe(provider);
    }
  });
});
