import { CPF, Email, UserRole, userRoleEnum } from "@/domain/entities/value-objects";
import { User } from "../../../domain/entities/user.entity";
import { DomainException } from "@/domain/error";

describe("User Entity", () => {
  const validProps = {
    id: "user-1",
    name: "Test User",
    email: new Email("test@example.com"),
    cpf: new CPF("03257820240"),
    isActive: true,
    emailVerified: false,
    role: new UserRole(userRoleEnum.member),
    avatar: "default.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const invalidCPFProps = {
    id: "user-invalid",
    name: "Test User",
    email: new Email("test@example.com"),
    isActive: true,
    emailVerified: false,
    role: new UserRole(userRoleEnum.admin),
    avatar: "default.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("should create a user with valid props", () => {
    const user = new User(validProps);
    expect(user.getId).toBe(validProps.id);
    expect(user.getName).toBe(validProps.name);
    expect(user.getEmail).toBe(validProps.email);
    expect(user.getIsActive).toBe(true);
    expect(user.getEmailVerified).toBe(false);
    expect(user.getRoleValue).toBe("member");
  });

  it("should throw error if name is empty", () => {
    expect(() => new User({ ...validProps, name: "" })).toThrow(
      "Name is required"
    );
  });

  it("should throw error if email is empty", () => {
    expect(() => new User({ ...validProps, email: new Email("") })).toThrow(
      DomainException
    );
  });


  it("should update name and updatedAt", async () => {
    const user = new User(validProps);
    const oldUpdatedAt = user.updatedAt;
    await new Promise((r) => setTimeout(r, 2));
    user.setName = "New Name";
    expect(user.getName).toBe("New Name");
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it("should update email and updatedAt", async () => {
    const user = new User(validProps);
    const oldUpdatedAt = user.updatedAt;
    await new Promise((r) => setTimeout(r, 2));
    user.setEmail = "new@example.com";
    expect(user.getEmail.getValue).toBe("new@example.com");
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });


  it("should activate and deactivate user", () => {
    const user = new User(validProps);
    user.deactivate();
    expect(user.getIsActive).toBe(false);
    user.activate();
    expect(user.getIsActive).toBe(true);
  });

  it("should verify email", () => {
    const user = new User(validProps);
    user.verifyEmail();
    expect(user.getEmailVerified).toBe(true);
  });

  it("should update role", () => {
    const user = new User(validProps);
    user.setRole = userRoleEnum.admin;
    expect(user.getRoleValue).toBe("admin");
  });

  it("should throw error for invalid CPF", () => {
    expect(
      () => new User({ ...invalidCPFProps, cpf: new CPF("12345678901") })
    ).toThrow(DomainException);
  });
});
