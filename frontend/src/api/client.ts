import { ApiResponse } from "../types";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

export class ApiRequestError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(status: number, message: string, errors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined)
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiRequestError(0, "Unable to reach the server. Check your connection and try again.");
  }

  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (response.status === 401 && authToken) {
    authToken = null;
    window.dispatchEvent(new Event("dealership:auth-expired"));
  }

  if (!response.ok || !body || body.success === false) {
    const message = body && "message" in body ? body.message : "Something went wrong. Please try again.";
    const errors = body && "errors" in body ? body.errors : undefined;
    throw new ApiRequestError(response.status, message, errors);
  }

  return body.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data !== undefined ? JSON.stringify(data) : undefined }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PUT", body: data !== undefined ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" })
};
