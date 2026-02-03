import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminUser } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { rows } = await pool.query(
    `SELECT u.id,
            u.name,
            u.email,
            u.role,
            u.created_at,
            p.category,
            p.phone,
            p.whatsapp,
            p.city,
            p.state,
            p.address,
            p.number,
            p.cpf,
            p.profile_url,
            p.service_type,
            p.has_cnpj,
            p.issues_invoice,
            p.attends_other_cities,
            p.service_radius,
            p.experience,
            p.availability
       FROM users u
       LEFT JOIN provider_profiles p ON p.user_id = u.id
      ORDER BY u.id DESC`
  );

  // Map backend rows to frontend friendly structure if needed (handling snake_case)
  const mappedRows = rows.map((row: Record<string, unknown>) => ({
      ...row,
      profileUrl: row.profile_url,
      serviceType: row.service_type,
      hasCnpj: row.has_cnpj,
      issuesInvoice: row.issues_invoice,
      attendsOtherCities: row.attends_other_cities,
      serviceRadius: row.service_radius
  }));

  return NextResponse.json(mappedRows);
}
