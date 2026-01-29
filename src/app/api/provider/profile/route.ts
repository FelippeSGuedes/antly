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

export async function GET() {
  const payload = await getProviderUser();
  if (!payload) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { rows: profileRows } = await pool.query(
    "SELECT address, number, city, state, zip, category, phone, whatsapp, bio FROM provider_profiles WHERE user_id = $1",
    [payload.sub]
  );

  return NextResponse.json({
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    role: payload.role,
    profile: profileRows[0] || null
  });
}

export async function PUT(request: Request) {
  const payload = await getProviderUser();
  if (!payload) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const { name, address, number, city, state, zip, category, phone, whatsapp, bio } = body as {
    name?: string;
    address?: string;
    number?: string;
    city?: string;
    state?: string;
    zip?: string;
    category?: string;
    phone?: string;
    whatsapp?: string;
    bio?: string;
  };

  if (!name) {
    return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
  }

  await pool.query("UPDATE users SET name = $1 WHERE id = $2", [name, payload.sub]);

  await pool.query(
    `INSERT INTO provider_profiles (user_id, address, number, city, state, zip, category, phone, whatsapp, bio)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (user_id)
     DO UPDATE SET address = $2, number = $3, city = $4, state = $5, zip = $6, category = $7, phone = $8, whatsapp = $9, bio = $10, updated_at = NOW()`,
    [
      payload.sub,
      address ?? "",
      number ?? "",
      city ?? "",
      state ?? "",
      zip ?? "",
      category ?? "",
      phone ?? "",
      whatsapp ?? "",
      bio ?? ""
    ]
  );

  return NextResponse.json({ ok: true });
}
