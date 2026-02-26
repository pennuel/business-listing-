import { apiRequest } from "../api-client";

export interface BrandingItem {
  brandId: number;
  mediaUrl: string | null;
  link: string | null;
}

export class BrandingRepository {
  /** Add a gallery image to a business */
  async addBranding(
    businessId: string | number,
    mediaUrl: string,
    link?: string,
  ): Promise<BrandingItem> {
    return await apiRequest<BrandingItem>("/api/branding/addBranding", "POST", {
      businessId: Number(businessId),
      mediaUrl,
      link: link ?? null,
    });
  }

  /** Get all gallery images for a business */
  async getByBusiness(businessId: string | number): Promise<BrandingItem[]> {
    return await apiRequest<BrandingItem[]>(
      `/api/branding/business/${businessId}`,
      "GET",
    );
  }

  /** Delete a gallery image by its brandId */
  async deleteBranding(brandId: string | number): Promise<void> {
    await apiRequest<void>(`/api/branding/${brandId}`, "DELETE");
  }
}

export const brandingRepository = new BrandingRepository();
