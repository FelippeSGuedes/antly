import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const { rows } = await pool.query(
    "SELECT id, name, group_name FROM categories ORDER BY group_name ASC, name ASC"
  );
  return NextResponse.json(rows);
}
