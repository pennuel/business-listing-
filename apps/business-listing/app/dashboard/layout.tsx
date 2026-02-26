import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getBusinessesByUserIdAction } from "@/app/actions/business"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  console.log("DashboardLayout session:", session)
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  const userId = session.user.id as string

  // Prefetch businesses on server for faster initial render
  const result = await getBusinessesByUserIdAction(userId)
  const initialBusinesses = result.success ? result.businesses || [] : []

  return (
    <DashboardClient 
      userId={userId}
      initialBusinesses={initialBusinesses}
    >
      {children}
    </DashboardClient>
  )
}
