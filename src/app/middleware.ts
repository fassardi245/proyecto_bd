import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";

  // Protege solo el dashboard
  if (!isLoggedIn && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Permite todo lo demás, incluyendo / aunque estés logueado
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
