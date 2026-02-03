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

    const userId = payload.sub;

    // Buscar estatísticas do cliente
    const statsQueries = await Promise.all([
      // Total de serviços contratados
      pool.query(
        `SELECT COUNT(*) as total_services FROM services WHERE client_id = $1`,
        [userId]
      ).catch(() => ({ rows: [{ total_services: 0 }] })),
      // Total de avaliações feitas
      pool.query(
        `SELECT COUNT(*) as total_reviews FROM reviews WHERE reviewer_id = $1`,
        [userId]
      ).catch(() => ({ rows: [{ total_reviews: 0 }] })),
      // Completude do perfil (campos preenchidos)
      pool.query(
        `SELECT 
          CASE WHEN name IS NOT NULL AND name != '' THEN 1 ELSE 0 END +
            CASE WHEN email IS NOT NULL AND email != '' THEN 1 ELSE 0 END +
            CASE WHEN phone IS NOT NULL AND phone != '' THEN 1 ELSE 0 END +
            CASE WHEN cpf IS NOT NULL AND cpf != '' THEN 1 ELSE 0 END +
            CASE WHEN cep IS NOT NULL AND cep != '' THEN 1 ELSE 0 END +
            CASE WHEN city IS NOT NULL AND city != '' THEN 1 ELSE 0 END +
            CASE WHEN state IS NOT NULL AND state != '' THEN 1 ELSE 0 END +
            CASE WHEN profile_photo IS NOT NULL AND profile_photo != '' THEN 1 ELSE 0 END as filled_fields
         FROM users 
         WHERE id = $1`,
        [userId]
      )
    ]);

    const filledFields = statsQueries[2].rows[0].filled_fields || 0;
    const totalFields = 8;
    const profileCompletion = Math.round((filledFields / totalFields) * 100);

    const stats = {
      totalServices: parseInt(statsQueries[0].rows[0].total_services) || 0,
      totalReviews: parseInt(statsQueries[1].rows[0].total_reviews) || 0,
      profileCompletion
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching client stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
