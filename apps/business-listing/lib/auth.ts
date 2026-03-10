import NextAuth from "next-auth";
import FusionAuthProvider from "next-auth/providers/fusionauth";
import { userService } from "@think-id/database";

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
    signIn: "/login",
    // error: "/login",
  },
  callbacks: {
    /**
     * Fires once when the user completes the OAuth flow.
     * We use this to ensure the user is registered to the
     * business-listing application in FusionAuth.
     */
    async signIn({ profile }) {
      const userId = (profile as any)?.sub;

      console.log("this is the userId",userId)

      
      // Sync user to our local DB right after successful FusionAuth login
      try {
        const checkUser = await userService.getUserById(userId);
        console.log("this is the checkUser",checkUser)
        if (!checkUser) {
          await userService.syncUserWithDB(userId);
          console.log("user synced to local database")
        }
      } catch (dbError) {
        console.error(
          "[auth] Failed to sync user to local database during sign in:",
          dbError,
        );
      }

      return true;
    },

    async jwt({ token, user, profile }) {
      // Only populated on the first sign-in — capture FusionAuth user ID
      if (user && profile) {
        // FusionAuth sets the user ID in the 'sub' claim
        token.sub = (profile as any)?.sub || token.sub;
        // Store additional profile data if needed
        token.email = (user as any)?.email || (profile as any)?.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        // Use token.sub which contains the FusionAuth user ID
        session.user.id = token.sub as string;

        // console.log("Session callback - session.user:", session.user)

        if (!session.user.id) {
          try {
            const dbUser = await userService.syncUserWithDB(
              token.sub as string,
            );
            // session.user.dbUser = dbUser
            // session.user.dbSynced = true
          } catch (error) {
            console.error("Failed to sync user on login:", error);
          }
        }
      }
      console.log("Session callback - final session:", session);
      return session;
    },
  },
});
