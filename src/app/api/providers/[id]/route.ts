import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const providerId = parseInt(id);

    if (isNaN(providerId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    // Buscar o profissional (schema atual)
    const providerResult = await pool.query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        COALESCE(pp.phone, u.phone) as phone,
        COALESCE(pp.city, u.city) as city,
        COALESCE(pp.state, u.state) as state,
        u.created_at,
        NULL::INTEGER as category_id,
        pp.bio as description,
        NULL::DOUBLE PRECISION as latitude,
        NULL::DOUBLE PRECISION as longitude,
        FALSE as verified,
        pp.category as category,
        pp.profile_url as profile_url,
        pp.service_type as service_type,
        COALESCE(
          (SELECT AVG(r.rating)::numeric(3,2) 
           FROM reviews r 
           WHERE r.reviewed_id = u.id),
          0
        ) as rating,
        COALESCE(
          (SELECT COUNT(*) 
           FROM reviews r 
           WHERE r.reviewed_id = u.id),
          0
        ) as reviews_count
      FROM users u
      JOIN provider_profiles pp ON pp.user_id = u.id
      WHERE u.id = $1 AND LOWER(u.role) IN ('provider', 'prestador')`,
      [providerId]
    );

    if (providerResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Profissional não encontrado" },
        { status: 404 }
      );
    }

    const provider = providerResult.rows[0];

    provider.role = provider.service_type || provider.category || "Profissional";

    // Buscar avaliações
    const reviewsResult = await pool.query(
      `SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.name as reviewer_name
      FROM reviews r
      JOIN users u ON u.id = r.reviewer_id
      WHERE r.reviewed_id = $1
      ORDER BY r.created_at DESC
      LIMIT 20`,
      [providerId]
    );

    return NextResponse.json({
      provider,
      reviews: reviewsResult.rows
    });

  } catch (error) {
    console.error("Erro ao buscar profissional:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
