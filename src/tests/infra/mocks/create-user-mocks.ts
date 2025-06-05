import { userRoleEnum } from "@/domain/entities";

export const createUserMocks = {
    validUser: {
        name: "Test User",
        email: "testuser@example.com",
        password: "securePassword123",
        role: userRoleEnum.member,
        provider: "local",
    },
    invalidUser: {
        name: "Invalid User",
        email: "invaliduser@example.com",
        password: "wrongPassword",
        role: 4,
        provider: "local",
    }
}