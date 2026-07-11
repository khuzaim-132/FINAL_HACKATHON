import { neon } from "@neondatabase/serverless";
import { getAuthUser } from "@/lib/auth";

const sql = neon(process.env.DATABASE_URL);

export async function POST(request, { params }) {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { technician_id } = await request.json();

    if (!technician_id) {
      return Response.json({ error: "Technician ID required" }, { status: 400 });
    }

    const issues = await sql`
      UPDATE issues SET assigned_to = ${technician_id}, status = 'assigned', updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    const issue = issues[0];
    await sql`
      INSERT INTO maintenance_history (asset_id, issue_id, action, description, performed_by)
      VALUES (${issue.asset_id}, ${id}, 'assigned', 'Issue assigned to technician', ${user.id})
    `;

    return Response.json({ issue });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
