import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  const email = "admin@example.com";
  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;

  if (existing.length > 0) {
    console.log("Admin user already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash("admin123", 12);
  await sql`
    INSERT INTO users (name, email, password_hash, role)
    VALUES ('Admin', ${email}, ${passwordHash}, 'admin')
  `;

  console.log("✅ Admin user created:");
  console.log("   Email:    admin@example.com");
  console.log("   Password: admin123");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
