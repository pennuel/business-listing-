"use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import {
//   Building2,
//   Phone,
//   Mail,
//   Globe,
//   MapPin,
//   Clock,
//   ExternalLink,
//   Edit,
//   ArrowLeft,
// } from "lucide-react"
// import Link from "next/link"
// import { EditBrandingDialog } from "@/components/dashboard/edit-branding-dialog"
// import { EditContactDialog } from "@/components/dashboard/edit-contact-dialog"
// import { EditGalleryDialog } from "@/components/dashboard/edit-gallery-dialog"
// import { EditAmenitiesDialog } from "@/components/dashboard/edit-amenities-dialog"
// import { EditLocationDialog } from "@/components/dashboard/edit-location-dialog"
// import { EditHoursDialog } from "@/components/dashboard/edit-hours-dialog"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import {
//   Building2,
//   Phone,
//   Mail,
//   Globe,
//   MapPin,
//   Clock,
//   ExternalLink,
//   Edit,
//   ArrowLeft,
// } from "lucide-react"
// import Link from "next/link"
// import { EditBrandingDialog } from "@/components/dashboard/edit-branding-dialog"
// import { EditContactDialog } from "@/components/dashboard/edit-contact-dialog"
// import { EditGalleryDialog } from "@/components/dashboard/edit-gallery-dialog"
// import { EditAmenitiesDialog } from "@/components/dashboard/edit-amenities-dialog"
// import { EditLocationDialog } from "@/components/dashboard/edit-location-dialog"
// import { EditHoursDialog } from "@/components/dashboard/edit-hours-dialog"
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
  ExternalLink,
  Edit,
  ArrowLeft,
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

export function ProfileContent({ business }: { business: any }) {
  if (!business) return null

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
          {/* {business.coverImage ? (
            <img 
              src={business.coverImage} 
              alt={business.name} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
              <Building2 className="h-24 w-24 text-white opacity-20" />
            </div>
          )} */}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
            <div className="p-6 sm:p-8 w-full relative">
              
              {/* BRANDING EDIT TRIGGER */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <EditBrandingDialog business={business as any} />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-blue-500 hover:bg-blue-600 cursor-default">{(business as any).category?.categoryName || business.category}</Badge>
                    <Badge variant="outline" className={`bg-white/10 text-white border-white/20 backdrop-blur-md flex items-center gap-1.5 cursor-default`}>
                      <div className={`h-2 w-2 rounded-full ${liveStatus.isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                      {liveStatus.message}
                    </Badge>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{business.name}</h1>
                  <p className="text-blue-100 italic">{(business as any).tagline || "Providing quality " + ((business as any).category?.offeringEntity?.offeringName || "services") + " to the community."}</p>
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
                 <EditBrandingDialog business={business as any} trigger={
                   <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md">
                      <Edit className="h-4 w-4" />
                   </Button>
                 } />
              </div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                About Our Business
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {business.description || "No description provided."}
                </p>
              </div>
            </section>

            {/* Gallery */}
            <section className="relative group">
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                 <EditGalleryDialog business={business as any} />
              </div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Image Gallery
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* {Array.isArray(business.gallery) && (business.gallery as any).length > 0 ? (
                    (business.gallery as any).map((img: string, i: number) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                        <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                      <p>No gallery images yet.</p>
                      <Button variant="outline" className="mt-4" onClick={() => {}}>
                        Add Photos
                      </Button>
                    </div>
                  )} */}
                </div>
              </div>
            </section>

            {/* Amenities Section */}
            <section className="relative group">
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                 <EditAmenitiesDialog business={business as any} />
              </div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Amenities & Perks
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* {Array.isArray(business.amenities) && (business.amenities as any).length > 0 ? (
                    (business.amenities as any).map((amenity: string) => (
                      <div key={amenity} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-gray-700 font-medium">{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No amenities listed yet.</p>
                  )} */}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="shadow-sm relative group overflow-visible">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                 <EditContactDialog business={business as any} />
              </div>
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-lg">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>{business.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="truncate">{business.email}</span>
                </div>
                {business.website && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <Globe className="h-4 w-4" />
                    </div>
                    <span>{business.website}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="shadow-sm relative group overflow-visible">
               <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                 <EditLocationDialog business={business as any} />
              </div>
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="flex gap-3 items-start text-gray-700">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{business.address}</p>
                    <p className="text-sm text-gray-500">{business.subCounty}, {business.county}</p>
                    {(business as any).pin && <p className="text-xs text-gray-400 mt-1">PIN: {(business as any).pin}</p>}
                  </div>
                </div>
                <Separator />
                <div className="aspect-video w-full rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                  Map Preview
                </div>
              </CardContent>
            </Card>

            {/* Hours Card */}
            <Card className="shadow-sm relative group overflow-visible">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                 <EditHoursDialog business={business as any} />
              </div>
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-lg flex items-center justify-between">
                  Opening Hours
                  <Clock className="h-4 w-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 px-0">
                <div className="px-6 space-y-2.5">
                  {scheduleDays.map((day) => (
                    <div key={day.name} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{day.name}</span>
                      <span className={`font-medium ${day.isOpen ? 'text-gray-900' : 'text-red-500'}`}>
                        {day.isOpen ? `${formatTime(day.open)} - ${formatTime(day.close)}` : 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
