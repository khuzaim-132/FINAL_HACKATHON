import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createUser, signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!["admin", "technician"].includes(role)) {
      return NextResponse.json({ error: "Role must be admin or technician" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const user = await createUser({ name, email, password, role });
    const token = signToken({ id: user.id, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 604800,
      sameSite: "lax",
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message = error.message === "Email already registered" ? error.message : "Failed to create user";
    const status = error.message === "Email already registered" ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
