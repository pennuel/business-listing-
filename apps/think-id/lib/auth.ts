import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FusionAuthProvider from "next-auth/providers/fusionauth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // FusionAuth (OpenID Connect/OAuth2) provider
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
  callbacks: {
    async jwt({ token, user, profile }) {
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
        session.user.id = token.sub as string;
        console.log("session data", session);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
