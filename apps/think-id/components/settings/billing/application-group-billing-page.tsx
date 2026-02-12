"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@think-id/ui/components/ui/card"
import { Badge } from "@think-id/ui/components/ui/badge"
import { Button } from "@think-id/ui/components/ui/button"
import { ArrowLeft, ArrowRight, BarChart3, Database, Globe, Code, Smartphone } from "lucide-react"

const applicationGroupsData = {
  "Analytics & Data": [
    {
      name: "Analytics Pro",
      icon: BarChart3,
      color: "bg-blue-500",
      plan: "Professional",
      monthlyFee: "$12.99",
      status: "active",
      key: "analytics-pro",
      description: "Advanced analytics and reporting platform",
      nextBilling: "Mar 15, 2024",
    },
  ],
  Productivity: [
    {
      name: "Task Manager Pro",
      icon: Database,
      color: "bg-green-500",
      plan: "Team",
      monthlyFee: "$8.99",
      status: "active",
      key: "task-manager",
      description: "Project and task management system",
      nextBilling: "Mar 15, 2024",
    },
  ],
  Development: [
    {
      name: "Website Builder",
      icon: Globe,
      color: "bg-orange-500",
      plan: "Creator",
      monthlyFee: "$15.99",
      status: "active",
      key: "website-builder",
      description: "Drag-and-drop website creation tool",
      nextBilling: "Mar 15, 2024",
    },
    {
      name: "Code Editor Plus",
      icon: Code,
      color: "bg-purple-500",
      plan: "Developer",
      monthlyFee: "$9.99",
      status: "active",
      key: "code-editor",
      description: "Online collaborative code editor",
      nextBilling: "Mar 15, 2024",
    },
    {
      name: "Mobile App Studio",
      icon: Smartphone,
      color: "bg-pink-500",
      plan: "Starter",
      monthlyFee: "$6.99",
      status: "trial",
      key: "mobile-app",
      description: "Cross-platform mobile application builder",
      nextBilling: "Trial ends Mar 8, 2024",
    },
  ],
}

interface ApplicationGroupBillingPageProps {
  category: string
  onBack: () => void
  onApplicationSelect: (appKey: string) => void
}

export function ApplicationGroupBillingPage({
  category,
  onBack,
  onApplicationSelect,
}: ApplicationGroupBillingPageProps) {
  const applications = applicationGroupsData[category as keyof typeof applicationGroupsData] || []
  const totalMonthly = applications
    .filter((app) => app.status === "active")
    .reduce((sum, app) => sum + Number.parseFloat(app.monthlyFee.replace("$", "")), 0)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Back Navigation */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Billing
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{category}</h1>
          <p className="text-muted-foreground">
            {applications.length} application{applications.length > 1 ? "s" : ""} • ${totalMonthly.toFixed(2)}/month
            total
          </p>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => {
          const Icon = app.icon

          return (
            <Card
              key={app.key}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onApplicationSelect(app.key)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${app.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{app.name}</CardTitle>
                      <CardDescription>{app.description}</CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Plan</p>
                      <p className="font-medium">{app.plan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Billing</p>
                      <p className="font-medium">{app.nextBilling}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={app.status === "active" ? "default" : "secondary"}>
                      {app.status === "trial" ? "Free Trial" : "Active"}
                    </Badge>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{app.monthlyFee}</p>
                      <p className="text-sm text-muted-foreground">/month</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
