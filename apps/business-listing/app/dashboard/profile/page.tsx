import { auth } from "@/lib/auth"
import { getBusinessByIdAction, getBusinessesByUserIdAction } from "@/app/actions/business"
import { redirect } from "next/navigation"
import { ProfileContent } from "@/components/dashboard/profile-content"

export default async function ProfilePage({ 
    searchParams 
}: { 
    searchParams: Promise<{ businessId?: string }>
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const params = await searchParams
  let businessId = params.businessId

  // If no businessId in URL, fall back to the first business for this user
  if (!businessId) {
    const listResult = await getBusinessesByUserIdAction(session.user.id)
    const firstBusiness = listResult.success ? listResult.businesses?.[0] : null
    businessId = firstBusiness?.id?.toString()
  }

  if (!businessId) {
    redirect("/dashboard")
  }

  // Server-prefetch the full business (normalized) for instant render + pass as initialData
  const result = await getBusinessByIdAction(businessId)
  const initialBusiness = result.success ? result.business : null

  if (!initialBusiness) {
    redirect("/dashboard")
  }

  return (
    <div className="flex-1 space-y-4">
      <ProfileContent businessId={businessId} initialBusiness={initialBusiness} />
    </div>
  )
}
