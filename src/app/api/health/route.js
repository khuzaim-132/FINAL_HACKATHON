import { sql } from "@/lib/db";

export async function GET() {
  try {
    const result = await sql`SELECT 1 AS connected`;
    return Response.json({ status: "ok", db: result[0] });
  } catch (error) {
    return Response.json({ status: "error", message: error.message }, { status: 500 });
  }
}
