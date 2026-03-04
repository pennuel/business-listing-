import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const issuer = process.env.FUSIONAUTH_ISSUER;
  const clientId = process.env.FUSIONAUTH_CLIENT_ID;
  const appUrl =
    process.env.NEXT_PUBLIC_BUSINESS_LISTING_URL || "http://localhost:3000";

  // If environment variables are missing, fallback to redirecting to home
  if (!issuer || !clientId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Construct the FusionAuth logout URL
  // This destroys the global FusionAuth SSO session and redirects back to the app URL
  const fusionAuthLogoutUrl = `${issuer}/oauth2/logout?client_id=${clientId}&post_logout_redirect_uri=${encodeURIComponent(
    appUrl,
  )}`;

  return NextResponse.redirect(fusionAuthLogoutUrl);
}
