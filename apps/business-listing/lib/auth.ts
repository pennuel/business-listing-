import NextAuth from "next-auth";
import FusionAuthProvider from "next-auth/providers/fusionauth";
import { userService } from "@think-id/database"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
  basePath: "/api/auth",
  providers: [
    ...(process.env.FUSIONAUTH_CLIENT_ID &&
    process.env.FUSIONAUTH_CLIENT_SECRET &&
    process.env.FUSIONAUTH_ISSUER
      ? [
          FusionAuthProvider({
            id: "fusionauth",
            name: "FusionAuth",
            clientId: process.env.FUSIONAUTH_CLIENT_ID,
            clientSecret: process.env.FUSIONAUTH_CLIENT_SECRET,
            issuer: process.env.FUSIONAUTH_ISSUER,
            authorization: { params: { scope: "openid profile email" } },
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/api/auth/signin/fusionauth",
    error: "/api/auth/signin/fusionauth",
  },
  callbacks: {
    /**
     * Fires once when the user completes the OAuth flow.
     * We use this to ensure the user is registered to the
     * business-listing application in FusionAuth.
     */
    async signIn({ profile }) {
      const userId = (profile as any)?.sub;
      const applicationId = process.env.FUSIONAUTH_APPLICATION_ID;
      const apiUrl =
        process.env.BUSINESS_SERVER_API_URL || "http://localhost:8081";

      if (!userId || !applicationId) return true; // nothing to register, allow sign-in

      try {
        const res = await fetch(`${apiUrl}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, applicationId }),
        });

        if (!res.ok) {
          const body = await res.text();
          // A 400 with "duplicate registration" is expected on subsequent logins — allow it
          if (res.status === 400 && body.toLowerCase().includes("duplicate")) {
            return true;
          }
          console.error(
            `[auth] FusionAuth registration failed (${res.status}):`,
            body,
          );
        }
      } catch (error) {
        // Don't block login if the registration call fails — log and continue
        console.error(
          "[auth] Failed to register user in FusionAuth application:",
          error,
        );
      }

      return true;
    },

    async jwt({ token, user, profile }) {
      // Only populated on the first sign-in — capture FusionAuth user ID
      if (user && profile) {
        // FusionAuth sets the user ID in the 'sub' claim
        token.sub = (profile as any)?.sub || token.sub
        // Store additional profile data if needed
        token.email = (user as any)?.email || (profile as any)?.email
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        // Use token.sub which contains the FusionAuth user ID
        session.user.id = token.sub as string

        // console.log("Session callback - session.user:", session.user)

        if (!session.user.id) {
          try {
            const dbUser = await userService.syncUserWithDB(token.sub as string)
            // session.user.dbUser = dbUser
            // session.user.dbSynced = true
          } catch (error) {
            console.error("Failed to sync user on login:", error)
          }
        }
      }
      console.log("Session callback - final session:", session)
      return session
    },
  },
});
