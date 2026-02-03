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
    
    if (payload.role !== "client") {
      return NextResponse.json({ error: "Not a client" }, { status: 403 });
    }

    // Buscar avaliações que o cliente fez sobre prestadores
    const reviewsResult = await pool.query(
      `SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.name as provider_name,
        s.title as service_title
      FROM reviews r
      JOIN users u ON r.reviewed_id = u.id
      LEFT JOIN services s ON r.service_id = s.id
      WHERE r.reviewer_id = $1
      ORDER BY r.created_at DESC`,
      [payload.sub]
    ).catch(() => ({ rows: [] }));

    const reviews = reviewsResult.rows.map((row: any) => ({
      id: row.id,
      providerName: row.provider_name,
      serviceTitle: row.service_title || "Serviço",
      rating: parseFloat(row.rating),
      comment: row.comment,
      date: row.created_at
    }));

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching client reviews given:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
