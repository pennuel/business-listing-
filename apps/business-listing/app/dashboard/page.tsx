import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { StoreStatusToggle } from "@/components/dashboard/store-status-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, MousePointerClick, MessageSquare, Plus, Upload, Globe, Mail, Clock, ExternalLink, Edit } from "lucide-react"

function formatSchedule(business: any) {
  const weekday = business.weekdaySchedule as any
  const weekend = business.weekendSchedule as any
  
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
            {day.isOpen ? `${day.open} - ${day.close}` : 'Closed'}
          </span>
        </div>
      ))}
    </div>
  )
}

function getLiveStatus(business: any) {
  try {
    const now = new Date()
    // Adjust to local time if needed, but for now use standard
    const day = now.toString().toLowerCase().substring(0, 3) 
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
    
    const weekday = business.weekdaySchedule as any
    const weekend = business.weekendSchedule as any
    const daySchedule = (weekday?.[fullDay] || weekend?.[fullDay])
    
    if (!daySchedule || !daySchedule.isOpen) return { isOpen: false, message: "Closed today" }

    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0')
    const open = daySchedule.open
    const close = daySchedule.close

    if (currentTime >= open && currentTime <= close) {
      return { isOpen: true, message: `Open until ${close}` }
    }
    if (currentTime < open) {
      return { isOpen: false, message: `Opens at ${open}` }
    }
    return { isOpen: false, message: "Closed for the day" }
  } catch (err) {
    return { isOpen: false, message: "Hours not available" }
  }
}

export default async function DashboardPage({ searchParams }: { searchParams: { businessId?: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { 
      businesses: {
        include: {
          services: true,
          reviews: {
            orderBy: { createdAt: 'desc' },
            take: 5
          },
          analytics: {
            orderBy: { date: 'desc' },
            take: 30
          }
        }
      } 
    }
  })

  // Select business based on URL or default to first
  const selectedBusinessId = searchParams.businessId
  const business = selectedBusinessId 
    ? user?.businesses.find(b => b.id === selectedBusinessId) 
    : user?.businesses[0]

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold">No Business Found</h1>
        <p className="text-muted-foreground">You haven't registered a business yet.</p>
        <Button asChild>
          <a href={`${process.env.NEXT_PUBLIC_THINK_ID_URL || 'http://localhost:3000'}/onboarding?returnTo=${encodeURIComponent(process.env.NEXT_PUBLIC_BUSINESS_LISTING_URL || 'http://localhost:3002')}/dashboard`}>Register Business</a>
        </Button>
      </div>
    )
  }

  // Calculate generic stats (mock logic for now if no analytics data)
  const totalViews = business.analytics.reduce((acc, curr) => acc + curr.views, 0)
  const totalCalls = business.analytics.reduce((acc, curr) => acc + curr.calls, 0)
  const totalDirections = business.analytics.reduce((acc, curr) => acc + curr.directions, 0)
  const totalClicks = business.analytics.reduce((acc, curr) => acc + curr.websiteClicks, 0)

  // Effectively determine open/closed
  const isOpen = business.isManuallyOpen ?? false 
  const scheduleStatus = getLiveStatus(business)

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* 1. The Header: Store Status */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
             {business.image ? (
                <img src={business.image} alt={business.name} className="h-full w-full object-cover" />
             ) : (
                <span className="text-2xl font-bold text-primary">{business.name.charAt(0)}</span>
             )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl">{business.name}</h1>
              <Badge variant="secondary">{business.category}</Badge>
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
              <a href={`/preview/${business.id}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Preview
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href={`${process.env.NEXT_PUBLIC_THINK_ID_URL}/onboarding?businessId=${business.id}&returnTo=${encodeURIComponent(process.env.NEXT_PUBLIC_BUSINESS_LISTING_URL + '/dashboard?businessId=' + business.id)}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </a>
            </Button>
          </div>
          <div className="h-px w-full sm:h-10 sm:w-px bg-border" />
          <div className="flex flex-col items-center gap-1">
              <StoreStatusToggle businessId={business.id} initialStatus={isOpen} />
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
             <Badge variant="outline">80% Complete</Badge>
           </CardHeader>
           <CardContent className="space-y-4 pt-4">
              <div className="aspect-video w-full rounded-md bg-muted relative group overflow-hidden border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                 {business.coverImage ? (
                    <img src={business.coverImage} className="w-full h-full object-cover" />
                 ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                       <Upload className="h-8 w-8" />
                       <span className="text-xs">Add Cover Photo</span>
                    </div>
                 )}
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm">Edit Photo</Button>
                 </div>
              </div>
              
              <div className="space-y-2">
                 <label className="text-sm font-medium">Elevator Pitch</label>
                 <div className="p-3 bg-muted/50 rounded-md text-sm italic">
                    {business.tagline || "Describe your business in 2 lines..."}
                 </div>
              </div>

              <Button className="w-full" variant="outline">
                 Manage Gallery
              </Button>
           </CardContent>
        </Card>

        {/* The Lease (Contact & Hours) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">The Lease</CardTitle>
              <p className="text-xs text-muted-foreground">Your contact and location details</p>
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
                    {business.pin && <p className="text-muted-foreground text-[10px]">PIN: {business.pin}</p>}
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

        {/* 4. The "Shelves" (Service Menu) & 5. Suggestion Box */}
        <div className="lg:col-span-1 space-y-6">
           
           {/* Shelves */}
           <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <div>
                    <CardTitle className="text-lg font-bold">The Shelves</CardTitle>
                    <p className="text-xs text-muted-foreground">What are you selling today?</p>
                 </div>
                 <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" /> Add Service
                 </Button>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    {business.services.length > 0 ? (
                       <div className="grid gap-3">
                          {business.services.map((service: any) => (
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
                          No services listed yet. Add your first item.
                       </div>
                    )}
                 </div>
              </CardContent>
           </Card>

           {/* Suggestion Box */}
           <Card>
              <CardHeader>
                 <CardTitle className="text-lg font-bold">Suggestion Box</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    {business.reviews.length > 0 ? (
                       business.reviews.map((review: any) => (
                          <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                             <div className="flex items-center justify-between mb-1">
                                <div className="font-medium text-sm">{review.authorName}</div>
                                <div className="flex text-yellow-500 text-[10px]">
                                   {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                </div>
                             </div>
                             <p className="text-xs text-muted-foreground mb-3">
                                {review.comment}
                             </p>
                             {review.reply ? (
                                <div className="bg-primary/5 p-2 rounded text-[10px] border-l-2 border-primary">
                                   <span className="font-bold">Your reply:</span> {review.reply}
                                </div>
                             ) : (
                                <Button variant="secondary" size="sm" className="h-7 text-[10px] gap-2 w-full sm:w-auto">
                                   <MessageSquare className="h-3 w-3" /> Reply as Business
                                </Button>
                             )}
                          </div>
                       ))
                    ) : (
                       <div className="text-center py-6 text-muted-foreground text-sm">
                          No reviews yet.
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
