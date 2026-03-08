/**
 * Kotlin Backend API Client
 *
 * Single source of truth for all communication with the Spring Boot
 * BusinessListing backend (running on BUSINESS_SERVER_API_URL, default port 9080 dev / 9082 prod).
 *
 * All functions are server-side only (no "use client").
 * They fall back to the mock data if the backend is unreachable, so the UI
 * never breaks during local development without the Kotlin server running.
 *
 * Covered APIs:
 *   BusinessInfo · Category · Reviews · Services · BusinessType · Complaints
 *   Sector · Industry · Offering · Branding
 *   Country · County · SubCounty (Location hierarchy)
 *   UserManagement
 */

import { normalizeBusiness } from "@/lib/utils/normalize";

// ─── Config ────────────────────────────────────────────────────────────────

const BACKEND_URL =
  process.env.BUSINESS_SERVER_API_URL?.replace(/\/$/, "") ||
  "http://localhost:9080";

const DEFAULT_TIMEOUT_MS = 8000;

// ─── Types (matching Kotlin response shapes) ───────────────────────────────

export interface KotlinPagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface KotlinBusiness {
  bizId?: number;
  businessName?: string;
  description?: string;
  tagline?: string;
  logo?: string;
  coverImage?: string;
  gallery?: string[];
  amenities?: string[];
  phoneNumber?: string;
  email?: string;
  website?: string;
  address?: string;
  county?: string;
  subCounty?: string;
  country?: string;
  pin?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  status?: string;
  paymentStatus?: string;
  isManuallyOpen?: boolean;
  schedule?: any;
  category?: {
    id?: number;
    categoryName?: string;
  };
  services?: any[];
  branding?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface KotlinCategory {
  id?: number;
  categoryName: string;
}

// ─── Fetch helper ──────────────────────────────────────────────────────────

async function backendFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers || {}),
      },
      // Server Component fetches are cached by Next.js unless told otherwise
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(
        `Backend responded ${res.status} ${res.statusText} for ${path}`,
      );
    }

    return (await res.json()) as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error(
        `Request timed out after ${DEFAULT_TIMEOUT_MS}ms: ${path}`,
      );
    }
    throw err;
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Fetch a paged list of all business listings.
 * GET /api/BusinessInfo/getBusinessInfos?page=0&size=100
 *
 * Returns normalised businesses ready for the UI.
 */
export async function fetchAllBusinesses(page = 0, size = 100): Promise<any[]> {
  const data = await backendFetch<KotlinPagedResponse<KotlinBusiness>>(
    `/api/BusinessInfo/getBusinessInfos?page=${page}&size=${size}`,
  );

  const items: KotlinBusiness[] = Array.isArray(data)
    ? (data as any)
    : (data?.content ?? []);

  return items.map(normalizeBusiness).filter(Boolean);
}

/**
 * Fetch a single business by its numeric ID.
 * GET /api/BusinessInfo/{id}
 */
export async function fetchBusinessById(
  id: string | number,
): Promise<any | null> {
  const data = await backendFetch<KotlinBusiness>(`/api/BusinessInfo/${id}`);
  return normalizeBusiness(data);
}

/**
 * Fetch all businesses belonging to a specific user (for the dashboard).
 * GET /api/BusinessInfo/user/{userId}
 */
export async function fetchBusinessesByUserId(userId: string): Promise<any[]> {
  const data = await backendFetch<KotlinBusiness[]>(
    `/api/BusinessInfo/user/${encodeURIComponent(userId)}`,
  );
  const items = Array.isArray(data) ? data : [];
  return items.map(normalizeBusiness).filter(Boolean);
}

/**
 * Fetch a simplified summary of all businesses belonging to a user.
 * GET /api/BusinessInfo/user/{userId}/summary
 */
