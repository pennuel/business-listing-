"use client"

import { useBusinessById } from "@/lib/hooks/useBusinesses"
import { ServicesList } from "@/components/dashboard/services-list"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2, Store } from "lucide-react"
import Link from "next/link"

interface ServicesPageClientProps {
  businessId: string
  initialBusiness: any
}

export function ServicesPageClient({ businessId, initialBusiness }: ServicesPageClientProps) {
  const { data: business, isLoading, isError } = useBusinessById(businessId, {
    initialData: initialBusiness,
  })

  if (isLoading && !business) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !business) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <Store className="h-10 w-10 text-muted-foreground/30" />
        <p className="text-muted-foreground text-sm">Business not found.</p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  const normalizedId = (business as any).id?.toString() ?? businessId
  const services = (business as any).services ?? []

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-1 -ml-2">
          <Link href={`/dashboard?businessId=${normalizedId}`}>
            <ChevronLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>

      <ServicesList businessId={normalizedId} services={services} />
    </div>
  )
}
