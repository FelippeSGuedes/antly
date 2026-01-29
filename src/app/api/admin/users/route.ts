import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminUser } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { rows } = await pool.query(
    `SELECT u.id,
            u.name,
            u.email,
            u.role,
            p.category,
            p.phone,
            p.whatsapp,
            p.city,
            p.state,
            p.address,
            p.number
       FROM users u
       LEFT JOIN provider_profiles p ON p.user_id = u.id
      ORDER BY u.id DESC`
  );

  return NextResponse.json(rows);
}
