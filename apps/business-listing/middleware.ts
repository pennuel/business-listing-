import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protect dashboard and backoffice routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/backoffice")) {
    if (!isLoggedIn) {
      // Prefer redirecting directly to FusionAuth provider if configured
      const providerPath =
        process.env.FUSIONAUTH_CLIENT_ID &&
        process.env.FUSIONAUTH_CLIENT_SECRET &&
        process.env.FUSIONAUTH_ISSUER
          ? "/api/auth/signin/fusionauth"
          : "/login";

      const redirectUrl = new URL(providerPath, req.url);
      redirectUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/login",
    "/backoffice/:path*",
  ],
};
