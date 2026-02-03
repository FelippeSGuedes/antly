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
    `SELECT 
      address, number, city, state, zip, category, phone, whatsapp, bio,
      cpf, profile_url, service_type, has_cnpj, issues_invoice, attends_other_cities, service_radius, experience, availability
     FROM provider_profiles WHERE user_id = $1`,
    [payload.sub]
  );

  const p = profileRows[0];
  const profile = p ? {
      ...p,
      profileUrl: p.profile_url,
      serviceType: p.service_type,
      hasCnpj: p.has_cnpj,
      issuesInvoice: p.issues_invoice,
      attendsOtherCities: p.attends_other_cities,
      serviceRadius: p.service_radius
  } : null;

  return NextResponse.json({
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    role: payload.role,
    profile: profile
  });
}

export async function PUT(request: Request) {
  const payload = await getProviderUser();
  if (!payload) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const { 
    name, address, number, city, state, zip, category, phone, whatsapp, bio,
    cpf, profileUrl, serviceType, hasCnpj, issuesInvoice, attendsOtherCities, serviceRadius, experience, availability
  } = body as any;

  if (!name) {
    return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
  }

  await pool.query("UPDATE users SET name = $1 WHERE id = $2", [name, payload.sub]);

  await pool.query(
    `INSERT INTO provider_profiles 
     (user_id, address, number, city, state, zip, category, phone, whatsapp, bio, cpf, profile_url, service_type, has_cnpj, issues_invoice, attends_other_cities, service_radius, experience, availability)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
     ON CONFLICT (user_id)
     DO UPDATE SET 
       address = EXCLUDED.address, number = EXCLUDED.number, city = EXCLUDED.city, state = EXCLUDED.state, zip = EXCLUDED.zip, 
       category = EXCLUDED.category, phone = EXCLUDED.phone, whatsapp = EXCLUDED.whatsapp, bio = EXCLUDED.bio,
       cpf = EXCLUDED.cpf, profile_url = EXCLUDED.profile_url, service_type = EXCLUDED.service_type, 
       has_cnpj = EXCLUDED.has_cnpj, issues_invoice = EXCLUDED.issues_invoice, attends_other_cities = EXCLUDED.attends_other_cities,
       service_radius = EXCLUDED.service_radius, experience = EXCLUDED.experience, availability = EXCLUDED.availability,
       updated_at = NOW()`,
    [
      payload.sub,
      address ?? "", number ?? "", city ?? "", state ?? "", zip ?? "", category ?? "", phone ?? "", whatsapp ?? "", bio ?? "",
      cpf ?? "", profileUrl ?? "", serviceType ?? "", hasCnpj ?? false, issuesInvoice ?? false, attendsOtherCities ?? false, serviceRadius ?? 0, experience ?? "", availability ?? []
    ]
  );

  return NextResponse.json({ ok: true });
}
