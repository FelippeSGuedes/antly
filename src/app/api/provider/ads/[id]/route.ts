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
    const tokenRole = String(payload.role || "").trim().toLowerCase();
    if (["provider", "prestador", "admin"].includes(tokenRole)) {
      return payload;
    }

    const { rows } = await pool.query(
      "SELECT role FROM users WHERE id = $1",
      [payload.sub]
    );

    const dbRole = String(rows[0]?.role || "").trim().toLowerCase();
    if (["provider", "prestador", "admin"].includes(dbRole)) {
      return payload;
    }

    return null;
  } catch {
    return null;
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const payload = await getProviderUser();
  if (!payload) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const { 
    title, description, serviceFunction, 
    paymentMethods, attendance24h, warranty, 
    ownEquipment, specializedTeam, photos 
  } = body;

  const { rows } = await pool.query(
    `UPDATE provider_ads
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         service_function = COALESCE($3, service_function),
         payment_methods = COALESCE($4, payment_methods),
         attendance_24h = COALESCE($5, attendance_24h),
         warranty = COALESCE($6, warranty),
         own_equipment = COALESCE($7, own_equipment),
         specialized_team = COALESCE($8, specialized_team),
         photos = COALESCE($9, photos),
         updated_at = NOW()
     WHERE id = $10 AND user_id = $11
     RETURNING *`,
    [
      title, description, serviceFunction, 
      paymentMethods, attendance24h, warranty, 
      ownEquipment, specializedTeam, photos, 
      params.id, payload.sub
    ]
  );

  if (!rows[0]) {
    return NextResponse.json({ error: "Anúncio não encontrado." }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const payload = await getProviderUser();
  if (!payload) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  await pool.query(
    "DELETE FROM provider_ads WHERE id = $1 AND user_id = $2",
    [params.id, payload.sub]
  );

  return NextResponse.json({ success: true });
}
