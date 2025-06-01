import jwt from "jsonwebtoken";
import { env } from "@/config/env";

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, env.secret!, { algorithm: "RS256" });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, env.secret!, { algorithm: "RS256" });
}
