import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"

export const metadata = { title: "Admin — Think Business" }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Uncomment to enable admin auth guard:
  // const session = await auth()
  // if (!session?.user?.id) redirect("/login")

  return <AdminShell>{children}</AdminShell>
}
