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

    // Buscar serviços finalizados sem avaliação
    const pendingResult = await pool.query(
      `SELECT 
        s.id,
        s.title,
        s.created_at,
        s.completed_at,
        u.name as client_name,
        u.id as client_id
      FROM services s
      JOIN users u ON s.client_id = u.id
      WHERE s.provider_id = $1 
        AND s.status = 'completed'
        AND NOT EXISTS (
          SELECT 1 FROM reviews r 
          WHERE r.service_id = s.id 
            AND r.reviewer_id = $1
        )
      ORDER BY s.completed_at DESC`,
      [payload.sub]
    ).catch(() => ({ rows: [] }));

    const pending = pendingResult.rows.map((row: any) => ({
      serviceId: row.id,
      serviceTitle: row.title,
      clientName: row.client_name,
      clientId: row.client_id,
      completedAt: row.completed_at,
      createdAt: row.created_at
    }));

    return NextResponse.json({ pending });
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending reviews" },
      { status: 500 }
    );
  }
}
