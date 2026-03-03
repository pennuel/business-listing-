import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Building2, AlertCircle } from "lucide-react"

export default async function LoginPage(props: {searchParams: Promise<{ error?: string }>}) {
  const searchParams = await props.searchParams
  const error = searchParams?.error

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
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>An error occurred during authentication. Please try again.</span>
            </div>
          )}

          {/* OAuth Providers wrapped in Server Action Form */}
          <div className="space-y-2">
            <form
              action={async () => {
                "use server"
                await signIn("fusionauth", { redirectTo: "/dashboard" })
              }}
            >
              <Button type="submit" variant="outline" className="w-full bg-transparent">
                <Mail className="mr-2 h-4 w-4" />
                Continue with FusionAuth
              </Button>
            </form>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="text-sm text-center text-muted-foreground">
            This application uses FusionAuth for authentication. Click "Continue with FusionAuth" to sign in.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
