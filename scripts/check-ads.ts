import { Pool } from "pg";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL não está definida em .env.local");
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function checkAds() {
  const client = await pool.connect();
  try {
    // 1. All ads
    console.log("\n========== PROVIDER ADS ==========");
    const ads = await client.query(
      `SELECT id, title, status, city, state, neighborhood, latitude, longitude, service_radius, user_id
       FROM provider_ads ORDER BY id`
    );
    console.table(ads.rows);

    // 2. Provider users
    console.log("\n========== PROVIDER USERS ==========");
    const users = await client.query(
      `SELECT id, name, role FROM users WHERE LOWER(role) IN ('provider', 'prestador')`
    );
    console.table(users.rows);

    // 3. Provider profiles
    console.log("\n========== PROVIDER PROFILES ==========");
    const profiles = await client.query(
      `SELECT user_id, zip, city, phone, whatsapp FROM provider_profiles`
    );
    console.table(profiles.rows);

  } catch (err) {
    console.error("❌ Erro ao consultar banco:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkAds();
