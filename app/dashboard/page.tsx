"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Building2, MapPin, Phone, Mail, ExternalLink, Plus, Edit, CheckCircle, XCircle, Clock, MessageCircle } from "lucide-react"

interface Business {
  id: string
  name: string
  type: string
  description: string
  email: string
  phone: string
  address: string
  country?: string
  county?: string
  subCounty?: string
  pin?: string
  formattedAddress?: string
  latitude?: number
  longitude?: number
  placeId?: string
  website?: string
  schedule: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
  status: "active" | "pending" | "inactive"
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated" && session?.user?.email) {
      fetchBusiness()
    }
  }, [status, session, router])

  const fetchBusiness = async () => {
    try {
      const response = await fetch(`/api/businesses?email=${session?.user?.email}`)
      if (response.ok) {
        const data = await response.json()
        if (data.businesses && data.businesses.length > 0) {
          setBusiness(data.businesses[0])
        }
      }
    } catch (error) {
      console.error("Error fetching business:", error)
    } finally {
      setLoading(false)
    }
  }

  // compute open/closed status from the normalized `schedule` object
  const getLiveStatus = (schedule: any) => {
    try {
      const now = new Date()
      const day = now
        .toString()
        .toLowerCase()
        .substring(0, 3) // mon, tue, etc.
      const dayMap: { [key: string]: string } = {
        sun: "sunday",
        mon: "monday",
        tue: "tuesday",
        wed: "wednesday",
        thu: "thursday",
        fri: "friday",
        sat: "saturday",
      }
      const fullDay = dayMap[day]
      const daySchedule = schedule?.[fullDay]
      if (!daySchedule) return { isOpen: false, message: "Hours not set" }
      if (daySchedule.closed) return { isOpen: false, message: "Closed today" }

      const currentTime = now.toTimeString().substring(0, 5)
      const open = daySchedule.open
      const close = daySchedule.close

      const toDisplay = (t: string) => {
        const [h, m] = t.split(":")
        const hh = Number.parseInt(h)
        const ampm = hh >= 12 ? "PM" : "AM"
        const displayHour = hh % 12 || 12
        return `${displayHour}:${m} ${ampm}`
      }

      if (currentTime >= open && currentTime <= close) {
        return { isOpen: true, message: `Open until ${toDisplay(close)}` }
      }
      if (currentTime < open) {
        return { isOpen: false, message: `Opens at ${toDisplay(open)}` }
      }
      return { isOpen: false, message: "Closed" }
    } catch (err) {
      return { isOpen: false, message: "Hours not available" }
    }
  }

  // Poll for business updates every 10 seconds so dashboard reflects edits
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return
    const interval = setInterval(() => {
      fetchBusiness()
    }, 10000)

    // initial fetch already triggered in the other effect, but ensure one now
    fetchBusiness()

    return () => clearInterval(interval)
  }, [status, session?.user?.email])

  if (status === "loading" || loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">No Business Found</h1>
              <p className="text-gray-600 mb-6">
                You haven't registered a business yet. Complete our onboarding process to get started.
              </p>
              <Button onClick={() => router.push("/onboarding")} size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Register Your Business
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatSchedule = (schedule: Business["schedule"]) => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    return days
      .map((day, index) => {
        const daySchedule = schedule[day]
        if (!daySchedule) return null

        return (
          <div key={day} className="flex justify-between items-center py-1">
            <span className="font-medium">{dayNames[index]}</span>
            <span className="text-sm text-gray-600">
              {daySchedule.closed ? "Closed" : `${daySchedule.open} - ${daySchedule.close}`}
            </span>
          </div>
        )
      })
      .filter(Boolean)
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
                  <p className="text-gray-600">Manage your business profile and settings</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => router.push(`/preview/${business.id}`)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button onClick={() => router.push("/onboarding")}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Business Profile Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-2xl">{business.name}</CardTitle>
                                  <CardDescription className="text-lg">{business.type}</CardDescription>
                                  {/* Live open/closed status */}
                                  <div className="flex items-center gap-2 mt-2 text-sm">
                                    {(() => {
                                      const status = getLiveStatus(business.schedule || {})
                                      return (
                                        <div className={`flex items-center gap-2 ${status.isOpen ? "text-green-600" : "text-red-600"}`}>
                                          {status.isOpen ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                          <span className="font-medium">{status.message}</span>
                                        </div>
                                      )
                                    })()}
                                  </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      business.status === "active"
                        ? "default"
                        : business.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{business.description}</p>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{business.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{business.phone}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="text-sm">
                          <div>{business.address}</div>
                          <div>
                            {business.subCounty ? `${business.subCounty}, ` : ""}
                            {business.county ? `${business.county}` : ""}
                            {business.pin ? ` • ${business.pin}` : ""}
                          </div>
                          {business.country && <div>{business.country}</div>}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button
                          className="w-full justify-start px-4 py-2 rounded-md flex items-center gap-3"
                          onClick={() => {
                            if (business.phone) window.location.href = `tel:${business.phone}`
                          }}
                          disabled={!business.phone}
                        >
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-50 text-blue-600">
                            <Phone className="h-4 w-4" />
                          </span>
                          <div className="text-left">
                            <div className="font-medium">Call</div>
                            <div className="text-xs text-gray-500">{business.phone || "—"}</div>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start px-4 py-2 rounded-md flex items-center gap-3"
                          onClick={() => {
                            if (business.email) window.location.href = `mailto:${business.email}`
                          }}
                          disabled={!business.email}
                        >
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-50 text-green-600">
                            <MessageCircle className="h-4 w-4" />
                          </span>
                          <div className="text-left">
                            <div className="font-medium">Message</div>
                            <div className="text-xs text-gray-500">{business.email || "—"}</div>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start px-4 py-2 rounded-md flex items-center gap-3"
                          onClick={() => {
                            const query = business.formattedAddress || `${business.address} ${business.subCounty || ""} ${business.county || ""} ${business.country || ""}`
                            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
                            window.open(url, "_blank")
                          }}
                        >
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-pink-50 text-pink-600">
                            <MapPin className="h-4 w-4" />
                          </span>
                          <div className="text-left">
                            <div className="font-medium">Get Directions</div>
                            <div className="text-xs text-gray-500">Open in Maps</div>
                          </div>
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4 py-2 rounded-md flex items-center gap-3"
                          onClick={() => business.website && window.open(business.website.startsWith("http") ? business.website : `https://${business.website}`, "_blank")}
                          disabled={!business.website}
                        >
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-50 text-indigo-600">
                            <ExternalLink className="h-4 w-4" />
                          </span>
                          <div className="text-left">
                            <div className="font-medium">Website</div>
                            <div className="text-xs text-gray-500">{business.website || "—"}</div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Business Hours</h3>
                    <div className="space-y-1">{formatSchedule(business.schedule)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Views</CardTitle>
                  <CardDescription>This month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Requests</CardTitle>
                  <CardDescription>This month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                </CardContent>
              </Card> */}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Status</CardTitle>
                  <CardDescription>Current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <p className="text-xs text-muted-foreground">Profile is live and visible</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}