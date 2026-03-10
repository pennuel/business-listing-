import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protect dashboard and backoffice routes — redirect straight to FusionAuth
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/backoffice")) {
    if (!isLoggedIn) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/backoffice/:path*"],
};
