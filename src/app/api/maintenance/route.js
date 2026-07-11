import { sql } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function POST(request) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { issue_id, asset_id, inspection_findings, notes, parts_used, cost, photos } = await request.json();

    if (!issue_id || !asset_id) {
      return Response.json({ error: "Issue ID and Asset ID required" }, { status: 400 });
    }

    const records = await sql`
      INSERT INTO maintenance_records (issue_id, asset_id, technician_id, inspection_findings, notes, parts_used, cost, photos)
      VALUES (${issue_id}, ${asset_id}, ${user.id}, ${inspection_findings || null}, ${notes || null}, ${JSON.stringify(parts_used || [])}, ${cost || null}, ${JSON.stringify(photos || [])})
      RETURNING *
    `;

    await sql`
      UPDATE issues SET status = 'under_maintenance', updated_at = NOW()
      WHERE id = ${issue_id}
    `;

    await sql`
      UPDATE assets SET status = 'under_maintenance', updated_at = NOW()
      WHERE id = ${asset_id}
    `;

    await sql`
      INSERT INTO maintenance_history (asset_id, issue_id, action, description, performed_by)
      VALUES (${asset_id}, ${issue_id}, 'maintenance_started', 'Maintenance work started', ${user.id})
    `;

    return Response.json({ record: records[0] }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
