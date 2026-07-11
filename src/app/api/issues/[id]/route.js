import { sql } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request, { params }) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const issues = await sql`
    SELECT i.*, a.name AS asset_name, a.asset_code, a.location,
      t.name AS assigned_to_name
    FROM issues i
    LEFT JOIN assets a ON a.id = i.asset_id
    LEFT JOIN users t ON t.id = i.assigned_to
    WHERE i.id = ${id}
  `;

  if (!issues[0]) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ issue: issues[0] });
}

export async function PATCH(request, { params }) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();

    const allowed = ["title", "description", "category", "priority", "cause", "diagnostic_checks", "status"];
    const updates = [];

    for (const key of allowed) {
      if (body[key] !== undefined) {
        updates.push(sql`${sql.unsafe(key)} = ${body[key]}`);
      }
    }

    if (body.status === "resolved") {
      updates.push(sql`resolved_at = NOW()`);
    }

    if (updates.length === 0) {
      return Response.json({ error: "No valid fields" }, { status: 400 });
    }

    updates.push(sql`updated_at = NOW()`);

    const issues = await sql`
      UPDATE issues SET ${sql.unsafe(updates.map((u) => u.query).join(", "))}
      WHERE id = ${id}
      RETURNING *
    `;

    if (body.status === "resolved") {
      const issue = issues[0];
      await sql`UPDATE assets SET status = 'operational', updated_at = NOW() WHERE id = ${issue.asset_id}`;
      await sql`
        INSERT INTO maintenance_history (asset_id, issue_id, action, description, performed_by)
        VALUES (${issue.asset_id}, ${id}, 'resolved', 'Issue resolved and closed', ${user.id})
      `;
    }

    return Response.json({ issue: issues[0] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
