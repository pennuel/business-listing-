"use client"

import { useAppSelector } from "@/lib/redux/hooks"
import { StoreStatusToggle } from "@/components/dashboard/store-status-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Phone, MapPin, MousePointerClick, MessageSquare, Plus, Upload, 
  Globe, Mail, Clock, ExternalLink, Edit 
} from "lucide-react"
import Link from "next/link"

function formatTime(time: string) {
  if (!time || typeof time !== 'string' || !time.includes(":")) return time
  const [hours, minutes] = time.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

function formatSchedule(business: any) {
  const weekday = business.weekdaySchedule as any
  const weekend = business.weekendSchedule as any
  
  // Handle string-based fallback
  if (typeof weekday === 'string') {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="font-medium">Mon - Fri</span>
                <span className="text-muted-foreground">{weekday}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="font-medium">Sat - Sun</span>
                <span className="text-muted-foreground">{typeof weekend === 'string' ? weekend : 'Closed'}</span>
            </div>
        </div>
    )
  }

  const days = [
    { name: 'Mon', ...weekday?.monday },
    { name: 'Tue', ...weekday?.tuesday },
    { name: 'Wed', ...weekday?.wednesday },
    { name: 'Thu', ...weekday?.thursday },
    { name: 'Fri', ...weekday?.friday },
    { name: 'Sat', ...weekend?.saturday },
    { name: 'Sun', ...weekend?.sunday },
  ]

  return (
    <div className="space-y-2">
      {days.map((day) => (
        <div key={day.name} className="flex justify-between items-center text-sm">
          <span className="font-medium">{day.name}</span>
          <span className="text-muted-foreground">
            {day.isOpen ? `${formatTime(day.open)} - ${formatTime(day.close)}` : 'Closed'}
          </span>
        </div>
      ))}
    </div>
  )
}

function getLiveStatus(business: any) {
  try {
    if (business.isManuallyOpen === true) return { isOpen: true, message: "Open Now (Owner set)" }
    if (business.isManuallyOpen === false) return { isOpen: false, message: "Closed (Owner set)" }

    const now = new Date()
    const day = now.toString().toLowerCase().substring(0, 3) 
    const dayMap: { [key: string]: string } = {
      sun: "sunday", mon: "monday", tue: "tuesday", wed: "wednesday", thu: "thursday", fri: "friday", sat: "saturday",
    }
    const fullDay = dayMap[day]
    
    const weekday = business.weekdaySchedule as any
    const weekend = business.weekendSchedule as any
    const daySchedule = (weekday?.[fullDay] || weekend?.[fullDay])
    
    if (!daySchedule || !daySchedule.isOpen) return { isOpen: false, message: "Closed today" }

    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0')
    const open = daySchedule.open
    const close = daySchedule.close

    if (currentTime >= open && currentTime <= close) {
      return { isOpen: true, message: `Open until ${formatTime(close)}` }
    }
    if (currentTime < open) {
      return { isOpen: false, message: `Opens at ${formatTime(open)}` }
    }
    return { isOpen: false, message: "Closed for the day" }
  } catch (err) {
    return { isOpen: false, message: "Hours not available" }
  }
}

