import { sql } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const assetId = searchParams.get("asset_id");

  let query = sql`
    SELECT mh.*, u.name AS performed_by_name
    FROM maintenance_history mh
    LEFT JOIN users u ON u.id = mh.performed_by
  `;

  if (assetId) {
    query = sql`${query} WHERE mh.asset_id = ${assetId}`;
  }

  query = sql`${query} ORDER BY mh.timestamp DESC LIMIT 50`;

  const history = await query;
  return Response.json({ history });
}
