import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const minRating = searchParams.get("minRating");
    const search = searchParams.get("search");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "50"; // km

    let query = `
      SELECT 
        u.id,
        u.name,
        pp.category,
        pp.city,
        pp.state,
        pp.service_type,
        pp.latitude,
        pp.longitude,
        pp.profile_url,
        pp.description,
        pp.whatsapp,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as review_count,
        u.created_at
      FROM users u
      JOIN provider_profiles pp ON pp.user_id = u.id
      LEFT JOIN reviews r ON r.reviewed_id = u.id
      WHERE u.role = 'provider'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (category && category !== "Todos") {
      query += ` AND pp.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (city) {
      query += ` AND LOWER(pp.city) LIKE LOWER($${paramIndex})`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (search) {
      query += ` AND (LOWER(u.name) LIKE LOWER($${paramIndex}) OR LOWER(pp.category) LIKE LOWER($${paramIndex}) OR LOWER(pp.description) LIKE LOWER($${paramIndex}))`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` GROUP BY u.id, u.name, pp.category, pp.city, pp.state, pp.service_type, pp.latitude, pp.longitude, pp.profile_url, pp.description, pp.whatsapp, u.created_at`;

    if (minRating) {
      query += ` HAVING COALESCE(AVG(r.rating), 0) >= $${paramIndex}`;
      params.push(parseFloat(minRating));
      paramIndex++;
    }

    query += ` ORDER BY avg_rating DESC, review_count DESC`;

    const result = await pool.query(query, params);

    const providers = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      city: row.city,
      state: row.state,
      serviceType: row.service_type,
      latitude: row.latitude ? parseFloat(row.latitude) : null,
      longitude: row.longitude ? parseFloat(row.longitude) : null,
      profileUrl: row.profile_url,
      description: row.description,
      whatsapp: row.whatsapp,
      rating: parseFloat(row.avg_rating) || 0,
      reviewCount: parseInt(row.review_count) || 0,
      reviews: parseInt(row.review_count) || 0,
      location: row.city && row.state ? `${row.city}, ${row.state}` : null,
      role: row.category,
      verified: true,
      createdAt: row.created_at
    }));

    return NextResponse.json({ providers });
  } catch (error) {
    console.error("Error searching providers:", error);
    return NextResponse.json(
      { error: "Failed to search providers" },
      { status: 500 }
    );
  }
}
