import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminUser } from "@/lib/admin";

export const runtime = "nodejs";

const allowedStatuses = ["Postado", "Em Analise", "Reprovado"] as const;

type AllowedStatus = (typeof allowedStatuses)[number];

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const { status } = body as { status?: AllowedStatus };

  if (!status || !allowedStatuses.includes(status)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  await pool.query(
    "UPDATE provider_ads SET status = $1, updated_at = NOW() WHERE id = $2",
    [status, params.id]
  );

  return NextResponse.json({ ok: true });
}
