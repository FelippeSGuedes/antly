import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await pool.query(`
      ALTER TABLE provider_profiles
      ADD COLUMN IF NOT EXISTS cpf VARCHAR(20),
      ADD COLUMN IF NOT EXISTS profile_url TEXT,
      ADD COLUMN IF NOT EXISTS service_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS has_cnpj BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS issues_invoice BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS attends_other_cities BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS service_radius INTEGER DEFAULT 15,
      ADD COLUMN IF NOT EXISTS experience VARCHAR(50),
      ADD COLUMN IF NOT EXISTS availability TEXT[];
    `);
    await pool.query(`
      ALTER TABLE provider_ads
      ADD COLUMN IF NOT EXISTS service_function VARCHAR(80),
      ADD COLUMN IF NOT EXISTS service_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS city VARCHAR(100),
      ADD COLUMN IF NOT EXISTS state VARCHAR(10),
      ADD COLUMN IF NOT EXISTS service_radius INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS payment_methods TEXT[],
      ADD COLUMN IF NOT EXISTS attendance_24h BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS emits_invoice BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS warranty BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS own_equipment BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS specialized_team BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS availability TEXT[],
      ADD COLUMN IF NOT EXISTS photos TEXT[],
      ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS ratings_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS ratings_avg NUMERIC(3,2) DEFAULT 0;
    `);
    return NextResponse.json({ success: true, message: "Columns added successfully" });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
