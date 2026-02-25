import { auth } from "@/lib/auth"
import { businessRepository } from "@think-id/database"
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
  const selectedBusinessId = params.businessId
  
  let business;
  if (selectedBusinessId) {
    business = await businessRepository.findById(selectedBusinessId)
  } else {
    const businesses = await businessRepository.findByUserId(session.user.id)
    business = businesses?.[0];
  }

  if (!business) {
    redirect("/dashboard")
  }

  return (
    <div className="flex-1 space-y-4">
      <ProfileContent business={business} />
    </div>
  )
}
