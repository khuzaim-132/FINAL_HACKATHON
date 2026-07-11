import { sql } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const assetId = searchParams.get("asset_id");

  let query = sql`
    SELECT i.*, a.name AS asset_name, a.asset_code,
      t.name AS assigned_to_name
    FROM issues i
    LEFT JOIN assets a ON a.id = i.asset_id
    LEFT JOIN users t ON t.id = i.assigned_to
  `;

  const conditions = [];
  if (status) conditions.push(sql`i.status = ${status}`);
  if (assetId) conditions.push(sql`i.asset_id = ${assetId}`);

  if (user.role === "technician") {
    conditions.push(sql`i.assigned_to = ${user.id}`);
  }

  if (conditions.length > 0) {
    const whereClause = conditions.map((c) => c.query).join(" AND ");
    query = sql`${query} WHERE ${sql.unsafe(whereClause)}`;
  }

  query = sql`${query} ORDER BY i.created_at DESC`;

  const issues = await query;
  return Response.json({ issues });
}

export async function POST(request) {
  try {
    const { asset_id, reported_by_name, title, description, category, priority, image_url } = await request.json();

    if (!asset_id || !title) {
      return Response.json({ error: "Asset ID and title are required" }, { status: 400 });
    }

    const issue = await sql`
      INSERT INTO issues (asset_id, reported_by_name, title, description, category, priority, image_url, status)
      VALUES (${asset_id}, ${reported_by_name || null}, ${title}, ${description || null}, ${category || null}, ${priority || "medium"}, ${image_url || null}, 'reported')
      RETURNING *
    `;

    await sql`UPDATE assets SET status = 'issue_reported', updated_at = NOW() WHERE id = ${asset_id}`;

    await sql`
      INSERT INTO maintenance_history (asset_id, issue_id, action, description)
      VALUES (${asset_id}, ${issue[0].id}, 'issue_reported', ${`Issue reported: ${title}`})
    `;

    return Response.json({ issue: issue[0] }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
