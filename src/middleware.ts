// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  // First let Auth0’s middleware do its thing (mount /auth routes, manage session, etc.)
  const authRes = await auth0.middleware(request);

  const { pathname } = request.nextUrl;

  // 1) Let Auth0 handle its own /auth routes completely
  if (pathname.startsWith("/auth")) {
    return authRes;
  }

  // 2) Public routes (no login required)
  if (pathname === "/") {
    return authRes;
  }

  // 3) Protected routes: /profile, /forcedLoggedOut, /phone
  const protectedRoutes = ["/profile", "/forcedLoggedOut", "/phone"];
  const isProtected = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected) {
    const session = await auth0.getSession(request);

    // No session → redirect to login with returnTo
    if (!session) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // User is logged in → allow access
    return authRes;
  }

  // 4) Default: everything else is public
  return authRes;
}

// VERY IMPORTANT: Auth0 middleware must see *all* app routes (except static)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
