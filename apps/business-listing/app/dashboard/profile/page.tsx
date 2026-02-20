import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { database } from "@think-id/database"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Star,
  MessageCircle,
  Share2,
  ArrowLeft,
  ExternalLink,
  Edit,
  ImageIcon,
} from "lucide-react"
import Link from "next/link"
import { EditBrandingDialog } from "@/components/dashboard/edit-branding-dialog"
import { EditContactDialog } from "@/components/dashboard/edit-contact-dialog"
import { EditGalleryDialog } from "@/components/dashboard/edit-gallery-dialog"
import { EditAmenitiesDialog } from "@/components/dashboard/edit-amenities-dialog"
import { EditLocationDialog } from "@/components/dashboard/edit-location-dialog"
import { EditHoursDialog } from "@/components/dashboard/edit-hours-dialog"

function formatTime(time: string) {
  if (!time || typeof time !== 'string' || !time.includes(":")) return time
  const [hours, minutes] = time.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

function getCurrentStatus(business: any) {
  if (business.isManuallyOpen === true) return { isOpen: true, message: "Open Now (Owner set)" }
  if (business.isManuallyOpen === false) return { isOpen: false, message: "Closed (Owner set)" }

  // Fallback for simple string-based schedules
  if (typeof business.weekdaySchedule === 'string') {
      return { isOpen: true, message: business.weekdaySchedule }
  }

  const now = new Date()
  const day = now.toString().toLowerCase().substring(0, 3) 
  const dayMap: { [key: string]: string } = { sun: "sunday", mon: "monday", tue: "tuesday", wed: "wednesday", thu: "thursday", fri: "friday", sat: "saturday" }
  const fullDay = dayMap[day]
  
  const weekday = business.weekdaySchedule as any
  const weekend = business.weekendSchedule as any
  const daySchedule = (weekday?.[fullDay] || weekend?.[fullDay])
  
  if (!daySchedule?.isOpen) return { isOpen: false, message: "Closed Today" }

  const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0')
  if (currentTime >= daySchedule.open && currentTime <= daySchedule.close) {
    return { isOpen: true, message: `Open until ${formatTime(daySchedule.close)}` }
  }
  return { isOpen: false, message: currentTime < daySchedule.open ? `Opens at ${formatTime(daySchedule.open)}` : "Closed" }
}

export default async function ProfilePage({ searchParams }: { searchParams: { businessId?: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await database.users.getUserByEmail(session.user.email)

  if (!user) {
    // If user is authenticated but not in our DB, they need to go to technical onboarding 
    // to link their account. Redirecting to dashboard will show the "Register" state.
    redirect("/dashboard")
  }

  const selectedBusinessId = (searchParams as any).businessId
  
  let business;
  if (selectedBusinessId) {
    business = await database.businesses.getBusinessById(selectedBusinessId)
  } else {
    // Get all businesses and pick the most recent
    const businesses = await database.businesses.getBusinessesByUserId(user.id)
    business = businesses[0];
  }

  if (!business) {
    redirect("/dashboard")
  }

  const weekday = business.weekdaySchedule as any
  const weekend = business.weekendSchedule as any
  
  const scheduleDays = [
    { name: 'Monday', ...weekday?.monday },
    { name: 'Tuesday', ...weekday?.tuesday },
    { name: 'Wednesday', ...weekday?.wednesday },
    { name: 'Thursday', ...weekday?.thursday },
    { name: 'Friday', ...weekday?.friday },
    { name: 'Saturday', ...weekend?.saturday },
    { name: 'Sunday', ...weekend?.sunday },
  ]

  const liveStatus = getCurrentStatus(business)

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            asChild
            className="flex items-center gap-2"
          >
            <Link href={`/dashboard?businessId=${business.id}`}>
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex bg-blue-50 text-blue-700 border-blue-200 gap-1.5 px-3 py-1">
               <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
               Live Editing Mode
            </Badge>
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <a href={`/window/${business.id}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
                View Public Window
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden mb-8 shadow-lg group">
          {business.coverImage ? (
            <img 
              src={business.coverImage} 
              alt={business.name} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
              <Building2 className="h-24 w-24 text-white opacity-20" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
            <div className="p-6 sm:p-8 w-full relative">
              
              {/* BRANDING EDIT TRIGGER */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <EditBrandingDialog business={business} />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-blue-500 hover:bg-blue-600 cursor-default">{business.category}</Badge>
                    <Badge variant="outline" className={`bg-white/10 text-white border-white/20 backdrop-blur-md flex items-center gap-1.5 cursor-default`}>
                      <div className={`h-2 w-2 rounded-full ${liveStatus.isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                      {liveStatus.message}
                    </Badge>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{business.name}</h1>
                  <p className="text-blue-100 italic">{business.tagline || "Providing quality " + business.offeringType + " to the community."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section className="relative group">
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                 <EditBrandingDialog business={business} trigger={
                   <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md">
                      <Edit className="h-4 w-4" />
                   </Button>
                 } />
              </div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                About Us
              </h2>
              <div className="bg-white p-6 rounded-xl border shadow-sm group-hover:border-blue-300 transition-colors cursor-pointer">
                <p className="text-gray-600 leading-relaxed">
                  {business.description || "No description provided."}
                </p>
              </div>
            </section>

            {/* Gallery Section */}
            <section className="relative group">
               <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <EditGalleryDialog business={business} trigger={
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md">
                       <Edit className="h-4 w-4" />
                    </Button>
                  } />
               </div>
               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                  Visual Showcase
               </h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border shadow-sm group-hover:border-blue-300 transition-colors">
                  {Array.isArray(business.gallery) && (business.gallery as any).length > 0 ? (
                    (business.gallery as any).map((url: string, i: number) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden border">
                         <img src={url} className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground italic flex flex-col items-center gap-2">
                       <ImageIcon className="h-8 w-8 opacity-20" />
                       Click the edit icon to add images to your gallery
                    </div>
                  )}
               </div>
            </section>

            {/* Amenities Section */}
            <section className="relative group">
               <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <EditAmenitiesDialog business={business} trigger={
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md">
                       <Edit className="h-4 w-4" />
                    </Button>
                  } />
               </div>
               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  Amenities & Perks
               </h2>
               <div className="flex flex-wrap gap-2 bg-white p-6 rounded-xl border shadow-sm group-hover:border-blue-300 transition-colors">
                  {Array.isArray(business.amenities) && (business.amenities as any).length > 0 ? (
                    (business.amenities as any).map((amenity: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1">
                        {amenity}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Click the edit icon to list your amenities.</p>
                  )}
               </div>
            </section>

            {/* Services/Products */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Our Offerings
                </h2>
                <Button variant="outline" size="sm" asChild className="gap-2">
                   <a href={`/dashboard/services?businessId=${business.id}`}>
                      <Edit className="h-3.5 w-3.5" /> Manage Shelves
                   </a>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {business.services.map((service : any) => (
                  <Card key={service.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{service.name}</h3>
                        <Badge variant="secondary">{service.currency} {Number(service.price).toLocaleString()}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {service.duration} mins
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {business.services.length === 0 && (
                   <div className="col-span-full py-12 bg-white rounded-xl border border-dashed flex flex-col items-center gap-4">
                      <p className="text-muted-foreground text-sm italic">No services listed yet.</p>
                      <Button asChild variant="secondary" size="sm">
                         <a href={`/dashboard/services?businessId=${business.id}`}>Manage Shelves</a>
                      </Button>
                   </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <section className="relative group">
               <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <EditContactDialog business={business} trigger={
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md">
                       <Edit className="h-4 w-4" />
                    </Button>
                  } />
               </div>
               <Card className="overflow-hidden shadow-sm border-none bg-blue-600 text-white cursor-pointer group-hover:ring-2 ring-blue-400 ring-offset-2 transition-all">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-lg">Contact Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                          <Phone className="h-4 w-4" />
                       </div>
                       <span>{business.phone}</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                          <Mail className="h-4 w-4" />
                       </div>
                       <span className="truncate">{business.email}</span>
                     </div>
                     {business.website && (
                       <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Globe className="h-4 w-4" />
                         </div>
                         <span className="truncate">{business.website}</span>
                       </div>
                     )}
                  </CardContent>
               </Card>
            </section>

            <Card className="shadow-sm relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <EditHoursDialog business={business} trigger={
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                       <Edit className="h-4 w-4" />
                    </Button>
                  } />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                   <Clock className="h-5 w-5 text-blue-600" />
                   Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                {typeof business.weekdaySchedule === 'object' && business.weekdaySchedule !== null ? (
                  <div className="space-y-3">
                    {scheduleDays.map((day) => (
                      <div key={day.name} className="flex justify-between items-center text-sm">
                        <span className={day.name === new Date().toLocaleDateString('en-US', {weekday: 'long'}) ? "font-bold" : ""}>
                          {day.name}
                        </span>
                        <span className="text-gray-500">
                          {day.isOpen ? `${formatTime(day.open)} - ${formatTime(day.close)}` : <span className="text-red-400">Closed</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Weekdays:</span>
                      <span className="text-gray-500">{business.weekdaySchedule || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Weekends:</span>
                      <span className="text-gray-500">{business.weekendSchedule || "Not set"}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm overflow-hidden relative group">
               <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <EditLocationDialog business={business} trigger={
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                       <Edit className="h-4 w-4" />
                    </Button>
                  } />
               </div>
               <div className="bg-gray-100 p-4 flex items-center justify-between">
                  <span className="text-sm font-bold flex items-center gap-2">
                     <MapPin className="h-4 w-4 text-red-500" />
                     Location
                  </span>
               </div>
               <CardContent className="p-4 space-y-4">
                  <div>
                    <p className="font-semibold text-sm">{business.address}</p>
                    <p className="text-xs text-gray-500">{business.subCounty}, {business.county}</p>
                    <p className="text-xs text-gray-500">{business.country}</p>
                  </div>
                  <Button variant="outline" className="w-full gap-2 text-xs h-9">
                     <ExternalLink className="h-3 w-3" />
                     View on Google Maps
                  </Button>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

