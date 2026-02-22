import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { businessRepository } from "@think-id/database"
import { redirect } from "next/navigation"
import { StoreHydrator } from "@/lib/redux/store-hydrator"
import { ProfileContent } from "@/components/dashboard/profile-content"

export default async function ProfilePage({ 
    searchParams 
}: { 
    searchParams: { businessId?: string } 
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const selectedBusinessId = searchParams.businessId
  
  let business;
  if (selectedBusinessId) {
    business = await businessRepository.findById(selectedBusinessId)
  } else {
    const businesses = await businessRepository.findByUserId(session.user.id)
    business = businesses[0];
  }

  if (!business) {
    redirect("/dashboard")
  }

  return (
    <div className="flex-1 space-y-4">
      <StoreHydrator business={business as any} />
      <ProfileContent />
    </div>
  )
}
