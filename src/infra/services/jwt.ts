import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import type { StringValue } from "ms";

export function generateToken(payload: Object, expiresIn?: StringValue) {
  return jwt.sign(payload, env.secret!, {
    algorithm: "HS256",
    expiresIn: expiresIn || "1d",
  });
}

export function verifyToken(token: string) {
  try {
    jwt.verify(token, env.secret!, { algorithms: ["HS256"] });
    return true;
  } catch (err) {
    return false;
  }
}
