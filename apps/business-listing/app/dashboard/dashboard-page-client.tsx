"use client"

import { useEffect, useState } from "react"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { Button } from "@/components/ui/button"
import { BusinessInfo } from "@think-id/types"
import { PlusCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useBusinessById } from "@/lib/hooks/useBusinesses"

export function DashboardPageClient({ 
  userId,
  businesses,
  selectedBusiness,
  businessId
}: { 
  userId: string;
  businesses: BusinessInfo[];
  selectedBusiness?: BusinessInfo | null;
  businessId?: string;
}) {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Fetch real-time data from TanStack using server's data as initialData
  const { data: business, isFetching, isLoading } = useBusinessById(businessId, {
    initialData: selectedBusiness
  })

  // Auto-redirect to first business if none selected
  useEffect(() => {
    if (!businessId && businesses && businesses.length > 0) {
      const firstId = businesses[0].bizId || (businesses[0] as any).id
      if (firstId) {
        setIsTransitioning(true)
        router.push(`/dashboard?businessId=${firstId}`)
      }
    }
  }, [businessId, businesses, router])

  // No businesses at all
  if (!businesses || businesses.length === 0) {
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

  // Transitioning between businesses
  if (isTransitioning) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Business requested but not found (either locally or from server)
  if (businessId && !business && !isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Business Not Found</h2>
          <p className="text-muted-foreground">The business you're looking for doesn't exist or you don't have access to it.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  // Hard loading state (if initialData wasn't provided or we forced a full re-fetch)
  if (isLoading || !business) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
         <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard structure...</p>
      </div>
    )
  }

  // Render the selected business dashboard
  return (
    <div className="min-h-screen bg-muted/30 py-8 relative">
      {/* TanStack background data fetch indicator */}
      {isFetching && !isTransitioning && (
        <div className="absolute top-2 right-4 flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm animate-pulse border border-primary/20">
          <Loader2 className="h-3 w-3 animate-spin" />
          Syncing latest updates...
        </div>
      )}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DashboardContent business={business} />
      </div>
    </div>
  )
}
