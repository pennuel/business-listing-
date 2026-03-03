"use server"

import { signIn as authSignIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function signInAction(provider: string, redirectTo?: string) {
  try {
    await authSignIn(provider, {
      redirectTo: redirectTo || "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" }
        default:
          return { error: "Something went wrong" }
      }
    }
    throw error
  }
}
