import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, AlertCircle } from "lucide-react"
import { signInAction } from "@/app/actions/auth"

export default async function LoginPage(props: {searchParams: Promise<{ error?: string, callbackUrl?: string }>}) {
  const searchParams = await props.searchParams
  const error = searchParams?.error
  const callbackUrl = searchParams?.callbackUrl || "/"

  // Automatically trigger sign-in if there's no error
  if (!error) {
    await signInAction("fusionauth", callbackUrl)
  }

  // Create a Server Action specifically for this page to use the callbackUrl to retry
  const handleSignIn = async () => {
    "use server"
    await signInAction("fusionauth", callbackUrl)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          <CardDescription>We could not sign you in automatically.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2 w-full mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>There was a problem authenticating with the server. Please try again.</span>
            </div>
          )}
          
          <form action={handleSignIn} className="w-full">
            <button 
              type="submit" 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition shadow-sm"
            >
              Sign In with Think ID
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

