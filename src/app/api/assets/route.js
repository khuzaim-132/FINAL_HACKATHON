import { sql } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

function generateAssetCode() {
  const prefix = "AST";
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const assets = await sql`
    SELECT a.*, 
      (SELECT COUNT(*) FROM issues WHERE asset_id = a.id AND status != 'resolved')::int AS open_issues
    FROM assets a
    ORDER BY a.created_at DESC
  `;

  return Response.json({ assets });
}

export async function POST(request) {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, category, location } = await request.json();
    if (!name) return Response.json({ error: "Name is required" }, { status: 400 });

    const assetCode = generateAssetCode();
    const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/assets/${assetCode}`;

    const assets = await sql`
      INSERT INTO assets (asset_code, name, description, category, location, qr_code_url)
      VALUES (${assetCode}, ${name}, ${description || null}, ${category || null}, ${location || null}, ${publicUrl})
      RETURNING *
    `;

    return Response.json({ asset: assets[0] }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
