import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAuthCookie, verifyAuthToken } from "@/lib/auth";

export const runtime = "nodejs";

async function getProviderUser() {
  const token = await getAuthCookie();
  if (!token) {
    return null;
  }
  try {
    const payload = await verifyAuthToken(token);
    if (payload.role !== "provider") {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  const payload = await getProviderUser();
  if (!payload) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, category } = body as {
    title?: string;
    description?: string;
    category?: string;
  };

  const { rows } = await pool.query(
    `UPDATE provider_ads
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         category = COALESCE($3, category),
         updated_at = NOW()
     WHERE id = $4 AND user_id = $5
     RETURNING id, title, description, category, status, created_at`,
    [title ?? null, description ?? null, category ?? null, context.params.id, payload.sub]
  );

  if (!rows[0]) {
    return NextResponse.json({ error: "Anúncio não encontrado." }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

export async function DELETE(_request: Request, context: { params: { id: string } }) {
  const payload = await getProviderUser();
  if (!payload) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { rowCount } = await pool.query(
    "DELETE FROM provider_ads WHERE id = $1 AND user_id = $2",
    [context.params.id, payload.sub]
  );

  if (!rowCount) {
    return NextResponse.json({ error: "Anúncio não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
