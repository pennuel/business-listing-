"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { Business } from "@/lib/api";

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");
  const hour = Number.parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function getCurrentStatus(business: Business) {
  const now = new Date();
  const currentDay = now.toString().toLowerCase().substring(0, 3); // mon, tue, etc.
  const currentTime = now.toTimeString().substring(0, 5); // HH:MM format

  // Map day names
  const dayMap: { [key: string]: string } = {
    sun: "sunday",
    mon: "monday",
    tue: "tuesday",
    wed: "wednesday",
    thu: "thursday",
    fri: "friday",
    sat: "saturday",
  };

  const fullDayName = dayMap[currentDay];

  // Check if it's a weekday or weekend
  const isWeekend = fullDayName === "saturday" || fullDayName === "sunday";
  const schedule = isWeekend
    ? business.weekendSchedule
    : business.weekdaySchedule;
  const daySchedule = schedule[fullDayName as keyof typeof schedule];

  if (!daySchedule?.isOpen) {
    return { isOpen: false, message: "Closed today" };
  }

  const openTime = daySchedule.open;
  const closeTime = daySchedule.close;

  if (currentTime >= openTime && currentTime <= closeTime) {
    return { isOpen: true, message: `Open until ${formatTime(closeTime)}` };
  } else if (currentTime < openTime) {
    return { isOpen: false, message: `Opens at ${formatTime(openTime)}` };
  } else {
    return { isOpen: false, message: "Closed" };
  }
}

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const businessId = params.id as string;

  useEffect(() => {
    async function fetchBusiness() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/businesses/${businessId}/preview`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Business not found");
          } else {
            setError("Failed to load business");
          }
          return;
        }

        const data = await response.json();
        setBusiness(data.business);
      } catch (err) {
        console.error("Failed to fetch business:", err);
        setError("Failed to load business");
      } finally {
        setIsLoading(false);
      }
    }

    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading business preview...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Preview Not Available
          </h2>
          <p className="text-gray-600 mb-4">{error || "Business not found"}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const currentStatus = getCurrentStatus(business);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Preview Mode
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">{business.name}</h1>
                  <p className="text-blue-100 mb-3">{business.category}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.8 (127 reviews)</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        currentStatus.isOpen ? "text-green-200" : "text-red-200"
                      }`}
                    >
                      {currentStatus.isOpen ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span>{currentStatus.message}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About This Business</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {business.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="capitalize">
                    {business.offeringType}
                  </Badge>
                  <Badge variant="outline">{business.category}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Weekdays */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-3">
                      Weekdays
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(business.weekdaySchedule).map(
                        ([day, schedule]: [string, any]) => (
                          <div
                            key={day}
                            className="flex justify-between items-center py-1"
                          >
                            <span className="capitalize text-sm">{day}</span>
                            <span className="text-sm text-gray-600">
                              {schedule.isOpen
                                ? `${formatTime(schedule.open)} - ${formatTime(
                                    schedule.close
                                  )}`
                                : "Closed"}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Weekends */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-3">
                      Weekends
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(business.weekendSchedule).map(
                        ([day, schedule]: [string, any]) => (
                          <div
                            key={day}
                            className="flex justify-between items-center py-1"
                          >
                            <span className="capitalize text-sm">{day}</span>
                            <span className="text-sm text-gray-600">
                              {schedule.isOpen
                                ? `${formatTime(schedule.open)} - ${formatTime(
                                    schedule.close
                                  )}`
                                : "Closed"}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Holiday Hours */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Holiday Hours</span>
                      <span className="text-sm text-gray-600">
                        {business.holidayHours.isOpen
                          ? `${formatTime(
                              business.holidayHours.open
                            )} - ${formatTime(business.holidayHours.close)}`
                          : "Closed on holidays"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Customer Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">4.8</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        127 reviews
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-3">{rating}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{
                                  width: `${
                                    rating === 5
                                      ? 70
                                      : rating === 4
                                      ? 20
                                      : rating === 3
                                      ? 5
                                      : rating === 2
                                      ? 3
                                      : 2
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-gray-500 w-8">
                              {rating === 5
                                ? 89
                                : rating === 4
                                ? 25
                                : rating === 3
                                ? 8
                                : rating === 2
                                ? 3
                                : 2}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Sample Reviews */}
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-3 w-3 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">Sarah M.</span>
                        <span className="text-sm text-gray-500">
                          2 days ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        "Excellent service! The team was professional and
                        delivered exactly what we needed. Highly recommend!"
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-3 w-3 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">John K.</span>
                        <span className="text-sm text-gray-500">
                          1 week ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        "Great experience from start to finish. Will definitely
                        use their services again."
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{business.phone}</p>
                      <p className="text-sm text-gray-500">Phone</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{business.email}</p>
                      <p className="text-sm text-gray-500">Email</p>
                    </div>
                  </div>

                  {business.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-blue-600 hover:underline cursor-pointer">
                          Visit Website
                        </p>
                        <p className="text-sm text-gray-500">Website</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{business.address}</p>
                    <p className="text-sm text-gray-500">
                      {business.subCounty}, {business.county}
                    </p>
                    <p className="text-sm text-gray-500">{business.country}</p>
                    {business.pin && (
                      <p className="text-sm text-gray-500">
                        PIN: {business.pin}
                      </p>
                    )}
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Business Type</span>
                  <span className="text-sm font-medium capitalize">
                    {business.offeringType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm font-medium">
                    {business.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Location</span>
                  <span className="text-sm font-medium">{business.county}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Established</span>
                  <span className="text-sm font-medium">
                    {new Date(business.createdAt).getFullYear()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
