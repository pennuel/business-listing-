"use client"

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
import { useBusinessById } from "@/lib/hooks/useBusinesses"

const DAY_KEYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
const DAY_LABELS: Record<string,string> = {
  monday:'Monday', tuesday:'Tuesday', wednesday:'Wednesday',
  thursday:'Thursday', friday:'Friday', saturday:'Saturday', sunday:'Sunday',
}
const DAY_KEY_TO_INDEX: Record<string,number> = {
  sunday:0, monday:1, tuesday:2, wednesday:3, thursday:4, friday:5, saturday:6,
}

function getScheduleForDay(business: any, dayKey: string): string | null {
  const wd = business.weekdaySchedule ?? business.schedule?.weekday
  const we = business.weekendSchedule ?? business.schedule?.weekend
  const isWeekend = dayKey === 'saturday' || dayKey === 'sunday'
  // Capitalize first letter to handle DB keys like "Thursday" alongside lowercase "thursday"
  const capitalKey = dayKey.charAt(0).toUpperCase() + dayKey.slice(1)
  if (!isWeekend && typeof wd === 'object') {
    const val = wd?.[dayKey] ?? wd?.[capitalKey]
    if (val) return val
  }
  if (isWeekend && typeof we === 'object') {
    const val = we?.[dayKey] ?? we?.[capitalKey]
    if (val) return val
  }
  if (!isWeekend && typeof wd === 'string') return wd
  if (isWeekend && typeof we === 'string') return we
  return null
}

function parseTimeToMinutes(timeStr: string): number {
  const str = timeStr.trim()
  // 24-hour format: "09:00" or "17:30"
  const match24 = str.match(/^(\d{1,2}):(\d{2})$/)
  if (match24) return parseInt(match24[1]) * 60 + parseInt(match24[2])
  // 12-hour format: "9:00 AM", "5:00 PM", "9AM", etc.
  const match12 = str.match(/^(\d{1,2}):?(\d{2})?\s*(AM|PM)$/i)
  if (!match12) return -1
  let h = parseInt(match12[1])
  const m = parseInt(match12[2] ?? '0')
  const ampm = match12[3]?.toUpperCase()
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function getCurrentStatus(business: any) {
  if (business.isManuallyOpen === true) return { isOpen: true, message: "Open Now (Owner set)" }
  if (business.isManuallyOpen === false) return { isOpen: false, message: "Closed (Owner set)" }

  const now = new Date()
  const dayKeys = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
  const todayKey = dayKeys[now.getDay()]
  const schedStr = getScheduleForDay(business, todayKey)
  if (!schedStr || schedStr.toLowerCase() === 'closed') return { isOpen: false, message: "Closed Today" }

  const parts = schedStr.split('-').map((s: string) => s.trim())
  if (parts.length < 2) return { isOpen: true, message: schedStr }

  const openMin = parseTimeToMinutes(parts[0])
  const closeMin = parseTimeToMinutes(parts[1])
  const nowMin = now.getHours() * 60 + now.getMinutes()
  if (openMin < 0 || closeMin < 0) return { isOpen: true, message: schedStr }
  if (nowMin >= openMin && nowMin <= closeMin) return { isOpen: true, message: `Open · Closes at ${parts[1]}` }
  if (nowMin < openMin) return { isOpen: false, message: `Closed · Opens at ${parts[0]}` }
  return { isOpen: false, message: 'Closed' }
}

export function ProfileContent({
  businessId,
  initialBusiness,
}: {
  businessId: string
  initialBusiness: any
}) {
  const { data: business = initialBusiness } = useBusinessById(businessId, { initialData: initialBusiness })
  if (!business) return null

  const resolvedId = business.id ?? (business as any).bizId?.toString() ?? businessId
  const displayName = business.name ?? (business as any).businessName ?? "Business"
  const displayPhone = business.phone ?? (business as any).phoneNumber

  const weekday = business.schedule?.weekday || business.weekdaySchedule as any
  const weekend = business.schedule?.weekend || business.weekendSchedule as any


  const liveStatus = getCurrentStatus(business)

  const todayIndex = new Date().getDay()

  const scheduleDays = DAY_KEYS.map(dayKey => {
  const schedStr = getScheduleForDay(business, dayKey)
  const isClosed = !schedStr || schedStr.toLowerCase() === 'closed'
    return {
      name: DAY_LABELS[dayKey],
      dayKey,
      schedStr: schedStr || 'Closed',
      isClosed
    }
  })
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
            <Link href={`/dashboard?businessId=${resolvedId}`}>
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
              <a href={`/window/${resolvedId}`} target="_blank">
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
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{displayName}</h1>
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
                  <span>{displayPhone}</span>
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
                    <div key={day.name} className={`flex justify-between items-center text-sm ${DAY_KEY_TO_INDEX[day.dayKey] === todayIndex ? 'font-semibold' : ''}`}>
                      <span className={DAY_KEY_TO_INDEX[day.dayKey] === todayIndex ? 'text-blue-600' : 'text-gray-500'}>
                        {day.name}{DAY_KEY_TO_INDEX[day.dayKey] === todayIndex && ' ·'}
                      </span>
                      <span className={day.isClosed ? 'text-red-500 font-medium' : 'text-gray-900'}>
                        {day.isClosed ? 'Closed' : day.schedStr}
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
