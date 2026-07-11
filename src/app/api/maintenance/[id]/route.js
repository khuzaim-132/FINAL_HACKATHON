import { sql } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(request, { params }) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const allowed = ["inspection_findings", "notes", "parts_used", "cost", "photos", "ai_summary", "confirmed"];
    const updates = [];

    for (const key of allowed) {
      if (body[key] !== undefined) {
        const val = key === "parts_used" || key === "photos" || key === "ai_summary"
          ? JSON.stringify(body[key])
          : body[key];
        updates.push(sql`${sql.unsafe(key)} = ${val}`);
      }
    }

    if (updates.length === 0) {
      return Response.json({ error: "No valid fields" }, { status: 400 });
    }

    const records = await sql`
      UPDATE maintenance_records SET ${sql.unsafe(updates.map((u) => u.query).join(", "))}
      WHERE id = ${id}
      RETURNING *
    `;

    return Response.json({ record: records[0] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const records = await sql`
    SELECT mr.*, u.name AS technician_name
    FROM maintenance_records mr
    LEFT JOIN users u ON u.id = mr.technician_id
    WHERE mr.issue_id = ${id}
    ORDER BY mr.created_at DESC
  `;

  return Response.json({ records });
}
