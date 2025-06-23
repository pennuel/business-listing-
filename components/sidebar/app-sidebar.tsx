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
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeSection: string
  onSectionChange: (section: string) => void
}

// Navigation items
const navItems = [
  {
    title: "Dashboard",
    key: "dashboard",
    icon: BarChart3,
  },
  {
    title: "Profile",
    key: "profile",
    icon: User,
  },
  {
    title: "Applications",
    key: "applications",
    icon: Grid3X3,
  },
  {
    title: "Activity",
    key: "activity",
    icon: Activity,
  },
  {
    title: "Notifications",
    key: "notifications",
    icon: Bell,
  },
]

// User's applications with their personal data
const userApplications = [
  {
    title: "Analytics Pro",
    key: "app-analytics-pro",
    icon: BarChart3,
    status: "active",
    userStats: {
      reportsCreated: 127,
      dataProcessed: "2.3TB",
      lastLogin: "2 hours ago",
    },
  },
  {
    title: "Task Manager",
    key: "app-task-manager",
    icon: Database,
    status: "active",
    userStats: {
      tasksCompleted: 892,
      projectsManaged: 23,
      lastLogin: "1 hour ago",
    },
  },
  {
    title: "Website Builder",
    key: "app-website-builder",
    icon: Globe,
    status: "maintenance",
    userStats: {
      sitesBuilt: 12,
      pagesCreated: 89,
      lastLogin: "6 hours ago",
    },
  },
  {
    title: "Code Editor",
    key: "app-code-editor",
    icon: Code,
    status: "active",
    userStats: {
      linesWritten: "125K",
      filesEdited: 234,
      lastLogin: "30 minutes ago",
    },
  },
  {
    title: "Mobile App",
    key: "app-mobile-app",
    icon: Smartphone,
    status: "beta",
    userStats: {
      appsBuilt: 5,
      deploymentsCount: 18,
      lastLogin: "4 hours ago",
    },
  },
]

const settingsItems = [
  {
    title: "Account Settings",
    key: "account",
    icon: Settings,
  },
  {
    title: "Security",
    key: "security",
    icon: Shield,
  },
  {
    title: "Billing",
    key: "billing",
    icon: CreditCard,
  },
  {
    title: "Help & Support",
    key: "help",
    icon: HelpCircle,
  },
]

export function AppSidebar({ activeSection, onSectionChange, ...props }: AppSidebarProps) {
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
                  <span className="truncate font-semibold">My Profile</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeSection === item.key}
                    onClick={() => onSectionChange(item.key)}
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

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                My Applications
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userApplications.map((app) => (
                    <SidebarMenuItem key={app.key}>
                      <SidebarMenuButton
                        isActive={activeSection === app.key}
                        onClick={() => onSectionChange(app.key)}
                        tooltip={app.title}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <app.icon className="h-4 w-4" />
                            <span>{app.title}</span>
                          </div>
                          <div
                            className={`h-2 w-2 rounded-full ${
                              app.status === "active"
                                ? "bg-green-500"
                                : app.status === "maintenance"
                                  ? "bg-orange-500"
                                  : "bg-blue-500"
                            }`}
                          />
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeSection === item.key}
                    onClick={() => onSectionChange(item.key)}
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
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                    <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">John Doe</span>
                    <span className="truncate text-xs">john@example.com</span>
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
                <DropdownMenuItem onClick={() => onSectionChange("profile")}>
                  <User2 />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSectionChange("account")}>
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
  )
}
