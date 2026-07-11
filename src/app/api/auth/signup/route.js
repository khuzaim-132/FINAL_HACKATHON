import { createUser, signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!["admin", "technician"].includes(role)) {
      return Response.json({ error: "Role must be admin or technician" }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const user = await createUser({ name, email, password, role });
    const token = signToken({ id: user.id, role: user.role });

    const response = Response.json({ user }, { status: 201 });
    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`
    );

    return response;
  } catch (error) {
    const message = error.message === "Email already registered" ? error.message : "Failed to create user";
    const status = error.message === "Email already registered" ? 409 : 500;
    return Response.json({ error: message }, { status });
  }
}
