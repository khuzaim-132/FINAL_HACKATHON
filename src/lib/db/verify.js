import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function verify() {
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;

  console.log("Tables in database:");
  for (const t of tables) {
    const count = await sql`SELECT COUNT(*)::int AS cnt FROM ${sql.unsafe(t.table_name)}`;
    console.log(`  ✓ ${t.table_name} (${count[0].cnt} rows)`);
  }

  console.log("\n✅ Database schema verified.");
}

verify().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
