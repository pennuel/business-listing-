"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBusinessById } from "@/lib/hooks/useBusinesses"
import {
  ArrowLeft,
  Building2,
  Clock,
  ExternalLink,
  Globe,
  ImageIcon,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Share2,
  Star,
} from "lucide-react"
import { OpeningHours, getCurrentStatus } from "@/components/business/opening-hours"
import { GalleryGrid } from "@/components/business/gallery-grid"
import { BusinessServices } from "@/components/business/business-services"
import { BusinessAmenities } from "@/components/business/business-amenities"

interface WindowContentProps {
  businessId: string
  initialBusiness: any
}

export function WindowContent({ businessId, initialBusiness }: WindowContentProps) {
  const { data: business = initialBusiness, isLoading } = useBusinessById(businessId, { initialData: initialBusiness })

  if (isLoading && !business) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!business) return null

  const todayIndex = new Date().getDay()
  const liveStatus = getCurrentStatus(business)
  const displayName = business.name || business.businessName || "Business"
  const displayPhone = business.phone || business.phoneNumber

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" asChild className="flex items-center gap-2">
            <a href={`/dashboard?businessId=${businessId}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </a>
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex bg-blue-50 text-blue-700 border-blue-200">
              Window Display Mode
            </Badge>
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
              alt={displayName}
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
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      {business.category?.categoryName || business.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-white/10 text-white border-white/20 backdrop-blur-md flex items-center gap-1.5"
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${liveStatus.isOpen ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
                      />
                      {liveStatus.message}
                    </Badge>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{displayName}</h1>
                  <p className="text-blue-100 italic">
                    {business.tagline ||
                      "Providing quality " +
                        (business.category?.offeringEntity?.offeringName || "services") +
                        " to the community."}
                  </p>
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
              <h2 className="text-xl font-bold mb-4">About Us</h2>
              <p className="text-gray-600 leading-relaxed bg-white p-6 rounded-xl border shadow-sm">
                {business.description || "No description provided."}
              </p>
            </section>

            {/* Gallery */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-600" />
                Visual Showcase
                {Array.isArray(business.gallery) && business.gallery.length > 0 && (
                  <span className="text-sm font-normal text-gray-400">({business.gallery.length})</span>
                )}
              </h2>
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <GalleryGrid
                  images={Array.isArray(business.gallery) ? business.gallery : []}
                  emptyMessage="No photos yet."
                />
              </div>
            </section>


            {/* Services */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Services &amp; Offerings</h2>
                {Array.isArray(business.services) && business.services.length > 0 && (
                  <span className="text-sm text-gray-400">{business.services.length} available</span>
                )}
              </div>
              <BusinessServices
                services={Array.isArray(business.services) ? business.services : []}
                variant="card"
                emptyMessage="No services listed yet."
              />
            </section>

            {/* Amenities */}
            {Array.isArray(business.amenities) && business.amenities.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Amenities &amp; Perks</h2>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                  <BusinessAmenities amenities={business.amenities} variant="pills" />
                </div>
              </section>
            )}

            {/* Reviews placeholder */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Reviews</h2>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (24 reviews)</span>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <Card className="overflow-hidden shadow-sm border-none bg-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>{displayPhone}</span>
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

            {/* Hours */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OpeningHours business={business} />
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="shadow-sm overflow-hidden">
              <div className="bg-gray-100 p-4 flex items-center">
                <span className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  Location
                </span>
              </div>
              <CardContent className="p-4 space-y-4">
                <div>
                  <p className="font-semibold text-sm">{business.address}</p>
                  <p className="text-xs text-gray-500">
                    {business.subCounty}, {business.county}
                  </p>
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
