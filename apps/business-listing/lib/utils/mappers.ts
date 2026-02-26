import { BusinessInfo } from "@think-id/types";
import { Business } from "../api";

export function normalizeBusiness(bi: BusinessInfo): Business {
  return {
    id: (bi.bizId || bi.id || "").toString(),
    userId: bi.user?.id || "",
    name: bi.businessName || bi.name || "Unnamed Business",
    email: bi.email || "",
    phone: bi.phoneNumber || bi.phone || "",
    website: bi.website || "",
    category: bi.category?.categoryName || bi.category || "General",
    offeringType: (bi as any).offeringType || "goods",
    description: bi.description || "",
    country: bi.country || "",
    county: bi.county || "",
    subCounty: bi.subCounty || "",
    address: bi.address || "",
    pin: bi.pin || "",
    formattedAddress: bi.formattedAddress || "",
    latitude: bi.latitude,
    longitude: bi.longitude,
    placeId: bi.placeId,
    status: (bi.status as any) || "active",
    paymentStatus: (bi.paymentStatus as any) || "pending",
    weekdaySchedule: bi.schedule?.weekday || bi.weekdaySchedule || {},
    weekendSchedule: bi.schedule?.weekend || bi.weekendSchedule || {},
    holidayHours: bi.holidayHours || { open: "", close: "", isOpen: false },
    createdAt: bi.createdAt || new Date().toISOString(),
    updatedAt: bi.updatedAt || new Date().toISOString(),
    ...bi // Include any extra fields needed by the components
  } as any as Business;
}
