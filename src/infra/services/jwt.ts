import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import type { StringValue } from "ms";
import { User } from "@/domain/entities";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  jti: string;
}

export function generateToken(user: User, expiresIn?: StringValue) {
  const payload = buildPayload(user);
  return jwt.sign(payload, env.secret!, {
    algorithm: "HS256",
    expiresIn: expiresIn || "1d",
  });
}

function buildPayload(user: User): TokenPayload {
  return {
    userId: user.getId,
    email: user.getEmail.getValue,
    role: user.getRole.getRoleValue,
    jti: uuid(),
  };
}

export function verifyToken(token: string) {
  try {
    jwt.verify(token, env.secret!, { algorithms: ["HS256"] });
    return true;
  } catch (err) {
    return false;
  }
}

export function decodeToken(token: string): TokenPayload {
  const decoded = jwt.decode(token, { complete: true });
  return decoded?.payload as TokenPayload;
}
