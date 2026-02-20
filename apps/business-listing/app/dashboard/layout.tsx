import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { database, userService } from "@think-id/database"
import { redirect } from "next/navigation"
import { Suspense } from "react"


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  // Use the userService singleton from the database package
  const user = await userService.getUserByEmail(session.user.email)

  if (!user) {
    // If we have a session but no Prisma user, we still need to show the layout
    // but with an empty business list. The page within will handle the "No Business" state.
    return (
      <SidebarProvider>
        <Suspense fallback={<div className="w-64 h-screen bg-gray-100 animate-pulse" />}>
          <AppSidebar businesses={[]} currentBusinessId={""} user={session.user as any} />
        </Suspense>
        <SidebarInset>
          <main className="flex-1 w-full bg-gray-50/50">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Fetch businesses for this user
  const userBusinesses = await database.businesses.getBusinessesByUserId(user.id)

  // Normalize for the switcher
  const businesses = userBusinesses.map((b: any) => ({
    id: b.id,
    name: b.name,
    image: (b as any).coverImage
  }))

  return (
    <SidebarProvider>
      <Suspense fallback={<div className="w-64 h-screen bg-gray-100 animate-pulse" />}>
        <AppSidebar 
           businesses={businesses} 
           currentBusinessId="" 
           user={{
              name: user?.name || "User",
              email: user?.email || "",
              image: user?.image || null
           }} 
        />
      </Suspense>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border mx-2" />
          <div className="font-semibold">Business Dashboard</div>
        </header>
        <div className="flex-1 overflow-auto p-4">
           {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
