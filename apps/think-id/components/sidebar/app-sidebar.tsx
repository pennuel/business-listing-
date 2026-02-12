"use client"

import type * as React from "react"
import {
  User,
  Settings,
  Activity,
  BarChart3,
  Bell,
  CreditCard,
  Shield,
  HelpCircle,
  LogOut,
  ChevronUp,
  User2,
  Grid3X3,
  ChevronDown,
  Database,
  Globe,
  Code,
  Smartphone,
  Users,
  Building2,
} from "lucide-react"

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
  useSidebar,
} from "@think-id/ui/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@think-id/ui/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@think-id/ui/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@think-id/ui/components/ui/collapsible"
import { useUserStore } from "@/stores/userStore"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeSection: string
  onSectionChange: (section: string) => void
}

// My Profile Section
const myProfileItems = [
  {
    title: "Dashboard",
    key: "dashboard",
    icon: Activity,
  },
  {
    title: "My Profile",
    key: "profile",
    icon: User,
  },
  {
    title: "Security",
    key: "security",
    icon: Shield,
  },
  {
    title: "Account Settings",
    key: "account",
    icon: Settings,
  },
]

const myBusinessItems = [
  {
    title: "My Businesses",
    key: "businesses",
    icon: Building2,
  },
  {
    title: "Billing",
    key: "billing",
    icon: CreditCard,
  },
]

const helpItems = [
  {
    title: "Help & Support",
    key: "help",
    icon: HelpCircle,
  },
]

export function AppSidebar({ activeSection, onSectionChange, ...props }: AppSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar()

  const handleSectionChange = (section: string) => {
    onSectionChange(section)
    // Close sidebar on mobile when a section is selected
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const {user} = useUserStore();

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <User className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">My THiNK ID Profile</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* My Profile Section */}
        <SidebarGroup>
          <SidebarGroupLabel>My Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {myProfileItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeSection === item.key}
                    onClick={() => handleSectionChange(item.key)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* My Business Section */}
        <SidebarGroup>
          <SidebarGroupLabel>My Business</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {myBusinessItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeSection === item.key}
                    onClick={() => handleSectionChange(item.key)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {helpItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeSection === item.key}
                    onClick={() => handleSectionChange(item.key)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Avatar"
                    />
                    <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                  </Avatar> 
                  <Avatar
                    className="h-8 w-8"
                    style={{ border: "2px solid #e5e7eb" }}
                  >
                    <AvatarImage
                      src="/logos/THiNK_Logo_Updated-02(icon).jpg"
                      alt="Profile"
                    />
                    <AvatarFallback className="text-2xl">
                      {user ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user
                        ? `${user.firstName} ${user.lastName}`
                        : "Loading..."}
                    </span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem
                  onClick={() => handleSectionChange("profile")}
                >
                  <User2 />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSectionChange("account")}
                >
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
