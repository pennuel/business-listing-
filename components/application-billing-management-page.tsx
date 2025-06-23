"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, Download, AlertTriangle, CheckCircle, BarChart3, Database } from "lucide-react"

const applicationData = {
  "analytics-pro": {
    name: "Analytics Pro",
    icon: BarChart3,
    color: "bg-blue-500",
    plan: "Professional",
    monthlyFee: "$12.99",
    status: "active",
    description: "Advanced analytics and reporting platform",
    usage: {
      current: 7500,
      limit: 10000,
      unit: "API calls",
    },
    billingCycle: "Monthly",
    nextBilling: "Mar 15, 2024",
    lastBilled: "Feb 15, 2024",
    features: ["Advanced Analytics", "Custom Reports", "API Access", "Priority Support"],
  },
  "task-manager": {
    name: "Task Manager Pro",
    icon: Database,
    color: "bg-green-500",
    plan: "Team",
    monthlyFee: "$8.99",
    status: "active",
    description: "Project and task management system",
    usage: {
      current: 23,
      limit: 25,
      unit: "team members",
    },
    billingCycle: "Monthly",
    nextBilling: "Mar 15, 2024",
    lastBilled: "Feb 15, 2024",
    features: ["Unlimited Projects", "Team Collaboration", "Priority Support", "Advanced Reporting"],
  },
  // Add other applications...
}

const paymentMethods = [
  {
    id: "1",
    type: "Visa",
    last4: "4242",
    expiry: "12/26",
    isDefault: true,
  },
  {
    id: "2",
    type: "Mastercard",
    last4: "8888",
    expiry: "08/25",
    isDefault: false,
  },
]

interface ApplicationBillingManagementPageProps {
  appKey: string
  onBack: () => void
}

export function ApplicationBillingManagementPage({ appKey, onBack }: ApplicationBillingManagementPageProps) {
  const app = applicationData[appKey as keyof typeof applicationData]

  if (!app) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold">Application not found</h2>
        </div>
      </div>
    )
  }

  const Icon = app.icon
  const usagePercentage = (app.usage.current / app.usage.limit) * 100

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Back Navigation */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-4 rounded-lg ${app.color} text-white`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{app.name}</h1>
          <p className="text-muted-foreground">{app.description}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{app.monthlyFee}</p>
          <p className="text-sm text-muted-foreground">per month</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Subscription Details */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
            <CardDescription>Current plan and billing information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="font-semibold">{app.plan}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Billing Cycle</p>
                <p className="font-semibold">{app.billingCycle}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Billing</p>
                <p className="font-semibold">{app.nextBilling}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Billed</p>
                <p className="font-semibold">{app.lastBilled}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usage this month</span>
                <span>
                  {app.usage.current.toLocaleString()} / {app.usage.limit.toLocaleString()} {app.usage.unit}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              {usagePercentage > 80 && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Approaching usage limit
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">Change Plan</Button>
              <Button variant="outline">Cancel Subscription</Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method for this App */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Payment method used for this application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods
              .filter((method) => method.isDefault)
              .map((method) => (
                <div key={method.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 rounded bg-blue-100">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">•••• •••• •••• {method.last4}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.type} • Expires {method.expiry}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    Active
                  </Badge>
                </div>
              ))}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-renew">Auto-renewal</Label>
                  <p className="text-sm text-muted-foreground">Automatically renew subscription</p>
                </div>
                <Switch id="auto-renew" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="usage-alerts">Usage Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified at 80% usage</p>
                </div>
                <Switch id="usage-alerts" defaultChecked />
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Change Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
            <CardDescription>What's included in your {app.plan} plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {app.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Billing</CardTitle>
            <CardDescription>Your recent charges for this application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium">February 2024</p>
                    <p className="text-sm text-muted-foreground">Paid on Feb 15, 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{app.monthlyFee}</p>
                  <Button variant="ghost" size="sm">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium">January 2024</p>
                    <p className="text-sm text-muted-foreground">Paid on Jan 15, 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{app.monthlyFee}</p>
                  <Button variant="ghost" size="sm">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              View All Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
