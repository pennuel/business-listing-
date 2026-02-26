// Normalize a single service from backend field names → app field names
export function normalizeService(s: any) {
  return {
    ...s,
    id: (s.serviceId ?? s.id)?.toString(),
    name: s.serviceName ?? s.name,
    description: s.serviceDescription ?? s.description ?? null,
    price: s.costing != null ? Number(s.costing) : (s.price ?? 0),
    currency: s.currency ?? "KES",
    duration: s.duration ?? null,
  };
}

// Normalize API camelCase response to our app's expected field names.
// The backend is a Java Spring API that returns camelCase (bizId, businessName, phoneNumber…).
export function normalizeBusiness(business: any) {
  if (!business) return null;

  return {
    // Spread original API response first so all original fields are present
    ...business,
    // Then remap the fields whose names differ — these MUST win over the spread above
    id: (business.bizId ?? business.biz_id ?? business.id)?.toString(),
    name: business.businessName ?? business.business_name ?? business.name,
    phone: business.phoneNumber ?? business.phone_number ?? business.phone,
    subCounty: business.subCounty ?? business.sub_county,
    coverImage: business.coverImage ?? business.cover_image,
    isManuallyOpen: business.isManuallyOpen ?? business.is_manually_open,
    weekdaySchedule: business.schedule?.weekday ?? business.weekdaySchedule,
    weekendSchedule: business.schedule?.weekend ?? business.weekendSchedule,
    createdAt: business.createdAt ?? business.created_at,
    updatedAt: business.updatedAt ?? business.updated_at,
    // Normalize nested services array
    services: Array.isArray(business.services)
      ? business.services.map(normalizeService)
      : [],
    // Merge gallery strings + branding objects into one unified gallery array
    // branding[] = { brandId, mediaUrl, link } from the Branding table
    // gallery[] = plain strings stored directly on BusinessInfo
    branding: Array.isArray(business.branding)
      ? business.branding.map((b: any) => ({
          brandId: b.brandId ?? b.brand_id,
          mediaUrl: b.mediaUrl ?? b.media_url ?? null,
          link: b.link ?? null,
        }))
      : [],
    gallery: [
      ...(Array.isArray(business.gallery) ? business.gallery : []),
      ...(Array.isArray(business.branding)
        ? business.branding
            .map((b: any) => b.mediaUrl ?? b.media_url)
            .filter(Boolean)
        : []),
    ],
  };
}
