"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  ExternalLink,
  Download,
  Share,
  Settings,
  Activity,
  BarChart3,
  Calendar,
  FileText,
  Zap,
  TrendingUp,
  Database,
  Globe,
  Code,
  Smartphone,
} from "lucide-react"

const applicationDetails = {
  "app-analytics-pro": {
    name: "Analytics Pro",
    icon: BarChart3,
    description: "Your personal analytics dashboard and reporting data",
    color: "bg-blue-500",
    userData: {
      accountCreated: "January 2023",
      totalReports: 127,
      dataProcessed: "2.3TB",
      dashboardsBuilt: 15,
      queriesRun: 1847,
      favoriteCharts: ["Bar Chart", "Line Graph", "Pie Chart"],
      recentReports: [
        { name: "Q4 Sales Report", created: "2 days ago", views: 45 },
        { name: "User Engagement Analysis", created: "1 week ago", views: 23 },
        { name: "Revenue Breakdown", created: "2 weeks ago", views: 67 },
      ],
      savedQueries: 34,
      sharedDashboards: 8,
    },
  },
  "app-task-manager": {
    name: "Task Manager Pro",
    icon: Database,
    description: "Your personal task management and project data",
    color: "bg-green-500",
    userData: {
      accountCreated: "March 2023",
      tasksCompleted: 892,
      projectsManaged: 23,
      teamMembersAdded: 45,
      milestonesReached: 67,
      favoriteProjects: ["Website Redesign", "Mobile App", "API Integration"],
      recentTasks: [
        { name: "Update user interface", completed: "Today", project: "Website Redesign" },
        { name: "Fix authentication bug", completed: "Yesterday", project: "Mobile App" },
        { name: "Write API documentation", completed: "2 days ago", project: "API Integration" },
      ],
      averageTaskTime: "2.5 hours",
      productivityScore: 94,
    },
  },
  "app-website-builder": {
    name: "Website Builder",
    icon: Globe,
    description: "Your websites, templates, and design assets",
    color: "bg-orange-500",
    userData: {
      accountCreated: "June 2023",
      sitesBuilt: 12,
      pagesCreated: 89,
      templatesUsed: 8,
      customComponents: 34,
      favoriteTemplates: ["Modern Portfolio", "Business Landing", "Blog Theme"],
      recentSites: [
        { name: "Personal Portfolio", published: "1 week ago", visits: 234 },
        { name: "Client Website", published: "2 weeks ago", visits: 456 },
        { name: "Photography Blog", published: "1 month ago", visits: 123 },
      ],
      totalVisits: "45.2K",
      averageLoadTime: "1.2s",
    },
  },
  "app-code-editor": {
    name: "Code Editor Plus",
    icon: Code,
    description: "Your coding projects, files, and development data",
    color: "bg-purple-500",
    userData: {
      accountCreated: "February 2023",
      linesWritten: "125K",
      filesEdited: 234,
      repositoriesConnected: 12,
      collaborations: 56,
      favoriteLanguages: ["TypeScript", "Python", "JavaScript"],
      recentFiles: [
        { name: "components/Dashboard.tsx", edited: "30 minutes ago", lines: 127 },
        { name: "utils/helpers.py", edited: "2 hours ago", lines: 89 },
        { name: "api/routes.js", edited: "1 day ago", lines: 156 },
      ],
      codeReviews: 23,
      commitsThisMonth: 87,
    },
  },
  "app-mobile-app": {
    name: "Mobile App Studio",
    icon: Smartphone,
    description: "Your mobile app projects and deployment history",
    color: "bg-pink-500",
    userData: {
      accountCreated: "August 2023",
      appsBuilt: 5,
      deploymentsCount: 18,
      downloadsGenerated: "12.5K",
      platformsTargeted: 3,
      favoriteFrameworks: ["React Native", "Flutter", "Ionic"],
      recentApps: [
        { name: "Fitness Tracker", deployed: "1 week ago", downloads: 2340 },
        { name: "Recipe Manager", deployed: "2 weeks ago", downloads: 1890 },
        { name: "Budget Planner", deployed: "1 month ago", downloads: 3450 },
      ],
      averageRating: 4.6,
      totalReviews: 234,
    },
  },
}

interface ApplicationDetailPageProps {
  appKey: string
  onBack: () => void
}

export function ApplicationDetailPage({ appKey, onBack }: ApplicationDetailPageProps) {
  const app = applicationDetails[appKey as keyof typeof applicationDetails]

  if (!app) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </div>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold">Application not found</h2>
          <p className="text-muted-foreground">The requested application could not be found.</p>
        </div>
      </div>
    )
  }

  const Icon = app.icon

  return (
    <div className="flex flex-1 flex-col gap-6 p-2 sm:p-4 pt-0">
      {/* Back Navigation - Top Level */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </div>

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className={`p-3 rounded-lg ${app.color} text-white`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">{app.name}</h1>
          <p className="text-muted-foreground">{app.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open App
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-semibold">{app.userData.accountCreated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Activity</p>
                <p className="font-semibold">Very High</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Growth</p>
                <p className="font-semibold">+23% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="flex-1">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* User Statistics */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Statistics</CardTitle>
                <CardDescription>Your personal usage and creation metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(app.userData)
                    .filter(
                      ([key]) =>
                        ![
                          "accountCreated",
                          "favoriteCharts",
                          "favoriteProjects",
                          "favoriteTemplates",
                          "favoriteLanguages",
                          "favoriteFrameworks",
                          "recentReports",
                          "recentTasks",
                          "recentSites",
                          "recentFiles",
                          "recentApps",
                        ].includes(key),
                    )
                    .slice(0, 6)
                    .map(([key, value]) => (
                      <div key={key} className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-primary">{value}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Patterns</CardTitle>
                <CardDescription>Your activity patterns over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily Usage</span>
                    <span>2.3 hours avg</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Weekly Activity</span>
                    <span>85% consistent</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Growth</span>
                    <span>+23% increase</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Favorites */}
          <Card>
            <CardHeader>
              <CardTitle>Your Favorites</CardTitle>
              <CardDescription>Most used features and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(
                  app.userData.favoriteCharts ||
                  app.userData.favoriteProjects ||
                  app.userData.favoriteTemplates ||
                  app.userData.favoriteLanguages ||
                  app.userData.favoriteFrameworks ||
                  []
                ).map((item: string) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Content</CardTitle>
              <CardDescription>Recent items you've created or worked on</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(
                  app.userData.recentReports ||
                  app.userData.recentTasks ||
                  app.userData.recentSites ||
                  app.userData.recentFiles ||
                  app.userData.recentApps ||
                  []
                ).map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.created || item.completed || item.published || item.edited || item.deployed}
                          {item.project && ` • ${item.project}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {item.views && <p className="text-sm font-medium">{item.views} views</p>}
                      {item.visits && <p className="text-sm font-medium">{item.visits} visits</p>}
                      {item.lines && <p className="text-sm font-medium">{item.lines} lines</p>}
                      {item.downloads && <p className="text-sm font-medium">{item.downloads} downloads</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-lg ${app.color} text-white`}>
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Logged in to {app.name}</p>
                    <p className="text-sm text-muted-foreground">30 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-lg ${app.color} text-white`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Created new content</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-lg ${app.color} text-white`}>
                    <Settings className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Updated preferences</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Manage your preferences and data for this application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Data Export</p>
                  <p className="text-sm text-muted-foreground">Download all your data from this application</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-muted-foreground">Manage notification preferences</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Privacy Settings</p>
                  <p className="text-sm text-muted-foreground">Control data sharing and visibility</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
