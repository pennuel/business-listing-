"use server";

import { businessService } from "@think-id/database";
import { revalidatePath } from "next/cache";

import { normalizeBusiness } from "@/lib/utils/normalize";
export async function toggleStoreStatus(businessId: string, isOpen: boolean) {
  try {
    const updated = await businessService.updateBusiness(businessId, {
      isManuallyOpen: isOpen,
    });
    revalidatePath("/dashboard");
    revalidatePath(`/window/${businessId}`);
    return { success: true, business: updated };
  } catch (error) {
    console.error("Failed to toggle store status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function updateBusinessProfile(businessId: string, data: any) {
  try {
    // Collect only the fields that are present in data to avoid overwriting with undefined
    const updateData: any = {};
    if (data.name !== undefined) updateData.businessName = data.name;
    if (data.tagline !== undefined) updateData.tagline = data.tagline;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.phone !== undefined) updateData.phoneNumber = data.phone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.website !== undefined) updateData.website = data.website;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
    if (data.amenities !== undefined) updateData.amenities = data.amenities;
    if (data.gallery !== undefined) updateData.gallery = data.gallery;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.county !== undefined) updateData.county = data.county;
    if (data.subCounty !== undefined) updateData.subCounty = data.subCounty;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.pin !== undefined) updateData.pin = data.pin;
    if (data.weekdaySchedule !== undefined)
      updateData.weekdaySchedule = data.weekdaySchedule;
    if (data.weekendSchedule !== undefined)
      updateData.weekendSchedule = data.weekendSchedule;
    if (data.schedule !== undefined) updateData.schedule = data.schedule;

    const updated = await businessService.updateBusiness(
      businessId,
      updateData,
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath(`/window/${businessId}`);

    return { success: true, business: updated };
  } catch (error) {
    console.error("Failed to update business profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function getBusinessByIdAction(id: string) {
  try {
    const business = await businessService.getBusinessById(id);
    console.log("Fetched business (raw):", business);
    const normalized = business ? normalizeBusiness(business) : null;
    return { success: true, business: normalized };
  } catch (error) {
    console.error("Failed to fetch business:", error);
    return { success: false, error: "Failed to fetch business" };
  }
}

export async function getBusinessesByUserIdAction(userId: string) {
  try {
    // Fetch directly - TanStack Query on client will handle caching
    const businesses = await businessService.getBusinessesByUserId(userId);

    // Normalize all businesses to camelCase
    const normalizedBusinesses = (businesses || []).map((b) => {
      const normalized = normalizeBusiness(b);
      console.log(
        `Normalized business: id=${normalized.id}, name=${normalized.name}`,
      );
      return normalized;
    });

    console.log("Normalized businesses count:", normalizedBusinesses.length);
    return { success: true, businesses: normalizedBusinesses };
  } catch (error) {
    console.error("Failed to fetch businesses:", error);
    return { success: false, error: "Failed to fetch businesses" };
  }
}
