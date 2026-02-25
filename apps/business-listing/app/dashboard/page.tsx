
import { auth } from "@/lib/auth"
import { businessRepository, } from "@think-id/database"
import { redirect } from "next/navigation"

import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"


export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ businessId?: string }>
}) {

  const session = await auth()

  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // const Business

  const params = await searchParams
  const businessId = params.businessId
  let business;

  if (businessId) {
    business = await businessRepository.findById(businessId)
  } else {
    // If no businessId provided, try to find the first business for this user
    const businesses = await businessRepository.findByUserId(session.user.id)

    console.log("User businesses:", businesses)

    if (businesses && businesses.length > 0) {
      // Redirect to the dashboard with the first business ID to keep URL consistent
      const firstBiz = businesses[0]
      const id = firstBiz.bizId || (firstBiz as any).id
      if (id) {
        redirect(`/dashboard?businessId=${id}`)
      }
    }
  }

  if (!business) {
    // No business found and none to redirect to
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Welcome to your Dashboard</h2>
          <p className="text-muted-foreground">You don't have any businesses yet. Create your first one to get started.</p>
        </div>
        <Button asChild>
          <Link href={`${process.env.NEXT_PUBLIC_THINK_ID_URL || 'http://localhost:3000'}/onboarding?returnTo=${encodeURIComponent(process.env.NEXT_PUBLIC_BUSINESS_LISTING_URL || 'http://localhost:3002')}/dashboard`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Business
          </Link>
        </Button>
      </div>
    )
  }

  return <DashboardContent business={business} />
}
