import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import FusionAuthProvider from "next-auth/providers/fusionauth"

export const authOptions: NextAuthOptions = {
  providers: [
    // FusionAuth (OpenID Connect/OAuth2) provider
    ...(process.env.FUSIONAUTH_CLIENT_ID && process.env.FUSIONAUTH_CLIENT_SECRET && process.env.FUSIONAUTH_ISSUER
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
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        // Try to set token.id from multiple possible sources (OAuth/OIDC subject, user id)
        token.id = (user as any).id ?? (profile as any)?.sub ?? token.sub
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
