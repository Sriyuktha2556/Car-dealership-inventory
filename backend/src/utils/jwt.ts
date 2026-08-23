import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload } from "../types";

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyToken(token: string): JwtPayload {
  // Throws if invalid/expired — callers must catch.
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
