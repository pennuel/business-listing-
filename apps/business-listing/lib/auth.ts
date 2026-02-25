import NextAuth from "next-auth"
import FusionAuthProvider from "next-auth/providers/fusionauth"
import { userService } from "@think-id/database"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
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
        token.id = (user as any).id ?? (profile as any)?.sub ?? token.sub
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string

        // console.log("Session callback - session.user:", session.user)

        if (!session.user.id) {
          try {
            const dbUser = await userService.syncUserWithDB(token.id as string)
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
  secret: process.env.NEXTAUTH_SECRET,
})
