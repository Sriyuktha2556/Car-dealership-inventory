import bcrypt from "bcryptjs";
import { pool } from "../config/db";
import { signToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { PublicUser, User } from "../types";

const SALT_ROUNDS = 10;

function toPublicUser(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function registerUser(name: string, email: string, password: string) {
  const existing = await pool.query<User>("SELECT id FROM users WHERE email = $1", [email]);

  if (existing.rowCount && existing.rowCount > 0) {
    throw new AppError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  let user: User;
  try {
    const result = await pool.query<User>(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'USER')
       RETURNING id, name, email, password_hash, role, created_at, updated_at`,
      [name, email, passwordHash]
    );
    user = result.rows[0];
  } catch (error) {
    // The pre-check improves the normal path; the unique constraint handles
    // concurrent registration attempts for the same email.
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      throw new AppError(409, "An account with this email already exists");
    }
    throw error;
  }
  const token = signToken({ sub: user.id, role: user.role });

  return { user: toPublicUser(user), token };
}

export async function loginUser(email: string, password: string) {
  const result = await pool.query<User>("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = signToken({ sub: user.id, role: user.role });

  return { user: toPublicUser(user), token };
}
