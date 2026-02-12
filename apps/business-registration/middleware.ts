import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"


//  this will be called on every request
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // Protect dashboard and onboarding routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/backoffice")) {
    if (!token) {
      // Prefer redirecting directly to FusionAuth provider if configured
      const providerPath = process.env.FUSIONAUTH_CLIENT_ID && process.env.FUSIONAUTH_CLIENT_SECRET && process.env.FUSIONAUTH_ISSUER
        ? "/api/auth/signin/fusionauth"
        : "/login"

      const redirectUrl = new URL(providerPath, request.url)
      redirectUrl.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/login"],
}
