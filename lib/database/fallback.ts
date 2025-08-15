// Fallback system for when database is unavailable
import type { Business } from "@prisma/client"

// Mock data for fallback
const mockBusinesses: Business[] = [
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
      "We provide comprehensive IT solutions for businesses including web development, mobile apps, and system integration.",
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
    } as any,
    weekendSchedule: {
      saturday: { open: "09:00", close: "13:00", isOpen: true },
      sunday: { open: "09:00", close: "13:00", isOpen: false },
    } as any,
    holidayHours: { open: "10:00", close: "14:00", isOpen: false } as any,
    createdAt: new Date("2024-01-15T08:00:00.000Z"),
    updatedAt: new Date("2024-01-15T08:00:00.000Z"),
    subscriptionId: null,
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
    description: "Fresh organic groceries, fruits, vegetables, and household items delivered to your doorstep.",
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
    } as any,
    weekendSchedule: {
      saturday: { open: "07:00", close: "21:00", isOpen: true },
      sunday: { open: "08:00", close: "19:00", isOpen: true },
    } as any,
    holidayHours: { open: "08:00", close: "16:00", isOpen: true } as any,
    createdAt: new Date("2024-01-20T10:30:00.000Z"),
    updatedAt: new Date("2024-01-20T10:30:00.000Z"),
    subscriptionId: null,
  },
]

export class FallbackService {
  private businesses: Business[] = [...mockBusinesses]

  async createBusiness(data: any): Promise<Business> {
    const newBusiness: Business = {
      id: `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId || "user-1",
      name: data.name,
      email: data.email,
      phone: data.phone,
      website: data.website || null,
      category: data.category,
      offeringType: data.offeringType,
      description: data.description || "",
      country: data.country,
      county: data.county,
      subCounty: data.subCounty || "",
      address: data.address,
      pin: data.pin || null,
      status: "pending_payment",
      paymentStatus: "pending",
      weekdaySchedule: data.weekdaySchedule as any,
      weekendSchedule: data.weekendSchedule as any,
      holidayHours: data.holidayHours as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptionId: null,
    }

    this.businesses.push(newBusiness)
    return newBusiness
  }

  async findById(id: string): Promise<Business | null> {
    return this.businesses.find((b) => b.id === id) || null
  }

  async findByEmail(email: string): Promise<Business[]> {
    return this.businesses.filter((b) => b.email === email)
  }

  async findByUserId(userId: string): Promise<Business[]> {
    return this.businesses.filter((b) => b.userId === userId)
  }

  async findAll(): Promise<Business[]> {
    return [...this.businesses]
  }

  async update(id: string, data: any): Promise<Business | null> {
    const index = this.businesses.findIndex((b) => b.id === id)
    if (index === -1) return null

    this.businesses[index] = {
      ...this.businesses[index],
      ...data,
      updatedAt: new Date(),
    }

    return this.businesses[index]
  }

  async delete(id: string): Promise<Business | null> {
    const index = this.businesses.findIndex((b) => b.id === id)
    if (index === -1) return null

    const deleted = this.businesses[index]
    this.businesses.splice(index, 1)
    return deleted
  }
}

export const fallbackService = new FallbackService()
