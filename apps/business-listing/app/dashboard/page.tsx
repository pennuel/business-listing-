import { redirect } from "next/navigation"
import { businessRepository } from "@think-id/database"

import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { StoreHydrator } from "@/lib/redux/store-hydrator"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { businessId?: string }
}) {
  const businessId = searchParams.businessId

  if (!businessId) {
    redirect("/")
  }

  const business = await businessRepository.findById(businessId)

  if (!business) {
    redirect("/")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <StoreHydrator business={business as any} />
      <DashboardContent />
    </div>
  )
}
