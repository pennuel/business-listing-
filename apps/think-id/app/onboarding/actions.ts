"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { database } from "@think-id/database";
import type { BusinessData } from "./page";
import { BusinessInfoRequest, BusinessInfo } from "@think-id/types";

export async function submitBusinessData(
  businessData: BusinessData & { userId?: string }
) {
  console.log("Starting business data submission...");

  // Validate the data server-side
  if (!businessData.name?.trim()) {
    return { success: false, error: "Business name is required" };
  }

  if (!businessData.email?.trim()) {
    return { success: false, error: "Email is required" };
  }

  if (!businessData.phone?.trim()) {
    return { success: false, error: "Phone number is required" };
  }

  if (!businessData.offeringType) {
    return { success: false, error: "Business type is required" };
  }

  if (!businessData.category?.trim()) {
    return { success: false, error: "Business category is required" };
  }

  if (!businessData.country?.trim()) {
    return { success: false, error: "Country is required" };
  }

  if (!businessData.county?.trim()) {
    return { success: false, error: "County is required" };
  }

  if (!businessData.address?.trim()) {
    return { success: false, error: "Address is required" };
  }


  try {
    // fetch the session to get user information
    const session = await getServerSession(authOptions);

    const payload: BusinessInfoRequest = {
      // Basic Information
      businessName: businessData.name.trim(),
      phoneNumber: businessData.phone.trim(),
      email: businessData.email.trim(),
      website: businessData.website?.trim() || "",

      // Business Type/Description
      description: businessData.description?.trim() || "",
      categoryId: businessData.categoryId,

      // Location
      country: businessData.country.trim(),
      county: businessData.county.trim(),
      subCounty: businessData.subCounty?.trim() || "",
      address: businessData.address.trim(),
      pin: businessData.pin?.trim() || undefined,
      // Full location helpers
      formattedAddress: businessData.formattedAddress || undefined,
      latitude: businessData.coordinates?.lat,
      longitude: businessData.coordinates?.lng,
      placeId: businessData.placeId || undefined,

      // Schedule - Format it correctly for the new nested structure
      schedule: {
        weekday: Object.fromEntries(
          Object.entries(businessData.weekdaySchedule).map(([day, hrs]) => [
            day.charAt(0).toUpperCase() + day.slice(1),
            hrs.isOpen ? `${hrs.open} - ${hrs.close}` : "Closed",
          ])
        ),
        weekend: Object.fromEntries(
          Object.entries(businessData.weekendSchedule).map(([day, hrs]) => [
            day.charAt(0).toUpperCase() + day.slice(1),
            hrs.isOpen ? `${hrs.open} - ${hrs.close}` : "Closed",
          ])
        ),
        holiday: {
          "Default Holiday": businessData.holidayHours.isOpen
            ? `${businessData.holidayHours.open} - ${businessData.holidayHours.close}`
            : "Closed",
        },
      },
    };

    console.log("Payload prepared for business creation/update:", payload);
    let business: BusinessInfo;
    if (businessData.id) {
       console.log("Updating existing business:", businessData.id);
       business = await database.businesses.updateBusiness(businessData.id, payload);
    } else {
      // For creation, add the user ID if available
      const createData: BusinessInfoRequest = {
        ...payload,
        userId: (session?.user as any)?.id || undefined,
      };
      
      business = await database.businesses.createBusiness(createData);
    }

    const businessId = business.bizId?.toString() || (business as any).id || "";
    console.log("Business operation successful:", businessId);
    
    // Return success and let the client handle the redirect
    return { success: true, businessId };
  } catch (error) {
    console.error("Business operation failed:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to process business",
    };
  }
}

// Helper function to get business by ID
export async function getBusinessById(id: string) {
  try {
    return await database.getBusinessById(id);
  } catch (error) {
    console.error("Failed to get business by ID:", error);
    return null;
  }
}

// Helper function to get businesses by email
export async function getBusinessesByEmail(email: string) {
  try {
    return await database.getBusinessesByEmail(email);
  } catch (error) {
    console.error("Failed to get businesses by email:", error);
    return [];
  }
}

// Helper function to update business status
export async function updateBusinessStatus(id: string, status: string) {
  try {
    return await database.updateBusiness(id, { status });
  } catch (error) {
    console.error("Failed to update business status:", error);
    return null;
  }
}

// Category related functions
export async function getCategories() {
  try {
    const result = await database.categories.getCategories({ size: 100 });
    return result.categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
