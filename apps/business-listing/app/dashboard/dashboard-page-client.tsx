"use client"

import { useEffect } from "react"
import { useUserBusinesses, useBusinessById } from "@/lib/hooks/useBusinesses"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function DashboardPageClient({ 
  userId, 
  businessId 
}: { 
  userId: string;
  businessId?: string;
}) {
  const router = useRouter()
  console.log("DashboardPageClient - userId:", userId, "businessId:", businessId)
  
  // Fetch all user businesses
  const { data, isLoading: isLoadingBusinesses } = useUserBusinesses(userId)

  // Fetch specific business if businessId is provided
  const { data: selectedBusiness, isLoading: isLoadingBusiness } = useBusinessById(businessId)

  // Redirect if no businessId but businesses exist
  useEffect(() => {
    if (!businessId && data && data.length > 0) {
      const firstBiz = data[0]
      const id = firstBiz.bizId || (firstBiz as any).id
      if (id) {
        router.replace(`/dashboard?businessId=${id}`)
      }
    }
  }, [businessId, data, router])

  console.log("Businesses-Dashboard-Client:", data)

  if (isLoadingBusinesses) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isLoadingBusinesses || (businessId && isLoadingBusiness)) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // No businesses at all
  if (!data || data.length === 0) {
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

  const businessToRender = businessId ? selectedBusiness : null;

  console.log("Selected Business:", businessToRender)

  if (businessId && !businessToRender && !isLoadingBusiness) {
     return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4">
            <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Business Not Found</h2>
            </div>
        </div>
     )
  }

  if (!businessToRender) return null;

  return <DashboardContent business={businessToRender} />
}
