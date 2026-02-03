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

    const userId = payload.sub;

    // Buscar estatísticas do prestador
    const statsQueries = await Promise.all([
      // Total de visualizações dos anúncios
      pool.query(
        `SELECT COALESCE(SUM(views), 0) as total_views FROM ads WHERE provider_id = $1`,
        [userId]
      ),
      // Serviços executados (contratos finalizados)
      pool.query(
        `SELECT COUNT(*) as services_executed FROM services WHERE provider_id = $1 AND status = 'completed'`,
        [userId]
      ).catch(() => ({ rows: [{ services_executed: 0 }] })),
      // Média de avaliações
      pool.query(
        `SELECT COALESCE(AVG(rating), 0) as avg_rating, COUNT(*) as total_reviews 
         FROM reviews WHERE reviewed_id = $1`,
        [userId]
      ).catch(() => ({ rows: [{ avg_rating: 0, total_reviews: 0 }] })),
      // Taxa de resposta (porcentagem de mensagens respondidas)
      pool.query(
        `SELECT 
          CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND((COUNT(CASE WHEN replied_at IS NOT NULL THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100)
          END as response_rate
         FROM messages 
         WHERE recipient_id = $1`,
        [userId]
      ).catch(() => ({ rows: [{ response_rate: 0 }] })),
      // Ganhos totais (se houver tabela de pagamentos)
      pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total_earnings 
         FROM payments 
         WHERE provider_id = $1 AND status = 'completed'`,
        [userId]
      ).catch(() => ({ rows: [{ total_earnings: 0 }] })) // Se a tabela não existir
    ]);

    const stats = {
      totalViews: parseInt(statsQueries[0].rows[0].total_views) || 0,
      servicesExecuted: parseInt(statsQueries[1].rows[0].services_executed) || 0,
      avgRating: parseFloat(statsQueries[2].rows[0].avg_rating).toFixed(1),
      totalReviews: parseInt(statsQueries[2].rows[0].total_reviews) || 0,
      responseRate: parseInt(statsQueries[3].rows[0].response_rate) || 0,
      totalEarnings: parseFloat(statsQueries[4].rows[0].total_earnings) || 0
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
