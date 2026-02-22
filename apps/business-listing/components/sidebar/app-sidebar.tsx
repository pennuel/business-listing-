"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Store,
  Package,
  MessageSquare,
  ShieldCheck,
  Settings, 
  LogOut,
  ChevronUp,
  User2
} from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BusinessSwitcher } from "@/components/dashboard/business-switcher"
import { useAppSelector } from "@/lib/redux/hooks"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  businesses?: {
    id: string
    name: string
    image: string | null
  }[]
  currentBusinessId?: string
  user?: {
    name: string
    email: string
    image: string | null
  }
}

const navItems = [
  {
    title: "Foot Traffic",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Analytics"
  },
  {
    title: "Public Profile",
    url: "/dashboard/profile",
    icon: Store,
    description: "Manage Profile"
  },
  {
    title: "The Shelves",
    url: "/dashboard/services",
    icon: Package,
    description: "Service Menu"
  },
//   {
//     title: "Suggestion Box",
//     url: "/dashboard/reviews",
//     icon: MessageSquare,
//     description: "Reviews & Reputation"
//   },
//   {
//     title: "The Lease",
//     url: "/dashboard/settings",
//     icon: ShieldCheck,
//     description: "Verification & Settings"
//   },
]

export function AppSidebar({ businesses: propsBusinesses, currentBusinessId: propsBusinessId, user: propsUser, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const reduxUser = useAppSelector(state => state.user)
  const reduxBusinesses = useAppSelector(state => state.business.userBusinesses)
  const reduxCurrentBusinessId = useAppSelector(state => state.business.currentBusiness?.id)

  const user = propsUser || {
    name: reduxUser?.name || "User",
    email: reduxUser?.email || "",
    image: reduxUser?.image || null
  }

  const businesses = propsBusinesses || reduxBusinesses.map(b => ({
    id: b.id,
    name: b.name,
    image: (b as any).coverImage || null
  }))
  
  // Use prop if provided, otherwise try search params, otherwise fallback to first business
  const businessId = propsBusinessId || searchParams.get("businessId") || reduxCurrentBusinessId || (businesses.length > 0 ? businesses[0].id : "")

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <BusinessSwitcher 
              businesses={businesses} 
              currentBusinessId={businessId} 
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const url = `${item.url}?businessId=${businessId}`
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                      <Link href={url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <a href={process.env.NEXT_PUBLIC_THINK_ID_URL || "http://localhost:3000"}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Back to THiNK ID
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={`${process.env.NEXT_PUBLIC_THINK_ID_URL || "http://localhost:3000"}/?section=account`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
