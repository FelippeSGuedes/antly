import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAuthCookie, verifyAuthToken } from "@/lib/auth";

export const runtime = "nodejs";

type GeoPoint = {
  latitude: number;
  longitude: number;
};

const isValidCPF = (cpf: string | null | undefined) => {
  if (typeof cpf !== "string") return false;
  const cleanCPF = cpf.replace(/[^\d]+/g, "");
  if (cleanCPF.length !== 11 || !!cleanCPF.match(/(\d)\1{10}/)) return false;

  const validateDigit = (t: number) => {
    let d = 0;
    let c = 0;
    for (t; t >= 2; t--) {
      d += parseInt(cleanCPF.substring(c, c + 1)) * t;
      c++;
    }
    d = (d * 10) % 11;
    if (d === 10 || d === 11) d = 0;
    return d;
  };

  if (validateDigit(10) !== parseInt(cleanCPF.substring(9, 10))) return false;
  if (validateDigit(11) !== parseInt(cleanCPF.substring(10, 11))) return false;
  return true;
};

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

export async function GET() {
  const payload = await getProviderUser();
  if (!payload) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { rows } = await pool.query(
    `SELECT id, title, description, category, status, created_at,
            service_function, service_type, city, state, service_radius,
            payment_methods, attendance_24h, emits_invoice, warranty,
            own_equipment, specialized_team, availability, photos,
            views, ratings_count, ratings_avg
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
    `SELECT address, number, zip, category, phone, whatsapp, city, state,
            cpf, service_type, service_radius, issues_invoice, availability, bio
       FROM provider_profiles WHERE user_id = $1`,
    [payload.sub]
  );
  const profile = profileRows[0];
  const address = profile?.address;
  const number = profile?.number;
  const zip = profile?.zip;
  const category = profile?.category;
  const phone = profile?.phone;
  const whatsapp = profile?.whatsapp;
  const city = profile?.city;
  const state = profile?.state;
  const cpf = profile?.cpf;
  const serviceType = profile?.service_type;
  const serviceRadius = profile?.service_radius ?? 0;
  const issuesInvoice = profile?.issues_invoice ?? false;
  const availability = profile?.availability ?? [];
  const bio = profile?.bio ?? "";

  if (!address || !number || !category || !phone || !whatsapp || !city) {
    return NextResponse.json(
      { error: "Complete endereço, categoria e contatos no perfil antes de anunciar." },
      { status: 400 }
    );
  }
  if (!isValidCPF(cpf)) {
    return NextResponse.json(
      { error: "CPF inválido. Para anunciar, valide o CPF no perfil." },
      { status: 400 }
    );
  }
  if (!serviceType) {
    return NextResponse.json(
      { error: "Defina o tipo de atendimento no perfil antes de anunciar." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { title, serviceFunction, description, paymentMethods, attendance24h, warranty, ownEquipment, specializedTeam, photos } = body as {
    title?: string;
    serviceFunction?: string;
    description?: string;
    paymentMethods?: string[];
    attendance24h?: boolean;
    warranty?: boolean;
    ownEquipment?: boolean;
    specializedTeam?: boolean;
    photos?: string[];
  };

  if (!title || title.length < 10 || title.length > 80) {
    return NextResponse.json({ error: "Título do serviço deve ter entre 10 e 80 caracteres." }, { status: 400 });
  }
  if (!serviceFunction) {
    return NextResponse.json({ error: "Função é obrigatória." }, { status: 400 });
  }
  if (photos && photos.length > 7) {
    return NextResponse.json({ error: "Envie no máximo 7 imagens." }, { status: 400 });
  }

  const finalDescription = description && description.trim().length > 0 ? description : bio;

  // Garante colunas de geolocalização aproximada (bairro/região)
  await pool.query(`
    ALTER TABLE provider_ads
    ADD COLUMN IF NOT EXISTS neighborhood VARCHAR(120),
    ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
  `);

  const cepData = await getCepData(zip);
  const neighborhood = cepData?.neighborhood || null;

  const geoQuery = [
    cepData?.neighborhood,
    cepData?.city || city,
    cepData?.state || state,
    "Brasil",
  ]
    .filter(Boolean)
    .join(", ");

  const geoPoint = await geocodeApproximateLocation(geoQuery);
  const latitude = geoPoint?.latitude ?? null;
  const longitude = geoPoint?.longitude ?? null;

  const { rows } = await pool.query(
    `INSERT INTO provider_ads (
        user_id, title, description, category, status, service_function, service_type,
        city, state, service_radius, payment_methods, attendance_24h, emits_invoice,
        warranty, own_equipment, specialized_team, availability, photos,
        neighborhood, latitude, longitude
     )
     VALUES ($1, $2, $3, $4, 'Em Analise', $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
     RETURNING id, title, description, category, status, created_at,
              service_function, service_type, city, state, service_radius,
              payment_methods, attendance_24h, emits_invoice, warranty,
              own_equipment, specialized_team, availability, photos,
              neighborhood, latitude, longitude,
              views, ratings_count, ratings_avg`,
    [
      payload.sub,
      title,
      finalDescription ?? "",
      category,
      serviceFunction,
      serviceType,
      city,
      state,
      serviceRadius,
      paymentMethods ?? [],
      attendance24h ?? false,
      issuesInvoice,
      warranty ?? false,
      ownEquipment ?? false,
      specializedTeam ?? false,
      availability,
      photos ?? [],
      neighborhood,
      latitude,
      longitude,
    ]
  );

  return NextResponse.json(rows[0], { status: 201 });
}
