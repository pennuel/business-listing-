"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Tag,
  Building2,
  Star,
  AlertTriangle,
  Layers,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Settings,
  ShieldCheck,
  MapPin,
  Globe,
} from "lucide-react"

const NAV_MANAGEMENT = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/business-types", label: "Business Types", icon: Layers },
  { href: "/admin/businesses", label: "Businesses", icon: Building2 },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/complaints", label: "Complaints", icon: AlertTriangle },
]

const NAV_TAXONOMY = [
  { href: "/admin/sectors", label: "Sectors", icon: Layers },
  { href: "/admin/industries", label: "Industries", icon: Building2 },
  { href: "/admin/offerings", label: "Offerings", icon: Tag },
]

const NAV_LOCATION = [
  { href: "/admin/countries", label: "Countries", icon: Globe },
  { href: "/admin/counties", label: "Counties", icon: MapPin },
  { href: "/admin/sub-counties", label: "Sub-Counties", icon: MapPin },
]


function NavItem({ href, label, icon: Icon, exact }: (typeof NAV_MANAGEMENT)[0]) {
  const pathname = usePathname()
  const active = exact ? pathname === href : pathname.startsWith(href) && pathname !== "/admin"
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-gray-700"}`} />
      {label}
      {active && <ChevronRight className="h-3 w-3 ml-auto" />}
    </Link>
  )
}

const Sidebar = ({ onClose }: { onClose?: () => void }) => (
  <div className="flex flex-col h-full">
    {/* Brand */}
    <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
          <ShieldCheck className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900">Think Admin</div>
          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Control Panel</div>
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      )}
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">Management</div>
      {NAV_MANAGEMENT.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mt-4 mb-2">Taxonomy</div>
      {NAV_TAXONOMY.map((item) => (
        <NavItem key={item.href} {...item} exact={false} />
      ))}
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mt-4 mb-2">Location</div>
      {NAV_LOCATION.map((item) => (
        <NavItem key={item.href} {...item} exact={false} />
      ))}
    </nav>

    {/* Footer */}
    <div className="px-3 py-4 border-t border-gray-100 space-y-1">
      <Link
        href="/"
        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <ExternalLink className="h-4 w-4" />
        View Public Site
      </Link>
      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <Settings className="h-4 w-4" />
        Business Dashboard
      </Link>
    </div>
  </div>
)

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Build breadcrumb
  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: seg.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
      href: "/" + arr.slice(0, i + 1).join("/"),
    }))

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white shadow-sm">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 w-64 bg-white h-full shadow-2xl flex flex-col">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm overflow-hidden">
            {crumbs.map((c, i) => (
              <span key={c.href} className="flex items-center gap-1.5 shrink-0">
                {i > 0 && <ChevronRight className="h-3 w-3 text-gray-300" />}
                <Link
                  href={c.href}
                  className={`${i === crumbs.length - 1 ? "font-semibold text-gray-900" : "text-gray-400 hover:text-gray-700"} capitalize`}
                >
                  {c.label}
                </Link>
              </span>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:block">
              Admin Panel
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
