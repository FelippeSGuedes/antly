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

    // Buscar o profissional
    const providerResult = await pool.query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.city,
        u.state,
        u.created_at,
        pp.category_id,
        pp.description,
        pp.latitude,
        pp.longitude,
        pp.is_verified as verified,
        c.name as category,
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
      LEFT JOIN categories c ON c.id = pp.category_id
      WHERE u.id = $1 AND u.role = 'provider'`,
      [providerId]
    );

    if (providerResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Profissional não encontrado" },
        { status: 404 }
      );
    }

    const provider = providerResult.rows[0];

    // Buscar função/especialidade do profissional
    const roleResult = await pool.query(
      `SELECT f.name as role
       FROM provider_functions pf
       JOIN functions f ON f.id = pf.function_id
       WHERE pf.profile_id = (
         SELECT id FROM provider_profiles WHERE user_id = $1 LIMIT 1
       )
       LIMIT 1`,
      [providerId]
    );

    provider.role = roleResult.rows[0]?.role || provider.category || "Profissional";

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
