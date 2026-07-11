import { sql } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request, { params }) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const assets = await sql`SELECT * FROM assets WHERE id = ${id}`;
  if (!assets[0]) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ asset: assets[0] });
}

export async function PATCH(request, { params }) {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const allowed = ["name", "description", "category", "location", "status", "next_service_date"];
    const updates = [];

    for (const key of allowed) {
      if (body[key] !== undefined) {
        updates.push(sql`${sql.unsafe(key)} = ${body[key]}`);
      }
    }

    if (updates.length === 0) {
      return Response.json({ error: "No valid fields to update" }, { status: 400 });
    }

    updates.push(sql`updated_at = NOW()`);

    const assets = await sql`
      UPDATE assets SET ${sql.unsafe(updates.map((u) => u.query).join(", "))}
      WHERE id = ${id}
      RETURNING *
    `;

    return Response.json({ asset: assets[0] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
