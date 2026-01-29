import { NextResponse } from "next/server";
import { getAuthCookie, verifyAuthToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const token = await getAuthCookie();
  if (!token) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const payload = await verifyAuthToken(token);
    return NextResponse.json({
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role
    });
  } catch {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }
}
