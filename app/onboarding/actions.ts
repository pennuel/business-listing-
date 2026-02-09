"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { businessService } from "@/lib/database/services/business.service";
import { database } from "@/lib/database";
import type { BusinessData } from "./page";

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

  console.log("Validation passed, attempting to save business data...");

  console.log("Business data:", businessData);

  try {
    // fetch the session to get user information
    const session = await getServerSession(authOptions);

    // Prepare the payload for business creation
    const payload = {
      // Basic Information
      name: businessData.name.trim(),
      phone: businessData.phone.trim(),
      email: businessData.email.trim(),
      website: businessData.website?.trim() || "",

      // Business Type
      offeringType: businessData.offeringType,
      category: businessData.category.trim(),
      description: businessData.description?.trim() || "",

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

      // Schedule - Store as JSON
      weekdaySchedule: businessData.weekdaySchedule,
      weekendSchedule: businessData.weekendSchedule,
      holidayHours: businessData.holidayHours,
    };

    let business;
    if (session?.user?.email) {
      business = await businessService.createBusiness({
        ...payload,
        userEmail: session.user.email,
      });
    } else {
      business = await database.createBusiness({
        ...payload,
        userId: businessData.userId || "user-1",
      });
    }

    console.log("Business created successfully:", business.id);

    // Return success and let the client handle the redirect
    return { success: true, businessId: business.id };
  } catch (error) {
    console.error("Business creation failed:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create business",
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
