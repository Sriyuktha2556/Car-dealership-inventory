import dotenv from "dotenv";

// Load .env.test when running tests (NODE_ENV=test), otherwise .env.
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  nodeEnv: process.env.NODE_ENV ?? "development"
};
