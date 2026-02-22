import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { database } from "@think-id/database"
import { ArrowLeft, Building2, Clock, ExternalLink, Globe, ImageIcon, Mail, MapPin, Phone, Share2, Star } from "lucide-react"
import { notFound } from "next/navigation"

function formatTime(time: string) {
  if (!time || typeof time !== 'string' || !time.includes(":")) return time
  const [hours, minutes] = time.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

function getCurrentStatus(business: any) {
  // Manual override takes precedence in the Mall Metaphor
  if (business.isManuallyOpen === true) {
    return { isOpen: true, message: "Open Now (Owner set)" }
  }
  if (business.isManuallyOpen === false) {
    return { isOpen: false, message: "Closed (Owner set)" }
  }

  // Fallback for simple string-based schedules
  if (typeof business.weekdaySchedule === 'string') {
      return { isOpen: true, message: business.weekdaySchedule }
  }

  const now = new Date()
  const currentDay = now.toString().toLowerCase().substring(0, 3)
  const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0')

  const dayMap: { [key: string]: string } = {
    sun: "sunday",
    mon: "monday",
    tue: "tuesday",
    wed: "wednesday",
    thu: "thursday",
    fri: "friday",
    sat: "saturday",
  }

  const fullDay = dayMap[currentDay]
  const weekday = business.weekdaySchedule as any
  const weekend = business.weekendSchedule as any
  const daySchedule = (weekday?.[fullDay] || weekend?.[fullDay])

  if (!daySchedule?.isOpen) {
    return { isOpen: false, message: "Closed Today" }
  }

  const openTime = daySchedule.open
  const closeTime = daySchedule.close

  if (currentTime >= openTime && currentTime <= closeTime) {
    return { isOpen: true, message: `Open until ${formatTime(closeTime)}` }
  } else if (currentTime < openTime) {
    return { isOpen: false, message: `Opens at ${formatTime(openTime)}` }
  } else {
    return { isOpen: false, message: "Closed" }
  }
}

export default async function WindowPage({ params }: { params: { id: string } }) {
  

  const business = await database.businesses.getBusinessById(params.id)

  

  if (!business) {
    notFound()
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
            <a href={`/dashboard?businessId=${business.bizId}`}>
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </a>
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex bg-blue-50 text-blue-700 border-blue-200">Window Display Mode</Badge>
            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Share2 className="h-4 w-4" />
              Share Window
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden mb-8 shadow-lg">
          {business.coverImage ? (
            <img 
              src={business.coverImage} 
              alt={business.businessName} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
              <Building2 className="h-24 w-24 text-white opacity-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
            <div className="p-6 sm:p-8 w-full">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-blue-500 hover:bg-blue-600">{business.category?.categoryName}</Badge>
                    <Badge variant="outline" className={`bg-white/10 text-white border-white/20 backdrop-blur-md flex items-center gap-1.5`}>
                      <div className={`h-2 w-2 rounded-full ${liveStatus.isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                      {liveStatus.message}
                    </Badge>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{business.businessName}</h1>
                  <p className="text-blue-100 italic">{business.tagline || "Providing quality " + business.category?.offeringEntity?.offeringName + " to the community."}</p>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-white text-blue-700 hover:bg-blue-50 gap-2">
                        <Phone className="h-4 w-4" />
                        Call Now
                    </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                About Us
              </h2>
              <p className="text-gray-600 leading-relaxed bg-white p-6 rounded-xl border shadow-sm">
                {business.description || "No description provided."}
              </p>
            </section>

            {/* Gallery Section */}
            {Array.isArray(business.gallery) && (business.gallery as any).length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                  Visual Showcase
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border shadow-sm">
                  {(business.gallery as any).map((url: string, i: number) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden border">
                      <img src={url} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Amenities Section */}
            {Array.isArray(business.amenities) && (business.amenities as any).length > 0 && (
              <section>
                 <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    Amenities & Perks
                 </h2>
                 <div className="flex flex-wrap gap-2 bg-white p-6 rounded-xl border shadow-sm">
                    {(business.amenities as any).map((amenity: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1">
                        {amenity}
                      </Badge>
                    ))}
                 </div>
              </section>
            )}

            {/* Services/Products */}
            {/* <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Our Offerings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {business.services.map((service : any) => (
                  <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                        <Button variant="ghost" size="sm" className="h-8 text-blue-600">More Info</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {business.services.length === 0 && (
                   <p className="text-muted-foreground text-sm italic col-span-2 text-center py-8 border-2 border-dashed rounded-xl">No services listed yet.</p>
                )}
              </div>
            </section> */}

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Reviews</h2>
                <div className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8 (24 reviews)</span>
                </div>
              </div>
              {/* <div className="space-y-4">
                {business.reviews.map((review : any) => (
                  <Card key={review.id} className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-900">{review.authorName}</p>
                          <div className="flex text-yellow-500 mt-1">
                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 mb-4">{review.comment}</p>
                      {review.reply && (
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <p className="text-xs font-bold text-gray-900 mb-1">Response from the business:</p>
                          <p className="text-sm text-gray-600 italic">{review.reply}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {business.reviews.length === 0 && (
                   <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-400">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No reviews yet. Be the first to share your experience!</p>
                   </div>
                )}
              </div> */}
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <Card className="overflow-hidden shadow-sm border-none bg-blue-600 text-white">
               <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Contact Info</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                       <Phone className="h-4 w-4" />
                    </div>
                    <span>{business.phoneNumber}</span>
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

            <Card className="shadow-sm">
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

            <Card className="shadow-sm overflow-hidden">
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
