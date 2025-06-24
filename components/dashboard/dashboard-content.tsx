"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Clock, Edit, BarChart3, User } from "lucide-react";
// Add these new imports at the top
import {
  ExternalLink,
  CheckCircle,
  Zap,
  Database,
  Globe,
  Code,
  Smartphone,
  Shield,
  Grid3X3,
  ArrowRight,
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";

// Add this new applications data after the existing imports:
const applicationsData = [
  {
    name: "Analytics Pro",
    icon: BarChart3,
    status: "active",
    users: 2847,
    revenue: "$12,450",
    growth: "+15%",
    description: "Advanced analytics and reporting platform",
    lastActivity: "2 hours ago",
    color: "bg-blue-500",
  },
  {
    name: "Task Manager",
    icon: Database,
    status: "active",
    users: 892,
    revenue: "$5,230",
    growth: "+8%",
    description: "Project and task management system",
    lastActivity: "1 hour ago",
    color: "bg-green-500",
  },
  {
    name: "Website Builder",
    icon: Globe,
    status: "maintenance",
    users: 1234,
    revenue: "$8,900",
    growth: "-2%",
    description: "Drag-and-drop website creation tool",
    lastActivity: "6 hours ago",
    color: "bg-orange-500",
  },
  {
    name: "Code Editor",
    icon: Code,
    status: "active",
    users: 567,
    revenue: "$3,120",
    growth: "+22%",
    description: "Online collaborative code editor",
    lastActivity: "30 minutes ago",
    color: "bg-purple-500",
  },
  {
    name: "Mobile App",
    icon: Smartphone,
    status: "beta",
    users: 234,
    revenue: "$1,890",
    growth: "+45%",
    description: "Cross-platform mobile application",
    lastActivity: "4 hours ago",
    color: "bg-pink-500",
  },
];

interface DashboardContentProps {
  onViewProfile: () => void;
  onApplicationsSelect?: () => void;
}

// Replace the entire return statement with this updated version:
export function DashboardContent({
  onApplicationsSelect,
  onViewProfile,
}: DashboardContentProps) {
  const { user, isLoading } = useUserStore();

  return (
    <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0">
      {/* Profile Header */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-1 md:col-span-2 lg:col-span-2">
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Avatar and Info Side by Side */}
            <div className="flex flex-row md:flex-row items-start md:items-center gap-4 flex-1">
              <Avatar
                className="h-24 w-24"
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
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-3">
                  {user ? user.data.profession.title : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {user ? user.data.role : "User"}
                  </Badge>
                  {/* <Badge variant="outline">5 Applications</Badge> */}
                </div>
              </div>
            </div>
            {/* Edit Button aligned to the right */}
            <div className="flex md:flex-col justify-end w-full md:w-auto sm:justify-center">
              <Button
                size="sm"
                className="w-fit"
                onClick={() => onViewProfile()}
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verification Status
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {user?.verified ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="h-4 w-4 text-orange-500" />
                )}
                {/* <CheckCircle className="h-4 w-4 text-green-500" /> */}
                <span className="text-sm font-medium">User Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">
                  THiNK Pending
                </span>
              </div>
              {/* 
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">
                  Business Pending
                </span>
              </div> */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Applications
            </CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Apps</div>
            <p className="text-xs text-muted-foreground">
              3 Active, 1 Maintenance, 1 Beta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications Overview - Category Based */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">My Applications</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onApplicationsSelect?.()}
            className="w-fit"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>

        {/* Application Categories */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {/* Analytics & Data Category */}
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onApplicationsSelect?.()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-500 text-white">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Analytics & Data</CardTitle>
                    <CardDescription>1 application</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  <div className="p-1.5 rounded-lg bg-blue-500 text-white border-2 border-background">
                    <BarChart3 className="h-3 w-3" />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  Analytics Pro
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Usage</p>
                  <p className="font-semibold">45h this month</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Productivity Category */}
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onApplicationsSelect?.()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-500 text-white">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Productivity</CardTitle>
                    <CardDescription>1 application</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  <div className="p-1.5 rounded-lg bg-green-500 text-white border-2 border-background">
                    <Database className="h-3 w-3" />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  Task Manager
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Usage</p>
                  <p className="font-semibold">32h this month</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Category */}
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onApplicationsSelect?.()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-500 text-white">
                    <Code className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Development</CardTitle>
                    <CardDescription>3 applications</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  <div className="p-1.5 rounded-lg bg-orange-500 text-white border-2 border-background">
                    <Globe className="h-3 w-3" />
                  </div>
                  <div className="p-1.5 rounded-lg bg-purple-500 text-white border-2 border-background">
                    <Code className="h-3 w-3" />
                  </div>
                  <div className="p-1.5 rounded-lg bg-pink-500 text-white border-2 border-background">
                    <Smartphone className="h-3 w-3" />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">3 apps</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Usage</p>
                  <p className="font-semibold">113h this month</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant="secondary" className="text-xs">
                    Mixed
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Activity & Quick Stats */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        {/* Recent Application Activity */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Application Activity</CardTitle>
            <CardDescription>
              Latest updates across your applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  Analytics Pro - New dashboard created
                </p>
                <p className="text-xs text-muted-foreground">
                  2 hours ago • 45 new users today
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500 text-white">
                <Database className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  Task Manager - 127 tasks completed
                </p>
                <p className="text-xs text-muted-foreground">
                  1 hour ago • 23 active projects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500 text-white">
                <Code className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  Code Editor - 15 files deployed
                </p>
                <p className="text-xs text-muted-foreground">
                  30 minutes ago • 8 collaborators online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500 text-white">
                <Globe className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  Website Builder - Maintenance completed
                </p>
                <p className="text-xs text-muted-foreground">
                  6 hours ago • All systems operational
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Status Overview */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>
              Current status of all your applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {applicationsData.map((app) => (
                <div
                  key={app.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <app.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">{app.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      variant={
                        app.status === "active"
                          ? "default"
                          : app.status === "maintenance"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {app.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Performance Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Applications
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Out of 5 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245ms</div>
            <p className="text-xs text-muted-foreground">
              -12ms from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total API Calls
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground">+18% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
