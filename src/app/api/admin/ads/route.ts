import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminUser } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const params: string[] = [];
  let whereClause = "";
  if (status) {
    params.push(status);
    whereClause = "WHERE a.status = $1";
  }

  const { rows } = await pool.query(
    `SELECT a.id,
            a.title,
            a.description,
            a.category,
            CASE
              WHEN a.status IN ('approved', 'postado', 'Postado') THEN 'Postado'
              WHEN a.status IN ('pending', 'em analise', 'Em Analise') THEN 'Em Analise'
              WHEN a.status IN ('rejected', 'reprovado', 'Reprovado') THEN 'Reprovado'
              ELSE a.status
            END AS status,
            a.created_at,
            u.id AS user_id,
            u.name AS user_name,
            u.email AS user_email
       FROM provider_ads a
       JOIN users u ON u.id = a.user_id
       ${whereClause}
      ORDER BY a.created_at DESC`,
    params
  );

  return NextResponse.json(rows);
}
