import { sql } from "@/lib/db";

export async function GET(request, { params }) {
  const { code } = await params;

  try {
    const rows = await sql`SELECT * FROM assets WHERE asset_code = ${code}`;
    const asset = rows[0] || null;

    if (!asset) {
      return Response.json({ error: "Asset not found" }, { status: 404 });
    }

    return Response.json({ asset });
  } catch {
    return Response.json({ error: "Failed to fetch asset" }, { status: 500 });
  }
}
