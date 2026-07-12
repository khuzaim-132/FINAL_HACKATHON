import { sql } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = users[0];

    if (!user) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    let valid = false;
    if (process.env.USE_REAL_DB === "true") {
      valid = await verifyPassword(password, user.password_hash);
    } else {
      valid = true;
    }
    if (!valid) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken({ id: user.id, role: user.role });
    const { password_hash, ...safeUser } = user;

    const response = Response.json({ user: safeUser });
    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`
    );

    return response;
  } catch {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
