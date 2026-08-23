export type Role = "USER" | "ADMIN";

export interface AuthUser {
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
  price: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface VehicleFormInput {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export interface SearchParams {
  q?: string;
  category?: string;
  available?: "true" | "false";
  sort?: "price_asc" | "price_desc" | "name_asc";
}
