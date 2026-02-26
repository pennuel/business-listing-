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
import { OpeningHours, getCurrentStatus } from "@/components/business/opening-hours"
import { GalleryGrid } from "@/components/business/gallery-grid"
import { BusinessServices } from "@/components/business/business-services"
import { BusinessAmenities } from "@/components/business/business-amenities"


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
                <span>Image Gallery</span>
                {Array.isArray(business.gallery) && business.gallery.length > 0 && (
                  <span className="text-sm font-normal text-gray-400">({business.gallery.length})</span>
                )}
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <GalleryGrid
                  images={Array.isArray(business.gallery) ? business.gallery : []}
                  emptyMessage="No gallery images yet. Hover over this section to add some!"
                />
              </div>
            </section>

            {/* Services Section */}
            <section className="relative group">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Services &amp; Offerings</h2>
                {Array.isArray(business.services) && business.services.length > 0 && (
                  <span className="text-sm text-gray-400">{business.services.length} listed</span>
                )}
              </div>
              <BusinessServices
                services={Array.isArray(business.services) ? business.services : []}
                variant="card"
                emptyMessage="No services added yet."
              />
            </section>

            {/* Amenities Section */}
            {Array.isArray(business.amenities) && business.amenities.length > 0 && (
              <section className="relative group">
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                   <EditAmenitiesDialog business={business as any} />
                </div>
                <h2 className="text-xl font-bold mb-4">Amenities &amp; Perks</h2>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <BusinessAmenities
                    amenities={business.amenities as string[]}
                    variant="pills"
                  />
                </div>
              </section>
            )}
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
              <CardContent className="pt-5 px-6">
                <OpeningHours business={business} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
