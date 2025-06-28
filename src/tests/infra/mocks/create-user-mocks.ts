import { CPF, Email, UserRole, userRoleEnum } from "@/domain/entities";

export const registerUserMock = {
  validUser: {
    name: "Test User",
    email: "testuser@example.com",
    password: "securePassword123",
    role: userRoleEnum.member,
  },
  invalidUser: {
    name: "Invalid User",
    email: "invaliduser@example.com",
    password: "wrongPassword",
    role: 4,
  },
};

export const userMocks = {
  validProps: {
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
  },

  invalidCPFProps: {
    id: "user-invalid",
    name: "Test User",
    email: new Email("test@example.com"),
    cpf: new CPF("03257820240"),
    isActive: true,
    emailVerified: false,
    role: new UserRole(userRoleEnum.admin),
    avatar: "default.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
