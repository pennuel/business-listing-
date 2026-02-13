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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      image: true,
      businesses: {
        select: {
          id: true,
          name: true,
          // We need an image/logo for the business. 
          // Previous schema check showed 'image' on User but 'coverImage' on Business?
          // Let's check schema again. Business has 'tags', 'coverImage'?
          // Wait, the Business model I updated has 'coverImage'.
          // Does it have a logo? I don't recall adding a 'logo' field.
          // I will use coverImage for now or just name.
          coverImage: true, 
        }
      }
    }
  })

  // Normalize for the switcher
  const businesses = user?.businesses.map(b => ({
    id: b.id,
    name: b.name,
    image: b.coverImage // Using coverImage as the icon for now
  })) || []

  // Default to first business if available, but passing "" as current is fine 
  // because the switcher handles defaults or page handles it.
  // Actually sidebar needs to know which one is selected to show checkmark.
  // We can't access searchParams in Layout easily in Next.js 13 (it's tricky in layouts).
  // But purely for the switcher visual, we can default to the first one 
  // or let the switcher client component handle the "read from URL" logic.
  // The switcher I wrote:
  // const searchParams = useSearchParams()
  // const selectedBusiness = businesses.find((b) => b.id === currentBusinessId) || businesses[0]
  // So if I pass "" as currentBusinessId, it defaults to first.
  // Ideally, I should pass the true ID if I can.
  // But Layouts don't receive searchParams. 
  // So I'll pass "" and let the client component read the URL.

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
