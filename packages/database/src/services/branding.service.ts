import {
  brandingRepository,
  BrandingItem,
} from "../repositories/branding.repository";

export class BrandingService {
  /** Add a gallery image URL to a business */
  async addImage(
    businessId: string | number,
    mediaUrl: string,
    link?: string,
  ): Promise<BrandingItem> {
    return await brandingRepository.addBranding(businessId, mediaUrl, link);
  }

  /** Get all gallery images for a business */
  async getGallery(businessId: string | number): Promise<BrandingItem[]> {
    return await brandingRepository.getByBusiness(businessId);
  }

  /** Delete a gallery image */
  async deleteImage(brandId: string | number): Promise<void> {
    return await brandingRepository.deleteBranding(brandId);
  }
}

export const brandingService = new BrandingService();
