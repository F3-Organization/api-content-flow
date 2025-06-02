import jwt from "jsonwebtoken";
import { env } from "@/config/env";

const privateKey = env.secret!;

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, privateKey, { algorithm: "HS256" });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, privateKey, { algorithm: "HS256" });
}
