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

  const { rows } = await pool.query(
    `SELECT id, title, description, category, status, created_at
     FROM provider_ads
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [payload.sub]
  );

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const payload = await getProviderUser();
  if (!payload) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { rows: profileRows } = await pool.query(
    "SELECT address, number, category, phone, whatsapp FROM provider_profiles WHERE user_id = $1",
    [payload.sub]
  );
  const address = profileRows[0]?.address;
  const number = profileRows[0]?.number;
  const category = profileRows[0]?.category;
  const phone = profileRows[0]?.phone;
  const whatsapp = profileRows[0]?.whatsapp;
  if (!address || !number || !category || !phone || !whatsapp) {
    return NextResponse.json(
      { error: "Complete endereço, categoria e contatos no perfil antes de anunciar." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { title, description } = body as {
    title?: string;
    description?: string;
  };

  if (!title) {
    return NextResponse.json({ error: "Função é obrigatória." }, { status: 400 });
  }

  const { rows } = await pool.query(
    `INSERT INTO provider_ads (user_id, title, description, category, status)
     VALUES ($1, $2, $3, $4, 'Em Analise')
     RETURNING id, title, description, category, status, created_at`,
    [payload.sub, title, description ?? "", category]
  );

  return NextResponse.json(rows[0], { status: 201 });
}
