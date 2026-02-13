import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await (prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      id: true,
      image: true,
      businesses: {
        select: {
          id: true,
          name: true,
          coverImage: true, 
        }
      }
    }
  }) as any)

  if (!user) {
    // If we have a session but no Prisma user, we still need to show the layout
    // but with an empty business list. The page within will handle the "No Business" state.
    const emptyUser = { name: session.user.name, email: session.user.email, id: "", businesses: [] }
    return (
      <SidebarProvider>
        <AppSidebar businesses={[]} currentBusinessId={""} user={session.user as any} />
        <SidebarInset>
          <main className="flex-1 w-full bg-gray-50/50">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Normalize for the switcher
  const businesses = user.businesses.map((b: any) => ({
    id: b.id,
    name: b.name,
    image: b.coverImage
  }))

  return (
    <SidebarProvider>
      <AppSidebar 
         businesses={businesses} 
         currentBusinessId="" 
         user={{
            name: user?.name || "User",
            email: user?.email || "",
            image: user?.image || null
         }} 
      />
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
