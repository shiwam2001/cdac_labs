import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
 // ya agar tum custom token use karte ho to manually parse karo

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // 🔹 token ya cookie check karo
  const token = req.cookies.get("session")?.value 

  // agar token nahi hai → login page par bhej do
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

  // 🔹 Yahan tum apna user fetch kar sakte ho backend se (optional)
  // example: const user = await getUserFromToken(token)
  // abhi demo ke liye maan lo token ke andar role stored hai
  let userRole = "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    userRole = payload.role;
  } catch (err) {
    console.error("Invalid token:", err);
  }

  // 🔹 Route protection
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

  // agar sab ok hai to request allow karo
  return NextResponse.next();
}

// 🔹 Define which routes middleware run kare
export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/custodian/:path*",
  ],
};
