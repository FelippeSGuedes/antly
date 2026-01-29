import { getAuthCookie, verifyAuthToken } from "@/lib/auth";

export async function getAdminUser() {
  const token = await getAuthCookie();
  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAuthToken(token);
    if (payload.role !== "admin") {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
