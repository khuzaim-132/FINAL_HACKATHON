import { sql } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const technicians = await sql`
    SELECT id, name, email FROM users WHERE role = 'technician' ORDER BY name
  `;

  return Response.json({ technicians });
}
