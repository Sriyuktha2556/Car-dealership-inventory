import { api } from "./client";
import { AuthUser } from "../types";

interface AuthResult {
  user: AuthUser;
  token: string;
}

export function registerRequest(name: string, email: string, password: string) {
  return api.post<AuthResult>("/auth/register", { name, email, password });
}

export function loginRequest(email: string, password: string) {
  return api.post<AuthResult>("/auth/login", { email, password });
}
