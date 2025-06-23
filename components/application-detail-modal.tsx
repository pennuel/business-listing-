import type React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ExternalLink,
  Star,
  Clock,
  Users,
  Activity,
  Settings,
  Download,
  Share,
  Heart,
  TrendingUp,
  Zap,
  Shield,
} from "lucide-react"

interface ApplicationDetailModalProps {
  application: {
    name: string
    icon: React.ComponentType<{ className?: string }>
    description: string
    category: string
    version: string
    lastUsed: string
    usageTime: string
    features: string[]
    rating: number
    color: string
    facts: Record<string, string | number>
  } | null
  isOpen: boolean
  onClose: () => void
}

export function ApplicationDetailModal({ application, isOpen, onClose }: ApplicationDetailModalProps) {
  if (!application) return null

  const Icon = application.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${application.color} text-white`}>
              <Icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{application.name}</DialogTitle>
              <DialogDescription className="text-base mt-1">{application.description}</DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{application.category}</Badge>
                <Badge variant="secondary">{application.version}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{application.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open App
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage Stats</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Used</p>
                      <p className="font-semibold">{application.lastUsed}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Usage Time</p>
                      <p className="font-semibold">{application.usageTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Your Rating</p>
                      <p className="font-semibold">{application.rating}/5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold">Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Facts */}
            <Card>
              <CardHeader>
                <CardTitle>Application Statistics</CardTitle>
                <CardDescription>Key metrics and facts about your usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(application.facts).map(([key, value]) => (
                    <div key={key} className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-primary">{value}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions with this application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-lg ${application.color} text-white`}>
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Completed daily tasks</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-lg ${application.color} text-white`}>
                    <Settings className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Updated preferences</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-lg ${application.color} text-white`}>
                    <Download className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Exported data</p>
                    <p className="text-sm text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            {/* Usage Overview */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Usage</CardTitle>
                  <CardDescription>Your usage pattern this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily Average</span>
                      <span>2.3 hours</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly Goal</span>
                      <span>85% Complete</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Target</span>
                      <span>67% Complete</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>How efficiently you're using the app</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Productivity Score</span>
                    </div>
                    <span className="font-semibold">92/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Efficiency Rating</span>
                    </div>
                    <span className="font-semibold">4.8/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Collaboration Score</span>
                    </div>
                    <span className="font-semibold">87/100</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Timeline</CardTitle>
                <CardDescription>Your activity over the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                    <div key={day} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-8">{day}</span>
                      <div className="flex-1">
                        <Progress value={Math.random() * 100} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground w-12">{(Math.random() * 5 + 1).toFixed(1)}h</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Features</CardTitle>
                <CardDescription>All features available in this application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {application.features.map((feature, index) => (
                    <div key={feature} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`p-2 rounded-lg ${application.color} text-white`}>
                        <Shield className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{feature}</p>
                        <p className="text-sm text-muted-foreground">
                          {index % 2 === 0 ? "Actively used" : "Available"}
                        </p>
                      </div>
                      <Badge variant={index % 2 === 0 ? "default" : "secondary"}>
                        {index % 2 === 0 ? "Active" : "Available"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Manage your preferences for this application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates from this app</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Data Sync</p>
                    <p className="text-sm text-muted-foreground">Sync data across devices</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Privacy Settings</p>
                    <p className="text-sm text-muted-foreground">Control data sharing</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-muted-foreground">Download your data</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common actions for this application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Favorites
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share className="h-4 w-4 mr-2" />
                  Share Application
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download for Mobile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
