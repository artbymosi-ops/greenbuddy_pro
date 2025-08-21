// middleware.js (v koreňovom priečinku projektu)
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // len /admin/* paths
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // login stránka je voľná
  if (pathname === "/admin/login") return NextResponse.next();

  // skontroluj cookie
  const isAdmin = req.cookies.get("gb_admin")?.value === "1";
  if (isAdmin) return NextResponse.next();

  // presmeruj na login
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
