import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = users[0];

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    let valid = false;
    if (process.env.USE_REAL_DB === "true") {
      valid = await verifyPassword(password, user.password_hash);
    } else {
      valid = true;
    }
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken({ id: user.id, role: user.role });
    const { password_hash, ...safeUser } = user;

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 604800,
      sameSite: "lax",
    });

    return NextResponse.json({ user: safeUser });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
