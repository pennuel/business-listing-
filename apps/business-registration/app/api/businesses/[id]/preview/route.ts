import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/database"

// Mock business data (same as main API)
const mockBusinesses = [
  {
    id: "demo-1",
    userId: "user-1",
    name: "Tech Solutions Kenya",
    email: "demo@example.com",
    phone: "+254712345678",
    website: "https://techsolutions.co.ke",
    category: "Technology Services",
    offeringType: "services",
    description:
      "We provide comprehensive IT solutions for businesses including web development, mobile apps, and system integration. Our team of experienced developers and consultants help businesses leverage technology to grow and succeed in the digital age.",
    country: "Kenya",
    county: "Nairobi",
    subCounty: "Westlands",
    address: "Westlands Square, Ring Road, Westlands",
    pin: "00100",
    status: "active",
    paymentStatus: "paid",
    weekdaySchedule: {
      monday: { open: "08:00", close: "17:00", isOpen: true },
      tuesday: { open: "08:00", close: "17:00", isOpen: true },
      wednesday: { open: "08:00", close: "17:00", isOpen: true },
      thursday: { open: "08:00", close: "17:00", isOpen: true },
      friday: { open: "08:00", close: "17:00", isOpen: true },
    },
    weekendSchedule: {
      saturday: { open: "09:00", close: "13:00", isOpen: true },
      sunday: { open: "09:00", close: "13:00", isOpen: false },
    },
    holidayHours: { open: "10:00", close: "14:00", isOpen: false },
    createdAt: "2024-01-15T08:00:00.000Z",
    updatedAt: "2024-01-15T08:00:00.000Z",
  },
  {
    id: "demo-2",
    userId: "user-1",
    name: "Fresh Groceries Market",
    email: "demo@example.com",
    phone: "+254798765432",
    website: "https://freshgroceries.co.ke",
    category: "Food & Beverages",
    offeringType: "goods",
    description:
      "Fresh organic groceries, fruits, vegetables, and household items delivered to your doorstep. We source directly from local farmers to ensure the highest quality produce at affordable prices. Our commitment to freshness and customer satisfaction has made us a trusted name in the community.",
    country: "Kenya",
    county: "Nairobi",
    subCounty: "Kasarani",
    address: "Kasarani Shopping Center, Thika Road",
    pin: "00618",
    status: "pending_payment",
    paymentStatus: "pending",
    weekdaySchedule: {
      monday: { open: "07:00", close: "20:00", isOpen: true },
      tuesday: { open: "07:00", close: "20:00", isOpen: true },
      wednesday: { open: "07:00", close: "20:00", isOpen: true },
      thursday: { open: "07:00", close: "20:00", isOpen: true },
      friday: { open: "07:00", close: "20:00", isOpen: true },
    },
    weekendSchedule: {
      saturday: { open: "07:00", close: "21:00", isOpen: true },
      sunday: { open: "08:00", close: "19:00", isOpen: true },
    },
    holidayHours: { open: "08:00", close: "16:00", isOpen: true },
    createdAt: "2024-01-20T10:30:00.000Z",
    updatedAt: "2024-01-20T10:30:00.000Z",
  },
  {
    id: "demo-3",
    userId: "user-2",
    name: "Elegant Hair Salon",
    email: "jane@example.com",
    phone: "+254701234567",
    website: "https://eleganthair.co.ke",
    category: "Personal Services",
    offeringType: "services",
    description:
      "Professional hair styling, cutting, coloring, and beauty treatments. Our experienced stylists use premium products to give you the perfect look for any occasion. We specialize in both traditional and modern hairstyles for men and women.",
    country: "Kenya",
    county: "Mombasa",
    subCounty: "Nyali",
    address: "Nyali Cinemax, Links Road",
    pin: "80100",
    status: "active",
    paymentStatus: "paid",
    weekdaySchedule: {
      monday: { open: "09:00", close: "18:00", isOpen: true },
      tuesday: { open: "09:00", close: "18:00", isOpen: true },
      wednesday: { open: "09:00", close: "18:00", isOpen: true },
      thursday: { open: "09:00", close: "18:00", isOpen: true },
      friday: { open: "09:00", close: "18:00", isOpen: true },
    },
    weekendSchedule: {
      saturday: { open: "08:00", close: "19:00", isOpen: true },
      sunday: { open: "10:00", close: "16:00", isOpen: true },
    },
    holidayHours: { open: "10:00", close: "15:00", isOpen: true },
    createdAt: "2024-01-10T14:20:00.000Z",
    updatedAt: "2024-01-10T14:20:00.000Z",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const businessId = params.id

    // Get business using database manager
    const business = await database.getBusinessById(businessId)

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    // Return business data for preview
    return NextResponse.json({ business })
  } catch (error) {
    console.error("Preview API Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
