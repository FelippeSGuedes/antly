import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { signAuthToken, setAuthCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha obrigatórios." }, { status: 400 });
  }

  const { rows } = await pool.query(
    "SELECT id, name, email, role, password_hash FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  const user = rows[0];
  if (!user) {
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
  }

  const token = await signAuthToken({
    sub: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role
  });

  await setAuthCookie(token);
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
