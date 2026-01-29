import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET não configurada.");
}

const secretKey = new TextEncoder().encode(secret);

export type AuthPayload = {
  sub: string;
  name: string;
  email: string;
  role: "client" | "provider" | "admin";
};

export async function signAuthToken(payload: AuthPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify<AuthPayload>(token, secretKey);
  return payload;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("antly_auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set("antly_auth", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("antly_auth")?.value;
}
