"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Download,
  DollarSign,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Database,
  Globe,
  Code,
  Smartphone,
  Plus,
} from "lucide-react";
import { AddPaymentMethodModal } from "./add-payment-method-modal";

const applicationGroups = [
  {
    category: "Analytics & Data",
    applications: [
      {
        name: "Analytics Pro",
        icon: BarChart3,
        color: "bg-blue-500",
        plan: "Professional",
        monthlyFee: "$12.99",
        status: "active",
        key: "analytics-pro",
      },
    ],
    totalMonthly: 12.99,
  },
  {
    category: "Productivity",
    applications: [
      {
        name: "Task Manager Pro",
        icon: Database,
        color: "bg-green-500",
        plan: "Team",
        monthlyFee: "$8.99",
        status: "active",
        key: "task-manager",
      },
    ],
    totalMonthly: 8.99,
  },
  {
    category: "Development",
    applications: [
      {
        name: "Website Builder",
        icon: Globe,
        color: "bg-orange-500",
        plan: "Creator",
        monthlyFee: "$15.99",
        status: "active",
        key: "website-builder",
      },
      {
        name: "Code Editor Plus",
        icon: Code,
        color: "bg-purple-500",
        plan: "Developer",
        monthlyFee: "$9.99",
        status: "active",
        key: "code-editor",
      },
      {
        name: "Mobile App Studio",
        icon: Smartphone,
        color: "bg-pink-500",
        plan: "Starter",
        monthlyFee: "$6.99",
        status: "trial",
        key: "mobile-app",
      },
    ],
    totalMonthly: 32.97,
  },
];

interface BillingPageProps {
  onBack?: () => void;
  onApplicationGroupSelect: (category: string) => void;
}

export function BillingPage({
  onBack,
  onApplicationGroupSelect,
}: BillingPageProps) {
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
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
  ]);

  const handlePaymentMethodAdded = (newMethod: any) => {
    setPaymentMethods([...paymentMethods, newMethod]);
  };

  const totalMonthly = applicationGroups.reduce(
    (sum, group) => sum + group.totalMonthly,
    0
  );
  const activeSubscriptions = applicationGroups.reduce(
    (sum, group) =>
      sum + group.applications.filter((app) => app.status === "active").length,
    0
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-2 sm:p-4 pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Billing Overview</h1>
          <p className="text-muted-foreground">
            Manage your application subscriptions and payment methods
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Download Summary
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Monthly</p>
                <p className="text-3xl font-bold">${totalMonthly.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Subscriptions
                </p>
                <p className="text-3xl font-bold">{activeSubscriptions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Next Billing</p>
                <p className="text-3xl font-bold">Mar 15</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Groups */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Subscriptions by Category</h2>

        <div className="space-y-4">
          {applicationGroups.map((group) => (
            <Card
              key={group.category}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onApplicationGroupSelect(group.category)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{group.category}</CardTitle>
                    <CardDescription>
                      {group.applications.length} application
                      {group.applications.length > 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        ${group.totalMonthly.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">/month</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {group.applications.map((app) => {
                    const Icon = app.icon;
                    return (
                      <div key={app.key} className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${app.color} text-white`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {app.name}
                          </span>
                          <Badge
                            variant={
                              app.status === "active" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {app.status === "trial" ? "Trial" : "Active"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods for all subscriptions
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsAddPaymentModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-gray-100">
                    <CreditCard className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {method.type === "M-Pesa"
                        ? `M-Pesa •••• ${method.last4}`
                        : method.type === "Bank"
                        ? `${method.bankName} •••• ${method.last4}`
                        : `•••• •••• •••• ${method.last4}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {method.type === "M-Pesa"
                        ? `Phone: ${method.phoneNumber}`
                        : method.type === "Bank"
                        ? `Bank Account`
                        : `${method.type} • Expires ${method.expiry}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.isDefault && (
                    <Badge variant="outline" className="text-green-600">
                      Default
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddPaymentMethodModal
        isOpen={isAddPaymentModalOpen}
        onClose={() => setIsAddPaymentModalOpen(false)}
        onPaymentMethodAdded={handlePaymentMethodAdded}
      />
    </div>
  );
}
