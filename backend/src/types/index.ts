export type Role = "USER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  category: string;
  price: string; // NUMERIC comes back from pg as a string
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface JwtPayload {
  sub: number;
  role: Role;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}
