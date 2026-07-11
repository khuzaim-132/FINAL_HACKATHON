import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlFile = join(__dirname, "schema.sql");
const sql = readFileSync(sqlFile, "utf8");

async function migrate() {
  const db = neon(process.env.DATABASE_URL);

  try {
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      await db.query(stmt);
      console.log(`✓ Executed: ${stmt.slice(0, 60)}...`);
    }

    console.log("\n✅ Migration completed successfully.");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  }
}

migrate();