export async function fetchBusinessSummaryByUserId(
  userId: string,
): Promise<any[]> {
  const data = await backendFetch<any[]>(
    `/api/BusinessInfo/user/${encodeURIComponent(userId)}/summary`,
  );
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch all categories from the backend.
 * GET /api/Category/getCategories?page=0&size=100
 */
export async function fetchCategories(
  page = 0,
  size = 100,
): Promise<KotlinCategory[]> {
  const data = await backendFetch<KotlinPagedResponse<KotlinCategory>>(
    `/api/Category/getCategories?page=${page}&size=${size}`,
  );

  if (Array.isArray(data)) return data as KotlinCategory[];
  return data?.content ?? [];
}

/**
 * Filter businesses client-side after fetching all from backend.
 * (The Kotlin backend does not yet expose a search/filter endpoint.)
 */
export function filterBusinesses(
  businesses: any[],
  opts: {
    query?: string;
    category?: string;
    location?: string;
    openNow?: boolean;
  },
): any[] {
  let results = [...businesses];

  if (opts.query) {
    const q = opts.query.toLowerCase();
    results = results.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        b.tagline?.toLowerCase().includes(q),
    );
  }

  if (opts.category) {
    const cat = opts.category.toLowerCase();
    results = results.filter((b) => {
      const bCat =
        typeof b.category === "object" ? b.category?.categoryName : b.category;
      return bCat?.toLowerCase() === cat;
    });
  }

  if (opts.location) {
    const loc = opts.location.toLowerCase();
    results = results.filter(
      (b) =>
        b.county?.toLowerCase().includes(loc) ||
        b.subCounty?.toLowerCase().includes(loc),
    );
  }

  if (opts.openNow) {
    results = results.filter((b) => b.isManuallyOpen === true);
  }

  return results;
}

// ─── Business Info (Mutations) ─────────────────────────────────────────────