export function DashboardContent() {
  const business = useAppSelector(state => state.business.currentBusiness)

  if (!business) return null

  // Calculate generic stats
  const analytics = (business as any).analytics || []
  const totalViews = analytics.reduce((acc: any, curr: any) => acc + curr.views, 0)
  const totalCalls = analytics.reduce((acc: any, curr: any) => acc + curr.calls, 0)
  const totalDirections = analytics.reduce((acc: any, curr: any) => acc + curr.directions, 0)
  const totalClicks = analytics.reduce((acc: any, curr: any) => acc + curr.websiteClicks, 0)

  const scheduleStatus = getLiveStatus(business)
  const services = (business as any).services || []
  const reviews = (business as any).reviews || []

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. The Header: Store Status */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
             {(business as any).logo ? (
                <img src={(business as any).logo} alt={business.name} className="h-full w-full object-cover" />
             ) : (
                <span className="text-2xl font-bold text-primary">{business.name?.charAt(0)}</span>
             )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl">{business.name}</h1>
              <Badge variant="secondary">{(business as any).category?.categoryName || business.category}</Badge>
              <Badge
                variant={
                  business.status === "active"
                    ? "default"
                    : business.status === "pending"
                      ? "secondary"
                      : "destructive"
                }
                className="capitalize"
              >
                {business.status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" /> {business.address}, {business.subCounty}, {business.county}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`/window/${business.id}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Window
              </a>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/dashboard/profile?businessId=${business.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
          <div className="h-px w-full sm:h-10 sm:w-px bg-border" />
          <div className="flex flex-col items-center gap-1">
              <StoreStatusToggle businessId={business.id} initialStatus={business.isManuallyOpen || false} />
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Store Status</span>
                <span className={`text-[9px] font-medium ${scheduleStatus.isOpen ? 'text-green-500' : 'text-red-500'}`}>
                  Sched: {scheduleStatus.message}
                </span>
              </div>
          </div>
        </div>
      </div>

      {/* 2. The "Foot Traffic" Monitor (Analytics) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <CardHeader>
             <CardTitle className="text-lg font-medium text-muted-foreground">Foot Traffic (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-8 items-end">
             <div>
                <div className="text-5xl font-bold tracking-tight">{totalViews.toLocaleString()}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Profile Views</div>
             </div>
             
             {/* Mini Conversion Funnel */}
             <div className="grid grid-cols-3 gap-8 w-full md:w-auto md:ml-auto">
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> Directions
                   </div>
                   <div className="text-2xl font-semibold">{totalDirections}</div>
                </div>
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" /> Calls
                   </div>
                   <div className="text-2xl font-semibold">{totalCalls}</div>
                </div>
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MousePointerClick className="h-4 w-4" /> Clicks
                   </div>
                   <div className="text-2xl font-semibold">{totalClicks}</div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. The "Window Display" (Left Column) */}
        <Card className="lg:col-span-1">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-lg font-bold">Window Display</CardTitle>
             <Badge variant="outline">Update Required</Badge>
           </CardHeader>
           <CardContent className="space-y-6 pt-4">
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "Dressing the mannequin" — control how your business appears in the public mall directory.
              </p>

              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cover Photo</label>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 border" asChild>
                       <Link href={`/dashboard/profile?businessId=${business.id}`}>
                       Change
                       </Link>
                    </Button>
                 </div>
                 <div className="aspect-video w-full rounded-lg bg-muted relative group overflow-hidden border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    {(business as any).coverImage ? (
                       <img src={(business as any).coverImage} className="w-full h-full object-cover" />
                    ) : (
                       <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Upload className="h-8 w-8" />
                          <span className="text-xs">Upload Hero Image</span>
                       </div>
                    )}
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gallery</label>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 border" asChild>
                       <Link href={`/dashboard/profile?businessId=${business.id}`}>Manage</Link>
                    </Button>
                 </div>
                 <div className="grid grid-cols-3 gap-2">
                    {Array.isArray(business.gallery) && (business.gallery as any).length > 0 ? (
                       (business.gallery as any).slice(0, 6).map((img: string, i: number) => (
                          <div key={i} className="aspect-square rounded-md overflow-hidden bg-muted border">
                             <img src={img} className="w-full h-full object-cover" />
                          </div>
                       ))
                    ) : (
                       [1, 2, 3].map((i) => (
                          <div key={i} className="aspect-square rounded-md bg-muted/50 flex items-center justify-center border border-dashed border-muted-foreground/20 text-muted-foreground/40">
                             <Plus className="h-4 w-4" />
                          </div>
                       ))
                    )}
                 </div>
              </div>
              
              <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Elevator Pitch</label>
                 <div className="p-3 bg-muted/30 rounded-lg text-sm italic border border-muted-foreground/10">
                    "{ (business as any).tagline || "Describe your business in 2 lines... e.g. Best coffee in Kilimani."}"
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amenities</label>
                 <div className="flex flex-wrap gap-2">
                    {Array.isArray(business.amenities) && (business.amenities as any).length > 0 ? (
                       (business.amenities as any).map((amenity: string) => (
                          <Badge key={amenity} variant="secondary" className="font-normal text-[10px]">
                             {amenity}
                          </Badge>
                       ))
                    ) : (
                       <p className="text-[10px] text-muted-foreground italic">No perks listed yet.</p>
                    )}
                 </div>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-2 gap-2">
                <Button className="w-full gap-2 shadow-sm" variant="default" asChild>
                   <Link href={`/dashboard/profile?businessId=${business.id}`}>
                      <Edit className="h-4 w-4" />
                      Dress Mannequin
                   </Link>
                </Button>
                <Button className="w-full gap-2 shadow-sm" variant="outline" asChild>
                   <a href={`/window/${business.id}`}>
                      <ExternalLink className="h-4 w-4" />
                      View Live
                   </a>
                </Button>
              </div>
           </CardContent>
        </Card>

        {/* The Lease (Contact & Hours) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg font-bold">The Lease</CardTitle>
                <p className="text-xs text-muted-foreground">Your contact and location details</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 border" asChild>
                <Link href={`/dashboard/profile?businessId=${business.id}`}>
                  Edit <Edit className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{business.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{business.phone}</span>
                </div>
                {business.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{business.website}</span>
                  </div>
                )}
                <div className="flex items-start gap-2 text-sm pt-2 border-t mt-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{business.address}</p>
                    <p className="text-muted-foreground text-xs">{business.subCounty}, {business.county}</p>
                    { (business as any).pin && <p className="text-muted-foreground text-[10px]">PIN: {(business as any).pin}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-bold">Opening Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {formatSchedule(business)}
            </CardContent>
          </Card>
        </div>

        {/* The Shelves & Suggestion Box */}
        <div className="lg:col-span-1 space-y-6">
           <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <div>
                    <CardTitle className="text-lg font-bold">The Shelves</CardTitle>
                    <p className="text-xs text-muted-foreground">What are you selling today?</p>
                 </div>
                 <Button size="sm" variant="ghost" className="gap-1 h-8" asChild>
                    <Link href={`/dashboard/services?businessId=${business.id}`}>
                      View All <ExternalLink className="h-3 w-3" />
                    </Link>
                 </Button>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    {services.length > 0 ? (
                       <div className="grid gap-3">
                          {services.slice(0, 3).map((service: any) => (
                             <div key={service.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                <div>
                                   <div className="font-medium text-sm">{service.name}</div>
                                   <div className="text-[10px] text-muted-foreground uppercase">{service.duration} mins</div>
                                </div>
                                <div className="text-sm font-bold">
                                   {service.currency} {Number(service.price).toLocaleString()}
                                </div>
                             </div>
                          ))}
                       </div>
                    ) : (
                       <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground text-sm">
                          No items listed yet.
                       </div>
                    )}
                 </div>
              </CardContent>
           </Card>

           <Card>
              <CardHeader>
                 <CardTitle className="text-lg font-bold">Suggestion Box</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    {reviews.length > 0 ? (
                       reviews.map((review: any) => (
                          <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                             <div className="flex items-center justify-between mb-1">
                                <div className="font-medium text-sm">{review.authorName}</div>
                                <div className="flex text-yellow-500 text-[10px]">
                                   {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                </div>
                             </div>
                             <p className="text-xs text-muted-foreground">{review.comment}</p>
                          </div>
                       ))
                    ) : (
                       <div className="text-center py-6 text-muted-foreground text-sm">
                          No feedback yet.
                       </div>
                    )}
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
