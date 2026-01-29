import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { signAuthToken, setAuthCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password, role } = body as {
    name?: string;
    email?: string;
    password?: string;
    role?: "client" | "provider";
  };

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
  }

  if (role !== "client" && role !== "provider") {
    return NextResponse.json({ error: "Perfil inválido." }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
    if (existing.rowCount) {
      return NextResponse.json(
        { error: "Email já cadastrado." },
        { status: 409 }
      );
    }

    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, normalizedEmail, passwordHash, role]
    );

    const user = rows[0];
    const token = await signAuthToken({
      sub: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role
    });

    await setAuthCookie(token);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "development"
        ? "Não foi possível cadastrar. Verifique o banco de dados."
        : "Não foi possível cadastrar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