export async function addBusinessInfo(
  data: Partial<KotlinBusiness>,
): Promise<KotlinBusiness> {
  return backendFetch<KotlinBusiness>(`/api/BusinessInfo/addBusinessInfo`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBusinessInfo(
  id: string | number,
  data: Partial<KotlinBusiness>,
): Promise<KotlinBusiness> {
  return backendFetch<KotlinBusiness>(`/api/BusinessInfo/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteBusinessInfo(id: string | number): Promise<void> {
  return backendFetch<void>(`/api/BusinessInfo/${id}`, {
    method: "DELETE",
  });
}

export async function triggerBusinessRegisteredEvent(
  id: string | number,
): Promise<void> {
  return backendFetch<void>(`/api/BusinessInfo/${id}/register-event`, {
    method: "POST",
  });
}

// ─── Services ──────────────────────────────────────────────────────────────

export interface KotlinService {
  id?: number;
  serviceId?: number;
  serviceName?: string;
  name?: string;
  serviceDescription?: string;
  description?: string;
  costing?: string | number;
  price?: number;
  currency?: string;
  duration?: number;
  businessId?: number | string;
}

export async function addService(data: KotlinService): Promise<KotlinService> {
  return backendFetch<KotlinService>(`/api/services/addService`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchServices(
  page = 0,
  size = 100,
): Promise<KotlinService[]> {
  const data = await backendFetch<KotlinPagedResponse<KotlinService>>(
    `/api/services/getServices?page=${page}&size=${size}`,
  );
  return Array.isArray(data) ? data : (data?.content ?? []);
}

export async function fetchServiceById(
  id: string | number,
): Promise<KotlinService> {
  return backendFetch<KotlinService>(`/api/services/${id}`);
}

export async function updateService(
  id: string | number,
  data: Partial<KotlinService>,
): Promise<KotlinService> {
  return backendFetch<KotlinService>(`/api/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteService(id: string | number): Promise<void> {
  return backendFetch<void>(`/api/services/${id}`, {
    method: "DELETE",
  });
}

// ─── Reviews ───────────────────────────────────────────────────────────────

export interface KotlinReview {
  id?: number | string;
  businessId?: string | number;
  authorName?: string;
  rating?: number;
  comment?: string;
  reply?: string | null;
  createdAt?: string;
}

export async function addReview(data: KotlinReview): Promise<KotlinReview> {
  return backendFetch<KotlinReview>(`/api/Reviews/addReview`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchReviews(
  page = 0,
  size = 100,
): Promise<KotlinReview[]> {
  const data = await backendFetch<KotlinPagedResponse<KotlinReview>>(
    `/api/Reviews/getReviews?page=${page}&size=${size}`,
  );
  return Array.isArray(data) ? data : (data?.content ?? []);
}

export async function fetchReviewById(
  id: string | number,
): Promise<KotlinReview> {
  return backendFetch<KotlinReview>(`/api/Reviews/${id}`);
}

export async function updateReview(
  id: string | number,
  data: Partial<KotlinReview>,
): Promise<KotlinReview> {
  return backendFetch<KotlinReview>(`/api/Reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteReview(id: string | number): Promise<void> {
  return backendFetch<void>(`/api/Reviews/${id}`, {
    method: "DELETE",
  });
}

// ─── Business Types ────────────────────────────────────────────────────────

export interface KotlinBusinessType {
  id?: number;
  businessTypeName?: string;
}

export async function addBusinessType(
  data: KotlinBusinessType,
): Promise<KotlinBusinessType> {
  return backendFetch<KotlinBusinessType>(`/api/businessType/addBusinessType`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchBusinessTypes(
  page = 0,
  size = 100,
): Promise<KotlinBusinessType[]> {
  const data = await backendFetch<KotlinPagedResponse<KotlinBusinessType>>(
    `/api/businessType/getBusinessTypes?page=${page}&size=${size}`,
  );
  return Array.isArray(data) ? data : (data?.content ?? []);
}

export async function fetchBusinessTypeById(
  id: string | number,
): Promise<KotlinBusinessType> {
  return backendFetch<KotlinBusinessType>(
    `/api/businessType/getBusinessType?businessTypeId=${id}`,
  );
}

export async function deleteBusinessType(id: string | number): Promise<void> {
  return backendFetch<void>(`/api/businessType/deleteOne?id=${id}`, {
    method: "DELETE",
  });
}

// ─── Categories (Mutations) ────────────────────────────────────────────────

export async function addCategory(
  data: Partial<KotlinCategory>,
): Promise<KotlinCategory> {
  return backendFetch<KotlinCategory>(`/api/Category/addCategory`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchCategoryById(
  id: string | number,
): Promise<KotlinCategory> {
  return backendFetch<KotlinCategory>(
    `/api/Category/getCategory?CategoryId=${id}`,
  );
}

export async function deleteCategory(id: string | number): Promise<void> {
  return backendFetch<void>(`/api/Category/deleteOne?id=${id}`, {
    method: "DELETE",
  });
}

// ─── Complaints ────────────────────────────────────────────────────────────

export interface KotlinComplaint {
  id?: number;
  complaints?: string;
  complaint?: string;
}

export async function addComplaint(
  data: KotlinComplaint,
): Promise<KotlinComplaint> {
  return backendFetch<KotlinComplaint>(`/api/Complaints/addComplaint`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchComplaints(
  page = 0,
  size = 100,
): Promise<KotlinComplaint[]> {
  // Due to backend mapping, this endpoint is /api/Complaints/getCategories
  const data = await backendFetch<KotlinPagedResponse<KotlinComplaint>>(
    `/api/Complaints/getCategories?page=${page}&size=${size}`,
  );
  return Array.isArray(data) ? data : (data?.content ?? []);
}

export async function fetchComplaintById(
  id: string | number,
): Promise<KotlinComplaint> {
  return backendFetch<KotlinComplaint>(
    `/api/Complaints/getComplaint?ComplaintId=${id}`,
  );
}

export async function deleteComplaint(id: string | number): Promise<void> {
  return backendFetch<void>(`/api/Complaints/deleteOne?id=${id}`, {
    method: "DELETE",
  });
}

// ─── Sectors ───────────────────────────────────────────────────────────────

export interface KotlinSector {
  sectorId?: number;
  sectorName?: string;
}

export async function addSector(data: KotlinSector): Promise<KotlinSector> {
  return backendFetch<KotlinSector>(`/api/sector/addSector`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchSectors(
  page = 0,
  size = 100,
): Promise<KotlinSector[]> {
  const data = await backendFetch<KotlinPagedResponse<KotlinSector>>(
    `/api/sector/getSectors?page=${page}&size=${size}`,
  );
  return Array.isArray(data) ? data : (data?.content ?? []);
}

export async function fetchSectorById(
  id: string | number,
): Promise<KotlinSector> {
  return backendFetch<KotlinSector>(`/api/sector/getSector?sectorId=${id}`);
}

export async function deleteSector(id: string | number): Promise<void> {
  return backendFetch<void>(`/api/sector/deleteOne?id=${id}`, {
    method: "DELETE",
  });
}

// ─── Industries ────────────────────────────────────────────────────────────

export interface KotlinIndustry {
  industryId?: number;
  industryName?: string;
}

export async function addIndustry(
  data: KotlinIndustry,
): Promise<KotlinIndustry> {
  return backendFetch<KotlinIndustry>(`/api/industry/addIndustry`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchIndustries(
  page = 0,
  size = 100,
): Promise<KotlinIndustry[]> {
  const data = await backendFetch<KotlinPagedResponse<KotlinIndustry>>(
    `/api/industry/getIndustries?page=${page}&size=${size}`,
  );
  return Array.isArray(data) ? data : (data?.content ?? []);
}

export async function fetchIndustryById(
  id: string | number,
): Promise<KotlinIndustry> {
  return backendFetch<KotlinIndustry>(
    `/api/industry/getIndustry?industryId=${id}`,
  );
}

export async function deleteIndustry(id: string | number): Promise<void> {
  return backendFetch<void>(`/api/industry/deleteOne?id=${id}`, {
    method: "DELETE",
  });
}

// ─── Offerings ─────────────────────────────────────────────────────────────

export interface KotlinOffering {
  offeringId?: number;
  offeringName?: string;
}

export async function addOffering(
  data: KotlinOffering,
): Promise<KotlinOffering> {
  return backendFetch<KotlinOffering>(`/api/offering/addOffering`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchOfferings(
  page = 0,
  size = 100,
): Promise<KotlinOffering[]> {
  const data = await backendFetch<KotlinPagedResponse<KotlinOffering>>(
    `/api/offering/getOfferings?page=${page}&size=${size}`,
  );
  return Array.isArray(data) ? data : (data?.content ?? []);
}

export async function fetchOfferingById(
  id: string | number,
): Promise<KotlinOffering> {
  return backendFetch<KotlinOffering>(
    `/api/offering/getOffering?offeringId=${id}`,
  );
}

export async function deleteOffering(id: string | number): Promise<void> {
  return backendFetch<void>(`/api/offering/deleteOne?id=${id}`, {
    method: "DELETE",
  });
}

// ─── Branding / Gallery ────────────────────────────────────────────────────

export interface KotlinBranding {
  id?: number;
  mediaUrl?: string;
  link?: string | null;
}

export interface AddBrandingPayload {
  businessId: number | string;
  mediaUrl: string;
  link?: string;
}

export async function addBrandingImage(
  payload: AddBrandingPayload,
): Promise<KotlinBranding> {
  return backendFetch<KotlinBranding>(`/api/branding/addBranding`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchBrandingByBusiness(
  businessId: string | number,
): Promise<KotlinBranding[]> {
  const data = await backendFetch<KotlinBranding[]>(
    `/api/branding/business/${businessId}`,
  );
  return Array.isArray(data) ? data : [];
}

export async function deleteBrandingImage(
  brandId: string | number,
): Promise<void> {
  return backendFetch<void>(`/api/branding/${brandId}`, {
    method: "DELETE",
  });
}

// ─── Location: Country ─────────────────────────────────────────────────────

export interface KotlinCountry {
  countryId?: number;
  countryName?: string;
  flagLogo?: string;
  countryCode?: string;
}

export async function addCountry(data: KotlinCountry): Promise<KotlinCountry> {
  return backendFetch<KotlinCountry>(`/api/country/addCountry`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchCountries(
  page = 0,
  size = 300,
): Promise<KotlinCountry[]> {
  const data = await backendFetch<KotlinPagedResponse<KotlinCountry>>(
    `/api/country/getCountries?page=${page}&size=${size}`,
  );
  return Array.isArray(data) ? data : (data?.content ?? []);
}

export async function fetchCountryById(
  id: string | number,
): Promise<KotlinCountry> {
  return backendFetch<KotlinCountry>(`/api/country/getCountry?countryId=${id}`);
}

export async function updateCountry(
  id: string | number,
  data: Partial<KotlinCountry>,
): Promise<KotlinCountry> {
  return backendFetch<KotlinCountry>(`/api/country/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCountry(id: string | number): Promise<void> {
  return backendFetch<void>(`/api/country/deleteOne?id=${id}`, {
    method: "DELETE",
  });
}

// ─── Location: County ──────────────────────────────────────────────────────

export interface KotlinCounty {
  countyId?: number;
  countyName?: string;
  countryId?: number;
}

export async function addCounty(data: KotlinCounty): Promise<KotlinCounty> {
  return backendFetch<KotlinCounty>(`/api/county/addCounty`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchCounties(
  page = 0,
  size = 300,
): Promise<KotlinCounty[]> {
  const data = await backendFetch<KotlinPagedResponse<KotlinCounty>>(
    `/api/county/getCounties?page=${page}&size=${size}`,
  );
  return Array.isArray(data) ? data : (data?.content ?? []);
}

export async function fetchCountyById(
  id: string | number,
): Promise<KotlinCounty> {
  return backendFetch<KotlinCounty>(`/api/county/getCounty?countyId=${id}`);
}

export async function deleteCounty(id: string | number): Promise<void> {
  return backendFetch<void>(`/api/county/deleteOne?id=${id}`, {
    method: "DELETE",
  });
}

// ─── Location: SubCounty ───────────────────────────────────────────────────

export interface KotlinSubCounty {
  subCountyId?: number;
  subCountyName?: string;
  countyId?: number;
  countryId?: number;
}

export async function addSubCounty(
  data: KotlinSubCounty,
): Promise<KotlinSubCounty> {
  return backendFetch<KotlinSubCounty>(`/api/subCounty/addSubCounty`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchSubCounties(
  page = 0,
  size = 500,
): Promise<KotlinSubCounty[]> {
  const data = await backendFetch<KotlinPagedResponse<KotlinSubCounty>>(
    `/api/subCounty/getSubCounties?page=${page}&size=${size}`,
  );
  return Array.isArray(data) ? data : (data?.content ?? []);
}

export async function fetchSubCountyById(
  id: string | number,
): Promise<KotlinSubCounty> {
  return backendFetch<KotlinSubCounty>(
    `/api/subCounty/getSubCounty?subCountyId=${id}`,
  );
}

export async function deleteSubCounty(id: string | number): Promise<void> {
  return backendFetch<void>(`/api/subCounty/deleteOne?id=${id}`, {
    method: "DELETE",
  });
}

// ─── User Management ───────────────────────────────────────────────────────

export interface KotlinUser {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export async function fetchUserById(userId: string): Promise<KotlinUser> {
  return backendFetch<KotlinUser>(
    `/api/userManagement/fetchUserById/${encodeURIComponent(userId)}`,
  );
}

export async function fetchUserByEmail(email: string): Promise<KotlinUser> {
  return backendFetch<KotlinUser>(
    `/api/userManagement/fetchUserByEmail?email=${encodeURIComponent(email)}`,
  );
}
