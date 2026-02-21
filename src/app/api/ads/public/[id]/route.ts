import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Increment view count
    await pool.query(
      `UPDATE provider_ads SET views = COALESCE(views, 0) + 1 WHERE id = $1`,
      [id]
    );

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
        a.neighborhood,
        a.latitude,
        a.longitude,
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
        COALESCE(pp.profile_url, u.profile_photo) AS provider_profile_photo,
        pp.phone,
        pp.whatsapp
      FROM provider_ads a
      JOIN users u ON u.id = a.user_id
      LEFT JOIN provider_profiles pp ON pp.user_id = u.id
      WHERE a.id = $1 AND a.status IN ('Postado', 'approved')`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar anúncio:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
