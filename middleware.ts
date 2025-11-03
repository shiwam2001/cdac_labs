import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// --- Configuration ---
const RATE_LIMIT = 100; // max requests allowed
const WINDOW = 60 * 1000; // 1 minute
const requests = new Map<string, { count: number; startTime: number }>();

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // --------------------------
  // 🔹 1. Authentication Check
  // --------------------------
  const token = req.cookies.get("session")?.value;

  if (!token) {
    if (
      url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/user") ||
      url.pathname.startsWith("/custodian")
    ) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Parse role from token safely
  let userRole = "";
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
    userRole = payload.role;
  } catch (err) {
    console.error("Invalid token:", err);
  }

  // 🔸 Role-based access control
  if (url.pathname.startsWith("/admin") && userRole !== "ADMIN") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/user") && userRole !== "USER") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/custodian") && userRole !== "CUSTODIAN") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // --------------------------
  // 🔹 2. Rate Limiting Check
  // --------------------------
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry) {
    requests.set(ip, { count: 1, startTime: now });
    return NextResponse.next();
  }

  // Reset window if expired
  if (now - entry.startTime > WINDOW) {
    requests.set(ip, { count: 1, startTime: now });
    return NextResponse.next();
  }

  entry.count++;

  // Block if over limit
  if (entry.count > RATE_LIMIT) {
    return new NextResponse(
      JSON.stringify({ message: "Too many requests, please try again later." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Continue if allowed
  return NextResponse.next();
}

// --------------------------
// 🔹 Run middleware on specific routes
// --------------------------
export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/custodian/:path*",
    // optionally:
    // "/api/:path*"
  ],
};
