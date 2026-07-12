import { sql } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST() {
  try {
    const emails = ["admin@gmail.com", "alice@gmail.com", "bob@gmail.com"];
    const names = ["Admin Google", "Alice Google", "Bob Google"];
    const idx = Math.floor(Math.random() * emails.length);
    const googleEmail = emails[idx];
    const googleName = names[idx];

    const existing = await sql`SELECT id, name, email, role, created_at FROM users WHERE email = ${googleEmail}`;
    let user;

    if (existing.length > 0) {
      user = existing[0];
    } else {
      const created = await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES (${googleName}, ${googleEmail}, '$2a$12$google_oauth', 'technician')
        RETURNING id, name, email, role, created_at
      `;
      user = created[0];
    }

    const token = signToken({ id: user.id, role: user.role });

    await sql`
      INSERT INTO alerts (user_id, type, message, email)
      VALUES (${user.id}, 'login_alert', ${`New sign-in from Google account: ${googleEmail}`}, ${googleEmail})
    `;

    const response = Response.json({ user });
    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`
    );

    return response;
  } catch (error) {
    return Response.json({ error: "Google sign-in failed" }, { status: 500 });
  }
}
