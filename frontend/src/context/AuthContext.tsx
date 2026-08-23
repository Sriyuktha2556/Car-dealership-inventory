import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthUser } from "../types";
import { setAuthToken } from "../api/client";
import { loginRequest, registerRequest } from "../api/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "dealership_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthExpired = () => {
      setAuthToken(null);
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    };

    window.addEventListener("dealership:auth-expired", handleAuthExpired);

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { user?: AuthUser; token?: string };
        const validRole = parsed.user?.role === "USER" || parsed.user?.role === "ADMIN";
        if (parsed.token && parsed.user?.id && parsed.user.email && validRole) {
          setAuthToken(parsed.token);
          setUser(parsed.user);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);

    return () => window.removeEventListener("dealership:auth-expired", handleAuthExpired);
  }, []);

  function persist(nextUser: AuthUser, token: string) {
    setAuthToken(token);
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token }));
  }

  async function login(email: string, password: string) {
    const result = await loginRequest(email, password);
    persist(result.user, result.token);
  }

  async function register(name: string, email: string, password: string) {
    const result = await registerRequest(name, email, password);
    persist(result.user, result.token);
  }

  function logout() {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
