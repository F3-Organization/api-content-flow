import { DomainException } from "@/domain/error";
import { compare, genSalt, hash } from "bcrypt";
import { HttpStatus } from "../http/protocols.enum";

export async function generatePasswordHash(password: string) {
  const salt = await genSalt(10);
  return await hash(password, salt);
}

export async function comparePassword(password: string, passwordHash: string) {
  return await compare(password, passwordHash);
}

export function validatePassword(password: string) {
  const minLength = 6;
  if (password.length < minLength) {
    throw new DomainException(
      `Password must be at least ${minLength} characters`,
      HttpStatus.BAD_REQUEST,
    );
  }
  if (!/[A-Z]/.test(password)) {
    throw new DomainException(
      "Password must contain at least one uppercase letter",
      HttpStatus.BAD_REQUEST,
    );
  }
  if (!/[a-z]/.test(password)) {
    throw new DomainException(
      "Password must contain at least one lowercase letter",
      HttpStatus.BAD_REQUEST,
    );
  }
  if (!/[0-9]/.test(password)) {
    throw new DomainException(
      "Password must contain at least one number",
      HttpStatus.BAD_REQUEST,
    );
  }
}
