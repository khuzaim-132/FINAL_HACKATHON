import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const protectedRoutes = ["/dashboard"];
const adminRoutes = ["/dashboard/admin"];
const technicianRoutes = ["/dashboard/technician"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (!token) {
    if (protectedRoutes.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (adminRoutes.some((r) => pathname.startsWith(r)) && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/technician", request.url));
    }

    if (technicianRoutes.some((r) => pathname.startsWith(r)) && payload.role !== "technician") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("token", "", { maxAge: 0 });
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
