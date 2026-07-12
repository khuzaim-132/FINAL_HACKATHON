import { sql } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const alerts = await sql`SELECT * FROM alerts WHERE user_id = ${user.id} ORDER BY created_at DESC LIMIT 10`;

  return Response.json({ alerts });
}
