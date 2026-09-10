import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let isAuthenticated = false;
  let hasSessionError = false;

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    isAuthenticated = !!session?.user;
  } catch (error) {
    console.warn(
      "Invalid or orphaned session detected in middleware, clearing cookies...",
    );
    isAuthenticated = false;
    hasSessionError = true;
  }

  const handleRedirectWithCleanup = (destination: string) => {
    const response = NextResponse.redirect(new URL(destination, request.url));
    if (hasSessionError) {
      response.cookies.delete("better-auth.session_token");
      response.cookies.delete("__Secure-better-auth.session_token");
    }
    return response;
  };

  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return handleRedirectWithCleanup("/login");
  }

  if (pathname.startsWith("/home") && !isAuthenticated) {
    return handleRedirectWithCleanup("/login");
  }

  if (pathname.startsWith("/login") && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home/:path*", "/login", "/logout"],
};
