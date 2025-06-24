"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Key,
  Smartphone,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Monitor,
  Code,
  ArrowLeft,
} from "lucide-react"

export function SecurityPage({ onBack }: { onBack: () => void }) {
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground">Manage your account security and privacy settings</p>
      </div>

      {/* Security Overview */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {/* <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Security Score</p>
                <p className="text-2xl font-bold text-green-600">85/100</p>
                <p className="text-xs text-muted-foreground">Very Good</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">2FA Enabled</p>
                <p className="text-sm text-muted-foreground">SMS & Authenticator</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">Last Login</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Password & Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Password & Authentication
            </CardTitle>
            <CardDescription>Manage your login credentials and authentication methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>

            {/* <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-green-500" />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">SMS and Authenticator app</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div> */}

            {/* <div className="space-y-3">
              <Label className="text-sm font-medium">Backup Codes</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm">Recovery codes generated</p>
                  <p className="text-xs text-muted-foreground">8 codes remaining</p>
                </div>
                <Button variant="outline" size="sm">
                  View Codes
                </Button>
              </div>
            </div> */}
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>Control your privacy and data sharing preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
              </div>
              <Switch id="profile-visibility" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="activity-status">Activity Status</Label>
                <p className="text-sm text-muted-foreground">Show when you're online</p>
              </div>
              <Switch id="activity-status" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-analytics">Usage Analytics</Label>
                <p className="text-sm text-muted-foreground">Help improve our services</p>
              </div>
              <Switch id="data-analytics" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive product updates and offers</p>
              </div>
              <Switch id="marketing-emails" />
            </div>
          </CardContent>
        </Card> */}

        {/* Login Activity */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Recent Login Activity</CardTitle>
            <CardDescription>Monitor your account access and login history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Monitor className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-muted-foreground">Chrome on macOS • San Francisco, CA</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="outline" className="text-green-600">
                Active
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Smartphone className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium">Mobile App</p>
                <p className="text-sm text-muted-foreground">iPhone • San Francisco, CA</p>
                <p className="text-xs text-muted-foreground">Yesterday at 3:24 PM</p>
              </div>
              <Badge variant="secondary">Ended</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Globe className="h-4 w-4 text-orange-500" />
              <div className="flex-1">
                <p className="font-medium">Firefox on Windows</p>
                <p className="text-sm text-muted-foreground">New York, NY</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
              <Badge variant="destructive">Suspicious</Badge>
            </div>

            <Button variant="outline" className="w-full">
              View All Login Activity
            </Button>
          </CardContent>
        </Card> */}

        {/* Security Recommendations */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Security Recommendations
            </CardTitle>
            <CardDescription>Suggestions to improve your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-orange-800">Update Password</p>
                <p className="text-sm text-orange-700">Your password is over 3 months old</p>
              </div>
              <Button size="sm" variant="outline">
                Update
              </Button>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-800">Enable Biometric Login</p>
                <p className="text-sm text-blue-700">Use fingerprint or face recognition</p>
              </div>
              <Button size="sm" variant="outline">
                Enable
              </Button>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-green-800">Security Checkup Complete</p>
                <p className="text-sm text-green-700">All critical security features are enabled</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Connected Apps */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Connected Applications</CardTitle>
          <CardDescription>Third-party applications with access to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500 text-white">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Google Analytics</p>
                  <p className="text-sm text-muted-foreground">Access to profile data • Connected 2 months ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Revoke
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500 text-white">
                  <Code className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">GitHub Integration</p>
                  <p className="text-sm text-muted-foreground">Repository access • Connected 1 month ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Revoke
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500 text-white">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Mobile App Sync</p>
                  <p className="text-sm text-muted-foreground">Device synchronization • Connected 3 weeks ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Revoke
              </Button>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
