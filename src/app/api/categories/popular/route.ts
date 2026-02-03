import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Buscar as 5 categorias mais usadas pelos prestadores
    const result = await pool.query(`
      SELECT 
        c.name,
        c.id,
        COUNT(pp.user_id) as provider_count
      FROM categories c
      LEFT JOIN provider_profiles pp ON pp.category = c.name
      GROUP BY c.id, c.name
      ORDER BY provider_count DESC, c.name ASC
      LIMIT 5
    `);

    const categories = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      provider_count: parseInt(row.provider_count) || 0
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching popular categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
