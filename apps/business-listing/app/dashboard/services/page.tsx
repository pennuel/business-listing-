import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { database } from "@think-id/database"
import { redirect } from "next/navigation"
import { ServicesList } from "@/components/dashboard/services-list"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function ServicesPage({ searchParams }: { searchParams: { businessId?: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  // Use the package-based user service
  const user = await database.users.getUserByEmail(session.user.email)

  if (!user) {
    redirect("/login")
  }

  // Use the package-based business service
  const businesses = await database.businesses.getBusinessesByUserId(user.id)

  // Select business based on URL or default to first
  const selectedBusinessId = searchParams.businessId
  const business = selectedBusinessId 
    ? businesses.find((b: any) => b.id === selectedBusinessId) 
    : businesses[0] as any

  if (!business) {
    redirect("/dashboard")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" asChild className="gap-1 -ml-2">
          <Link href={`/dashboard?businessId=${business.id}`}>
            <ChevronLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>

      <ServicesList businessId={business.id} services={business.services} />
    </div>
  )
}
