import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  console.log("DashboardLayout session:", session)
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  // Pass to client component - user data is already synced on login via auth callback
  return (
    <DashboardClient userId={session.user.id as string} >
      {children}
    </DashboardClient>
  )
}
