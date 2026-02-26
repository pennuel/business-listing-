"use server";

import { brandingService } from "@think-id/database";
import { revalidatePath } from "next/cache";

export async function addBrandingImage(
  businessId: string,
  mediaUrl: string,
  link?: string,
) {
  try {
    const image = await brandingService.addImage(businessId, mediaUrl, link);
    revalidatePath(`/dashboard/profile?businessId=${businessId}`);
    revalidatePath(`/dashboard?businessId=${businessId}`);
    revalidatePath(`/window/${businessId}`);
    return { success: true, image };
  } catch (error) {
    console.error("Error adding branding image:", error);
    return { success: false, error: "Failed to add image" };
  }
}

export async function deleteBrandingImage(businessId: string, brandId: string) {
  try {
    await brandingService.deleteImage(brandId);
    revalidatePath(`/dashboard/profile?businessId=${businessId}`);
    revalidatePath(`/dashboard?businessId=${businessId}`);
    revalidatePath(`/window/${businessId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting branding image:", error);
    return { success: false, error: "Failed to delete image" };
  }
}

export async function getBrandingGallery(businessId: string) {
  try {
    const images = await brandingService.getGallery(businessId);
    return { success: true, images };
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return { success: false, error: "Failed to fetch gallery", images: [] };
  }
}
