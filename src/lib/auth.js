import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    const users = await sql`SELECT id, name, email, role, created_at FROM users WHERE id = ${decoded.id}`;
    return users[0] || null;
  } catch {
    return null;
  }
}

export async function createUser({ name, email, password, role }) {
  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    throw new Error("Email already registered");
  }

  let passwordHash;
  if (!process.env.DATABASE_URL) {
    passwordHash = "$2a$12$mock";
  } else {
    passwordHash = await hashPassword(password);
  }
  const users = await sql`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (${name}, ${email}, ${passwordHash}, ${role})
    RETURNING id, name, email, role, created_at
  `;
  return users[0];
}
