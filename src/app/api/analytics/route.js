import { sql } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const totalAssets = await sql`SELECT COUNT(*)::int AS count FROM assets`;
  const statusCounts = await sql`
    SELECT status, COUNT(*)::int AS count FROM assets GROUP BY status
  `;
  const issueCounts = await sql`
    SELECT status, COUNT(*)::int AS count FROM issues GROUP BY status
  `;
  const priorityCounts = await sql`
    SELECT priority, COUNT(*)::int AS count FROM issues WHERE status != 'resolved' GROUP BY priority
  `;
  const recentIssues = await sql`
    SELECT i.*, a.name AS asset_name, a.asset_code
    FROM issues i LEFT JOIN assets a ON a.id = i.asset_id
    ORDER BY i.created_at DESC LIMIT 5
  `;
  const recentHistory = await sql`
    SELECT mh.*, u.name AS performed_by_name
    FROM maintenance_history mh
    LEFT JOIN users u ON u.id = mh.performed_by
    ORDER BY mh.timestamp DESC LIMIT 5
  `;

  return Response.json({
    totalAssets: totalAssets[0].count,
    statusCounts,
    issueCounts,
    priorityCounts,
    recentIssues,
    recentHistory,
  });
}
