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
  MessageSquare,
  Phone,
  Star,
} from "lucide-react"
import { OpeningHours, getCurrentStatus } from "@/components/business/opening-hours"
import { GalleryGrid } from "@/components/business/gallery-grid"
import { BusinessServices } from "@/components/business/business-services"
import { BusinessAmenities } from "@/components/business/business-amenities"
import { ContactCTA } from "@/components/window/contact-cta"
import { ReviewModal } from "@/components/window/review-modal"
import { useState, useEffect } from "react"
import Link from "next/link"

interface WindowContentProps {
  businessId: string
  initialBusiness: any
}

interface Review {
  id: string
  authorName: string
  rating: number
  comment: string
  createdAt: string
  reply?: string | null
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  )
}

export function WindowContent({ businessId, initialBusiness }: WindowContentProps) {
  const { data: business = initialBusiness, isLoading } = useBusinessById(businessId, { initialData: initialBusiness })
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)

  // Fetch reviews client-side
  useEffect(() => {
    if (!businessId) return
    setReviewsLoading(true)
    fetch(`/api/reviews?businessId=${encodeURIComponent(businessId)}`)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false))
  }, [businessId])

  if (isLoading && !business) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!business) return null

  const liveStatus = getCurrentStatus(business)
  const displayName = business.name || business.businessName || "Business"
  const displayPhone = business.phone || business.phoneNumber

  // Compute average rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Sticky header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.history.back()
              } else {
                window.location.href = "/"
              }
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex bg-blue-50 text-blue-700 border-blue-200">
              Window Display
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-8 shadow-lg">
          {business.coverImage ? (
            <img src={business.coverImage} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
              <Building2 className="h-24 w-24 text-white opacity-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
            <div className="p-6 sm:p-8 w-full">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      {business.category?.categoryName || business.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-white/10 text-white border-white/20 backdrop-blur-md flex items-center gap-1.5"
                    >
                      <div className={`h-2 w-2 rounded-full ${liveStatus.isOpen ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                      {liveStatus.message}
                    </Badge>
                    {avgRating && (
                      <Badge className="bg-yellow-400/90 text-yellow-900 gap-1 border-0">
                        <Star className="h-3 w-3 fill-yellow-800" />
                        {avgRating} ({reviews.length})
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{displayName}</h1>
                  <p className="text-blue-100 italic line-clamp-2">
                    {business.tagline ||
                      "Providing quality " +
                        (business.category?.offeringEntity?.offeringName || "services") +
                        " to the community."}
                  </p>
                </div>
                {displayPhone && (
                  <div className="flex gap-2 shrink-0">
                    <a
                      href={`tel:${displayPhone}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm shadow-lg transition-colors active:scale-95"
                    >
                      <Phone className="h-4 w-4" />
                      Call Now
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
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

            {/* ─── Reviews section ─── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Reviews
                  {reviews.length > 0 && (
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {avgRating} ({reviews.length})
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  {reviews.length > 0 && (
                    <Link
                      href={`/window/${businessId}/reviews`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      See all →
                    </Link>
                  )}
                  <ReviewModal businessId={businessId} businessName={displayName} />
                </div>
              </div>

              {reviewsLoading ? (
                <div className="flex items-center justify-center py-8 bg-white rounded-xl border">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-white rounded-xl border p-8 text-center">
                  <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No reviews yet</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to share your experience.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="bg-white rounded-xl border shadow-sm p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {(review.authorName || "A")[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{review.authorName}</div>
                            <div className="text-xs text-gray-400">
                              {review.createdAt
                                ? new Date(review.createdAt).toLocaleDateString("en-KE", {
                                    year: "numeric", month: "short", day: "numeric",
                                  })
                                : ""}
                            </div>
                          </div>
                        </div>
                        <StarDisplay rating={review.rating} />
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                      {review.reply && (
                        <div className="mt-3 ml-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="text-xs font-bold text-blue-700 mb-1">Response from owner</div>
                          <p className="text-sm text-gray-700">{review.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {reviews.length > 3 && (
                    <Link
                      href={`/window/${businessId}/reviews`}
                      className="block w-full text-center py-3 rounded-xl border border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors"
                    >
                      View all {reviews.length} reviews →
                    </Link>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* ─── Sidebar ─── */}
          <div className="space-y-5">
            {/* Contact CTA card */}
            <Card className="overflow-hidden shadow-sm border">
              <CardHeader className="pb-3 bg-gradient-to-br from-blue-600 to-indigo-700">
                <CardTitle className="text-white text-base">Contact {displayName}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ContactCTA
                  phone={displayPhone}
                  email={business.email}
                  website={business.website}
                  businessName={displayName}
                  businessId={businessId}
                />
              </CardContent>
            </Card>

            {/* Hours */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OpeningHours business={business} />
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-3">
                <span className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  Location
                </span>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="font-semibold text-sm">{business.address}</p>
                  <p className="text-xs text-gray-500">{business.subCounty}, {business.county}</p>
                  <p className="text-xs text-gray-500">{business.country}</p>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    [business.address, business.subCounty, business.county, "Kenya"]
                      .filter(Boolean)
                      .join(", ")
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  View on Google Maps
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
