import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const { rows } = await pool.query(
      `SELECT 
        a.id,
        a.title,
        a.description,
        a.category,
        a.status,
        a.created_at,
        a.service_function,
        a.service_type,
        a.city,
        a.state,
        a.service_radius,
        a.payment_methods,
        a.attendance_24h,
        a.warranty,
        a.photos,
        a.views,
        a.ratings_count,
        a.ratings_avg,
        u.id AS user_id,
        u.name AS provider_name,
        pp.phone,
        pp.whatsapp
      FROM provider_ads a
      JOIN users u ON u.id = a.user_id
      LEFT JOIN provider_profiles pp ON pp.user_id = u.id
      WHERE a.status = 'approved'
      ORDER BY a.created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // Get total count
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) as total FROM provider_ads WHERE status = 'approved'`
    );

    return NextResponse.json({
      ads: rows,
      total: parseInt(countRows[0].total),
      limit,
      offset
    });
  } catch (error) {
    console.error("Erro ao buscar anúncios:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
