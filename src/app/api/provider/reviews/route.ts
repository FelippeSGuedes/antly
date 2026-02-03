import { NextResponse } from "next/server";
import { getAuthCookie, verifyAuthToken } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET() {
  const token = await getAuthCookie();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyAuthToken(token);
    
    if (payload.role !== "provider") {
      return NextResponse.json({ error: "Not a provider" }, { status: 403 });
    }

    // Buscar avaliações recebidas pelo prestador
    const reviewsResult = await pool.query(
      `SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.name as client_name,
        s.title as service_title
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      LEFT JOIN services s ON r.service_id = s.id
      WHERE r.reviewed_id = $1
      ORDER BY r.created_at DESC`,
      [payload.sub]
    );

    const reviews = reviewsResult.rows.map(row => ({
      id: row.id,
      rating: row.rating,
      comment: row.comment,
      clientName: row.client_name,
      serviceTitle: row.service_title || "Serviço não especificado",
      date: new Date(row.created_at).toLocaleDateString('pt-BR')
    }));

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
