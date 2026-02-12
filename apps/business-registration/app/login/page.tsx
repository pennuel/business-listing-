"use client"

import type React from "react"
import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Github, Mail, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("demo@example.com")
  const [password, setPassword] = useState("password")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    // credentials no longer supported; prevent default and show a helpful message
    e.preventDefault()
    setError("This app uses FusionAuth OAuth. Use the 'Continue with FusionAuth' button.")
  }

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true)
    setError("")

    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
        redirect: true,
      })
    } catch (error) {
      console.error("OAuth login error:", error)
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Business Platform account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* OAuth Providers */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => handleOAuthLogin("fusionauth")}
              disabled={isLoading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with FusionAuth
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Informational note: credentials removed in favor of FusionAuth OAuth */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="text-sm text-muted-foreground">
              This application uses FusionAuth for authentication. Click "Continue with FusionAuth" to sign in.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
