"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Database,
  Globe,
  Code,
  Smartphone,
  ExternalLink,
  Clock,
  Activity,
  Star,
  Calendar,
  Zap,
  ArrowLeft,
} from "lucide-react"
import { useEffect, useRef } from "react"



interface ApplicationsPageProps {
  onApplicationSelect: (appKey: string) => void
  onBack: () => void
  selectedCategory?: string
}

export function ApplicationsPage({ onApplicationSelect, onBack, selectedCategory }: ApplicationsPageProps) {
  const analyticsRef = useRef<HTMLDivElement>(null)
  const productivityRef = useRef<HTMLDivElement>(null)
  const developmentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedCategory) {
      const refs = {
        analytics: analyticsRef,
        productivity: productivityRef,
        development: developmentRef,
      }
      const targetRef = refs[selectedCategory as keyof typeof refs]
      if (targetRef?.current) {
        targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }, [selectedCategory])

  return (
    <div className="flex flex-1 flex-col gap-6 p-2 sm:p-4 pt-0">
      {/* Back Navigation - Top Level */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">Your personal data and activity across all applications</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <ExternalLink className="h-4 w-4 mr-2" />
          Browse More Apps
        </Button>
      </div>

      {/* Usage Overview */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold">190h</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Apps</p>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">All platforms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Data Created</p>
                <p className="text-2xl font-bold">2.8TB</p>
                <p className="text-xs text-muted-foreground">Across all apps</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Last Active</p>
                <p className="text-2xl font-bold">30m</p>
                <p className="text-xs text-muted-foreground">Code Editor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications by Category with Active States */}
      <div className="space-y-6">
        {/* Analytics & Data Category */}
        <div className="space-y-4" ref={analyticsRef}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500 text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Analytics & Data</h2>
                <p className="text-muted-foreground">1 active application • 45 hours this month</p>
              </div>
            </div>
          </div>

          {/* Available Apps in Category */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Active App */}
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200"
              onClick={() => onApplicationSelect("app-analytics-pro")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500 text-white">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Analytics Pro</h3>
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="font-medium">45h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Used</span>
                    <span className="font-medium">2h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inactive/Available Apps */}
            <Card className="opacity-50 hover:opacity-75 transition-opacity cursor-pointer border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gray-300 text-gray-500">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-muted-foreground">Data Insights</h3>
                    <Badge variant="outline" className="text-xs">
                      Available
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground text-xs">Advanced data visualization and insights platform</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Activate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="opacity-50 hover:opacity-75 transition-opacity cursor-pointer border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gray-300 text-gray-500">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-muted-foreground">Report Builder</h3>
                    <Badge variant="outline" className="text-xs">
                      Available
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground text-xs">Automated report generation and scheduling</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Activate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Productivity Category */}
        <div className="space-y-4" ref={productivityRef}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500 text-white">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Productivity</h2>
                <p className="text-muted-foreground">1 active application • 32 hours this month</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Active App */}
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer border-green-200"
              onClick={() => onApplicationSelect("app-task-manager")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-500 text-white">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Task Manager Pro</h3>
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="font-medium">32h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Used</span>
                    <span className="font-medium">1h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Apps */}
            <Card className="opacity-50 hover:opacity-75 transition-opacity cursor-pointer border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gray-300 text-gray-500">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-muted-foreground">Calendar Pro</h3>
                    <Badge variant="outline" className="text-xs">
                      Available
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground text-xs">Advanced calendar and scheduling management</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Activate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="opacity-50 hover:opacity-75 transition-opacity cursor-pointer border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gray-300 text-gray-500">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-muted-foreground">Time Tracker</h3>
                    <Badge variant="outline" className="text-xs">
                      Available
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground text-xs">Detailed time tracking and productivity insights</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Activate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Development Category */}
        <div className="space-y-4" ref={developmentRef}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500 text-white">
                <Code className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Development</h2>
                <p className="text-muted-foreground">3 active applications • 113 hours this month</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Active Apps */}
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200"
              onClick={() => onApplicationSelect("app-website-builder")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-orange-500 text-white">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Website Builder</h3>
                    <Badge variant="destructive" className="text-xs">
                      Maintenance
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="font-medium">18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Used</span>
                    <span className="font-medium">6h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200"
              onClick={() => onApplicationSelect("app-code-editor")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500 text-white">
                    <Code className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Code Editor Plus</h3>
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="font-medium">67h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Used</span>
                    <span className="font-medium">30m ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer border-pink-200"
              onClick={() => onApplicationSelect("app-mobile-app")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-pink-500 text-white">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Mobile App Studio</h3>
                    <Badge variant="secondary" className="text-xs">
                      Beta
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="font-medium">28h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Used</span>
                    <span className="font-medium">4h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available App */}
            <Card className="opacity-50 hover:opacity-75 transition-opacity cursor-pointer border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gray-300 text-gray-500">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-muted-foreground">API Manager</h3>
                    <Badge variant="outline" className="text-xs">
                      Available
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground text-xs">API development and testing platform</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Activate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common actions across your applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            <Button variant="outline" className="justify-start">
              <Activity className="h-4 w-4 mr-2" />
              View Usage Report
            </Button>
            <Button variant="outline" className="justify-start">
              <Star className="h-4 w-4 mr-2" />
              Backup Settings
            </Button>
            <Button variant="outline" className="justify-start">
              <Clock className="h-4 w-4 mr-2" />
              Activity Timeline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
