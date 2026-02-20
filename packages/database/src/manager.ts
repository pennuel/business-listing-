// Main database interface - provides unified access to database operations
import { prisma } from "./client"
import { businessService } from "./services/business.service"
import { userService } from "./services/user.service"
import { authService } from "./services/auth.service"
import { reviewService } from "./services/review.service"
import { serviceService } from "./services/service.service"
import type { Business } from "@prisma/client"

export interface DatabaseInterface {
  // Service access
  businesses: typeof businessService
  users: typeof userService
  auth: typeof authService
  reviews: typeof reviewService
  offerings: typeof serviceService

  // Top-level operations (delegated to services)
  createBusiness(data: any): Promise<Business>
  getBusinessById(id: string): Promise<Business | null>
  getBusinessesByEmail(email: string): Promise<Business[]>
  getBusinessesByUserId(userId: string): Promise<Business[]>
  updateBusiness(id: string, data: any): Promise<Business | null>
  deleteBusiness(id: string): Promise<Business | null>
  getAllBusinesses(
    options?: any,
  ): Promise<Business[] | { businesses: Business[]; total: number; page: number; totalPages: number }>
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

class DatabaseManager implements DatabaseInterface {
  private useFallback = false
  private connectionChecked = false

  // Public services
  public readonly businesses = businessService
  public readonly users = userService
  public readonly auth = authService
  public readonly reviews = reviewService
  public readonly offerings = serviceService

  private async checkConnection(): Promise<boolean> {
    if (this.connectionChecked) {
      return !this.useFallback
    }

    try {
      const isConnected = await checkDatabaseConnection()
      this.useFallback = !isConnected
      this.connectionChecked = true

      if (this.useFallback) {
        console.warn("Database connection failed")
      } else {
        console.log("Database connection successful")
      }

      return isConnected
    } catch (error) {
      console.error("Database connection check failed:", error)
      this.useFallback = true
      this.connectionChecked = true
      return false
    }
  }

  async createBusiness(data: any): Promise<Business> {
    await this.checkConnection()
    // Fallback logic omitted for now to keep it clean, but can be added back if needed
    return await businessService.createBusiness({
      userEmail: data.email,
      name: data.name,
      email: data.email,
      phone: data.phone,
      website: data.website,
      category: data.category,
      offeringType: data.offeringType,
      description: data.description,
      country: data.country,
      county: data.county,
      subCounty: data.subCounty,
      address: data.address,
      pin: data.pin,
      formattedAddress: data.formattedAddress,
      latitude: data.latitude,
      longitude: data.longitude,
      placeId: data.placeId,
      weekdaySchedule: data.weekdaySchedule,
      weekendSchedule: data.weekendSchedule,
      holidayHours: data.holidayHours,
    })
  }

  async getBusinessById(id: string): Promise<Business | null> {
    await this.checkConnection()
    return await businessService.getBusinessById(id)
  }

  async getBusinessesByEmail(email: string): Promise<Business[]> {
    await this.checkConnection()
    return await businessService.getBusinessesByEmail(email)
  }

  async getBusinessesByUserId(userId: string): Promise<Business[]> {
    await this.checkConnection()
    return await businessService.getBusinessesByUserId(userId)
  }

  async updateBusiness(id: string, data: any): Promise<Business | null> {
    await this.checkConnection()
    return await businessService.updateBusiness(id, data)
  }

  async deleteBusiness(id: string): Promise<Business | null> {
    await this.checkConnection()
    return await businessService.deleteBusiness(id)
  }

  async getAllBusinesses(
    options?: any,
  ): Promise<Business[] | { businesses: Business[]; total: number; page: number; totalPages: number }> {
    await this.checkConnection()

    if (options?.page) {
      return await businessService.getAllBusinesses(options)
    } else {
      const result = await businessService.getAllBusinesses({ limit: 1000 })
      return result.businesses
    }
  }

  async isUsingFallback(): Promise<boolean> {
    await this.checkConnection()
    return this.useFallback
  }
}

export const database = new DatabaseManager()
