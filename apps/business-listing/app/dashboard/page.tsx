import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getBusinessesByUserIdAction } from "@/app/actions/business"
import { DashboardPageClient } from "./dashboard-page-client"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ businessId?: string }>
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = session.user.id
  const params = await searchParams
  let businessId = params.businessId

  
  // Fetch businesses to determine which one to use
  const result = await getBusinessesByUserIdAction(userId)
  
  const businesses = result.success ? result.businesses || [] : []

  // If no businessId provided, use the first business
  if (!businessId && businesses.length > 0) {
    businessId = String(businesses[0].id || businesses[0].biz_id)
  }

  // Find the selected business
  const selectedBusiness = businessId 
    ? businesses.find(b => {
        const bId = String((b as any).id || (b as any).biz_id)
        const match = bId === businessId
        return match
      })
    : null
  
  return (
    <DashboardPageClient 
      userId={userId}
      businesses={businesses}
      selectedBusiness={selectedBusiness}
      businessId={businessId}
    />
  )
}
