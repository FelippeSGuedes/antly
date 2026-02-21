import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const runtime = "nodejs";

type GeoPoint = {
  latitude: number;
  longitude: number;
};

const onlyDigits = (value: string | null | undefined) => (value || "").replace(/\D/g, "");

async function getCepData(cep: string): Promise<{ neighborhood?: string; city?: string; state?: string } | null> {
  const cleanCep = onlyDigits(cep);
  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    if (data?.erro) return null;

    return {
      neighborhood: data?.bairro || undefined,
      city: data?.localidade || undefined,
      state: data?.uf || undefined,
    };
  } catch {
    return null;
  }
}

async function geocodeApproximateLocation(query: string): Promise<GeoPoint | null> {
  if (!query.trim()) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Antly/1.0 (service marketplace)",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;
    const data = (await response.json()) as Array<{ lat: string; lon: string }>;
    if (!data?.length) return null;

    return {
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
    };
  } catch {
    return null;
  }
}

// Garante que as colunas de geolocalização existem na tabela
let columnsEnsured = false;
async function ensureGeoColumns() {
  if (columnsEnsured) return;
  try {
    await pool.query(`
      ALTER TABLE provider_ads ADD COLUMN IF NOT EXISTS neighborhood VARCHAR(120);
      ALTER TABLE provider_ads ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
      ALTER TABLE provider_ads ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
      ALTER TABLE provider_ads ADD COLUMN IF NOT EXISTS service_radius INTEGER DEFAULT 0;
    `);
    columnsEnsured = true;
  } catch {
    // colunas já existem ou erro não-crítico
    columnsEnsured = true;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    // Garantir que colunas de geo existem antes de consultar
    await ensureGeoColumns();

    const { rows } = await pool.query(
      `SELECT 
        a.id,
        a.title,
        a.description,
        a.category,
        a.status,
        a.created_at,
        a.service_function,
        a.service_type,
        a.city,
        a.state,
        a.neighborhood,
        a.latitude,
        a.longitude,
        a.service_radius,
        a.payment_methods,
        a.attendance_24h,
        a.warranty,
        a.photos,
        a.views,
        a.ratings_count,
        a.ratings_avg,
        u.id AS user_id,
        u.name AS provider_name,
        COALESCE(pp.profile_url, u.profile_photo) AS provider_profile_photo,
        pp.zip,
        pp.phone,
        pp.whatsapp
      FROM provider_ads a
      JOIN users u ON u.id = a.user_id
      LEFT JOIN provider_profiles pp ON pp.user_id = u.id
      WHERE a.status IN ('Postado', 'approved')
      ORDER BY a.created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // Backfill: geocodificar anúncios sem coordenadas
    for (const ad of rows) {
      const hasCoordinates = typeof ad.latitude === "number" && typeof ad.longitude === "number";
      if (hasCoordinates) continue;

      let cepData: { neighborhood?: string; city?: string; state?: string } | null = null;

      // Tentar buscar dados pelo CEP do perfil
      if (ad.zip) {
        cepData = await getCepData(ad.zip);
      }

      const neighborhood = ad.neighborhood || cepData?.neighborhood || null;
      const city = cepData?.city || ad.city;
      const state = cepData?.state || ad.state;

      // Tentar múltiplas queries de geocodificação para melhorar chance de sucesso
      let point: GeoPoint | null = null;

      // Tentativa 1: bairro + cidade + estado
      if (neighborhood && city) {
        point = await geocodeApproximateLocation(`${neighborhood}, ${city}, ${state || ""}, Brasil`);
      }

      // Tentativa 2: apenas cidade + estado
      if (!point && city) {
        point = await geocodeApproximateLocation(`${city}, ${state || ""}, Brasil`);
      }

      if (!point) {
        console.log(`[backfill] Não foi possível geocodificar anúncio ${ad.id} (${city}, ${state})`);
        continue;
      }

      console.log(`[backfill] Anúncio ${ad.id} geocodificado: ${point.latitude}, ${point.longitude} (${city}, ${state})`);

      ad.neighborhood = neighborhood;
      ad.latitude = point.latitude;
      ad.longitude = point.longitude;

      try {
        await pool.query(
          `UPDATE provider_ads
           SET neighborhood = COALESCE($1, neighborhood),
               latitude = COALESCE($2, latitude),
               longitude = COALESCE($3, longitude)
           WHERE id = $4`,
          [neighborhood, point.latitude, point.longitude, ad.id]
        );
      } catch (err) {
        console.error(`[backfill] Erro ao atualizar anúncio ${ad.id}:`, err);
      }
    }

    // Get total count
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) as total FROM provider_ads WHERE status IN ('Postado', 'approved')`
    );

    return NextResponse.json({
      ads: rows,
      total: parseInt(countRows[0].total),
      limit,
      offset
    });
  } catch (error) {
    console.error("Erro ao buscar anúncios:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
