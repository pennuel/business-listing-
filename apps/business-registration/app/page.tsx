"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Star, ArrowRight } from "lucide-react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Building2 className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Business Platform</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Register your business, reach more customers, and grow your presence online with our comprehensive business
            listing platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/login")}>
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Building2 className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Easy Registration</CardTitle>
              <CardDescription>Simple multi-step process to get your business listed quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Complete your business profile with our intuitive onboarding flow. Add your details, location, and
                schedule in minutes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Reach Customers</CardTitle>
              <CardDescription>Connect with potential customers in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get discovered by customers searching for businesses like yours. Increase your visibility and grow your
                customer base.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Professional Profile</CardTitle>
              <CardDescription>Showcase your business with a beautiful profile</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Create a professional business profile that highlights your services, location, hours, and contact
                information.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription>Join thousands of businesses already using our platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700">
                Register Your Business
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
