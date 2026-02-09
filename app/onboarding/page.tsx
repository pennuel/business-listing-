"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/navbar";
import { useSession } from "next-auth/react";
import BasicInfoForm from "./components/BasicInfoForm";
import BusinessTypeForm from "./components/BusinessTypeForm";
import LocationForm from "./components/LocationForm";
import ScheduleForm from "./components/ScheduleForm";
import PaymentInfoForm from "./components/PaymentInfoForm";
import { submitBusinessData } from "./actions";

// Scroll indicator component for mobile
function ScrollIndicator() {
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setShowIndicator(!scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 lg:hidden transition-all duration-300 ${
        showIndicator
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
        <span className="text-sm font-medium">Scroll down to continue</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}

export interface BusinessData {
  // Basic Info
  name: string;
  phone: string;
  email: string;
  website: string;

  // Business Type
  offeringType: "goods" | "services" | "";
  category: string;
  description: string;

  // Location
  country: string;
  county: string;
  subCounty: string;
  address: string;
  pin: string;

  // Schedule - Updated to support individual days
  weekdaySchedule: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
  };
  weekendSchedule: {
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  holidayHours: { open: string; close: string; isOpen: boolean };

  // Map / location helpers (optional)
  coordinates?: { lat: number; lng: number };
  formattedAddress?: string;
  placeId?: string;
}

const initialData: BusinessData = {
  name: "",
  phone: "",
  email: "",
  website: "",
  offeringType: "",
  category: "",
  description: "",
  country: "",
  county: "",
  subCounty: "",
  address: "",
  pin: "",
  weekdaySchedule: {
    monday: { open: "09:00", close: "17:00", isOpen: true },
    tuesday: { open: "09:00", close: "17:00", isOpen: true },
    wednesday: { open: "09:00", close: "17:00", isOpen: true },
    thursday: { open: "09:00", close: "17:00", isOpen: true },
    friday: { open: "09:00", close: "17:00", isOpen: true },
  },
  weekendSchedule: {
    saturday: { open: "10:00", close: "16:00", isOpen: true },
    sunday: { open: "10:00", close: "16:00", isOpen: false },
  },
  holidayHours: { open: "10:00", close: "14:00", isOpen: true },
};

const stepTitles = [
  "Basic Information",
  "Business Details",
  "Location",
  "Schedule",
  "Payment",
];

const stepDescriptions = [
  "Let's start with your basic contact information",
  "Tell us about your business offerings",
  "Where is your business located?",
  "When are you open for business?",
  "Complete your registration",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  const authLoading = status === "loading";
  const [currentStep, setCurrentStep] = useState(1);
  const [businessData, setBusinessData] = useState<BusinessData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Pre-fill email from user data
  useEffect(() => {
    if (user && typeof user.email === "string" && !businessData.email) {
      setBusinessData((prev) => ({ ...prev, email: user.email as string }));
    }
  }, [user, businessData.email]);

  // If the user already has a business, prefill the form for editing.
  useEffect(() => {
    let mounted = true;
    const fetchExisting = async () => {
      try {
        if (!user?.email) return;
        const res = await fetch(`/api/businesses?email=${encodeURIComponent(
          user.email
        )}`);
        if (!res.ok) return;
        const json = await res.json();
        const businesses = json.businesses || json.businesses || json.businesses;
        if (!mounted || !businesses || businesses.length === 0) return;

        // Use the first business as the one to edit
        const b = businesses[0];

        // Map API fields to BusinessData shape
        const mapped = {
          name: b.name ?? "",
          phone: b.phone ?? "",
          email: b.email ?? "",
          website: b.website ?? "",
          offeringType: b.offeringType ?? "",
          category: b.category ?? "",
          description: b.description ?? "",
          country: b.country ?? "",
          county: b.county ?? "",
          subCounty: b.subCounty ?? "",
          address: b.address ?? "",
          pin: b.pin ?? "",
          weekdaySchedule: b.weekdaySchedule ?? b.schedule ?? initialData.weekdaySchedule,
          weekendSchedule: b.weekendSchedule ?? initialData.weekendSchedule,
          holidayHours: b.holidayHours ?? initialData.holidayHours,
          coordinates: b.coordinates,
          formattedAddress: b.formattedAddress,
          placeId: b.placeId,
        };

        setBusinessData((prev) => ({ ...prev, ...mapped }));
      } catch (err) {
        console.error("Failed to fetch existing business for edit:", err);
      }
    };

    fetchExisting();

    return () => {
      mounted = false;
    };
  }, [user]);

  const updateBusinessData = (data: Partial<BusinessData>) => {
    setBusinessData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    console.log("Starting form submission...");
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log("Business data to submit:", businessData);
      const result = await submitBusinessData({
        ...businessData,
        userId: user?.id,
      });

      if (result.success) {
        console.log("Form submission completed successfully");

        // Start transition animation
        setIsTransitioning(true);

        // Wait for animation to complete before redirecting
        setTimeout(() => {
          router.push("/dashboard?registration=complete");
        }, 1500);
      } else {
        console.error("Form submission failed:", result.error);
        setSubmitError(result.error || "An unexpected error occurred");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const renderLeftContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Business Platform
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Let's get your business listed and help you reach more
                customers. We'll start with some basic information about you and
                your business.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">
                Why provide this information?
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Customers can easily contact your business</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Build trust with verified contact details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Improve your search ranking</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">
                What happens next?
              </h3>
              <p className="text-gray-600">
                After completing all steps, your business will be reviewed and
                published on our platform within 24 hours.
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tell Us About Your Business
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Help customers understand what you offer by providing details
                about your business type and services.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">
                Business Categories
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-green-800">
                <div>
                  <h4 className="font-medium mb-2">Goods</h4>
                  <ul className="space-y-1">
                    <li>• Electronics</li>
                    <li>• Clothing</li>
                    <li>• Food & Beverages</li>
                    <li>• Home & Garden</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Services</h4>
                  <ul className="space-y-1">
                    <li>• Professional Services</li>
                    <li>• Health & Medical</li>
                    <li>• Education</li>
                    <li>• Home Services</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-3">Pro Tip</h3>
              <p className="text-yellow-800">
                A detailed description helps customers find you more easily and
                understand what makes your business unique.
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Where Are You Located?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Help customers find your business by providing your general
                location information.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-3">
                Location Benefits
              </h3>
              <ul className="space-y-2 text-purple-800">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Appear in local search results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Get directions from customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Show up on map searches</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Next Step</h3>
              <p className="text-gray-600">
                After providing your general location, you'll be able to set
                your business hours and complete your registration.
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                When Are You Open?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Let customers know when they can visit or contact your business.
              </p>
            </div>

            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-3">
                Why Business Hours Matter
              </h3>
              <ul className="space-y-2 text-indigo-800">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Customers know when to visit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Reduce unnecessary calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Show up in "open now" searches</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">
                Schedule Types
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Weekdays</span>
                  <span>Monday - Friday</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Weekends</span>
                  <span>Saturday - Sunday</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Holidays</span>
                  <span>Special occasions</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                You're Almost Done!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Complete your registration to get your business listed and start
                reaching more customers.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">
                What You Get
              </h3>
              <ul className="space-y-2 text-green-800">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Professional business listing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Customer inquiry management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Analytics and insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Mobile-optimized presence</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Next Steps</h3>
              <p className="text-blue-800">
                After registration, you'll be redirected to your dashboard where
                you can manage your listing and track performance.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoForm
            data={businessData}
            onUpdate={updateBusinessData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <BusinessTypeForm
            data={businessData}
            onUpdate={updateBusinessData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <LocationForm
            data={businessData}
            onUpdate={updateBusinessData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <ScheduleForm
            data={businessData}
            onUpdate={updateBusinessData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <PaymentInfoForm
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 transition-all duration-1500 ${
        isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <Navbar />

      {isTransitioning && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Registration Complete!
            </h3>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </div>
        </div>
      )}

      <ScrollIndicator />

      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden">
          {/* Information Section - Mobile */}
          <div className="bg-white p-6 border-b border-gray-200">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  {stepTitles[currentStep - 1]}
                </h3>
                <span className="text-sm text-gray-500">
                  {currentStep} of {totalSteps}
                </span>
              </div>
              <Progress value={progress} className="w-full mb-3" />
              <p className="text-gray-600 text-sm">
                {stepDescriptions[currentStep - 1]}
              </p>
            </div>

            {/* Condensed info for mobile */}
            <div className="space-y-4">
              {currentStep === 1 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Quick Setup
                  </h4>
                  <p className="text-blue-800 text-sm">
                    We'll help you get listed in just 5 simple steps.
                  </p>
                </div>
              )}
              {currentStep === 2 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    Business Type
                  </h4>
                  <p className="text-green-800 text-sm">
                    Choose whether you sell goods or provide services.
                  </p>
                </div>
              )}
              {currentStep === 3 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Location</h4>
                  <p className="text-purple-800 text-sm">
                    Help customers find you with accurate location details.
                  </p>
                </div>
              )}
              {currentStep === 4 && (
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-900 mb-2">
                    Business Hours
                  </h4>
                  <p className="text-indigo-800 text-sm">
                    Set your operating hours for customers.
                  </p>
                </div>
              )}
              {currentStep === 5 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    Almost Done!
                  </h4>
                  <p className="text-green-800 text-sm">
                    Complete registration to go live.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Section - Mobile */}
          <div className="bg-gray-50 p-6 min-h-[60vh]">
            <Card className="w-full">
              <CardContent className="p-6">
                {submitError && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{submitError}</p>
                  </div>
                )}

                {renderCurrentForm()}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">
          {/* Left Half - Information */}
          <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
            {renderLeftContent()}
          </div>

          {/* Right Half - Form */}
          <div className="bg-gray-50 p-8 lg:p-12 flex flex-col justify-center">
            <Card className="w-full max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">
                      {stepTitles[currentStep - 1]}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {currentStep} of {totalSteps}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {stepDescriptions[currentStep - 1]}
                  </p>
                  <Progress value={progress} className="w-full" />
                </div>

                {submitError && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{submitError}</p>
                  </div>
                )}

                {renderCurrentForm()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
