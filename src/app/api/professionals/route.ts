import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const { rows } = await pool.query(
    "SELECT id, name, role, category, availability, location, rating, reviews, description, tags, verified FROM professionals ORDER BY id DESC"
  );
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, role, category, location } = body as {
    name?: string;
    role?: string;
    category?: string;
    location?: string;
  };

  if (!name || !role || !category) {
    return NextResponse.json(
      { error: "Campos obrigatórios: name, role, category." },
      { status: 400 }
    );
  }

  const { rows } = await pool.query(
    `INSERT INTO professionals
      (name, role, category, availability, location, rating, reviews, description, tags, verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id, name, role, category, availability, location, rating, reviews, description, tags, verified`,
    [
      name,
      role,
      category,
      "Disponível para Orçamento",
      location ?? "",
      0,
      0,
      "",
      [],
      false
    ]
  );

  return NextResponse.json(rows[0], { status: 201 });
}
