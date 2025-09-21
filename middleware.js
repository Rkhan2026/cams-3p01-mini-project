import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function middleware(request) {
  const session = await getSession();
  const pathname = request.nextUrl.pathname;

  // Check if route is protected
  const isProtected =
    pathname.startsWith("/student") ||
    pathname.startsWith("/recruiter") ||
    pathname.startsWith("/tpo");

  if (isProtected && !session) {
    const url = new URL("/auth/login", request.url);
    return NextResponse.redirect(url);
  }

  // Role-based access control
  if (session && isProtected) {
    const userRole = session.role;
    
    if (pathname.startsWith("/student") && userRole !== "STUDENT") {
      const url = new URL("/auth/login", request.url);
      return NextResponse.redirect(url);
    }
    
    if (pathname.startsWith("/recruiter") && userRole !== "RECRUITER") {
      const url = new URL("/auth/login", request.url);
      return NextResponse.redirect(url);
    }
    
    if (pathname.startsWith("/tpo") && userRole !== "TPO") {
      const url = new URL("/auth/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/recruiter/:path*", "/tpo/:path*"],
};
