// Main database interface - provides unified access to database operations
import { checkDatabaseConnection } from "./config"
import { businessService } from "./services/business.service"
import { fallbackService } from "./fallback"
import type { Business } from "@prisma/client"

export interface DatabaseInterface {
  createBusiness(data: any): Promise<Business>
  getBusinessById(id: string): Promise<Business | null>
  getBusinessesByEmail(email: string): Promise<Business[]>
  getBusinessesByUserId(userId: string): Promise<Business[]>
  getBusinessesByUser(userId: string, email: string): Promise<Business[]>
  updateBusiness(id: string, data: any): Promise<Business | null>
  deleteBusiness(id: string): Promise<Business | null>
  getAllBusinesses(
    options?: any,
  ): Promise<Business[] | { businesses: Business[]; total: number; page: number; totalPages: number }>
}

class DatabaseManager implements DatabaseInterface {
  private useFallback = false
  private connectionChecked = false

  private async checkConnection(): Promise<boolean> {
    if (this.connectionChecked) {
      return !this.useFallback
    }

    try {
      const isConnected = await checkDatabaseConnection()
      this.useFallback = !isConnected
      this.connectionChecked = true

      if (this.useFallback) {
        console.warn("Database connection failed, using fallback service")
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

    if (this.useFallback) {
      return await fallbackService.createBusiness(data)
    }

    try {
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
    } catch (error) {
      console.error("Database operation failed, falling back:", error)
      this.useFallback = true
      return await fallbackService.createBusiness(data)
    }
  }

  async getBusinessById(id: string): Promise<Business | null> {
    await this.checkConnection()

    if (this.useFallback) {
      return await fallbackService.findById(id)
    }

    try {
      return await businessService.getBusinessById(id)
    } catch (error) {
      console.error("Database operation failed, falling back:", error)
      this.useFallback = true
      return await fallbackService.findById(id)
    }
  }

  async getBusinessesByEmail(email: string): Promise<Business[]> {
    await this.checkConnection()

    if (this.useFallback) {
      return await fallbackService.findByEmail(email)
    }

    try {
      return await businessService.getBusinessesByEmail(email)
    } catch (error) {
      console.error("Database operation failed, falling back:", error)
      this.useFallback = true
      return await fallbackService.findByEmail(email)
    }
  }

  async getBusinessesByUserId(userId: string): Promise<Business[]> {
    await this.checkConnection()

    if (this.useFallback) {
      return await fallbackService.findByUserId(userId)
    }

    try {
      return await businessService.getBusinessesByUserId(userId)
    } catch (error) {
      console.error("Database operation failed, falling back:", error)
      this.useFallback = true
      return await fallbackService.findByUserId(userId)
    }
  }

  async getBusinessesByUser(userId: string, email: string): Promise<Business[]> {
    await this.checkConnection()

    if (this.useFallback) {
      return await fallbackService.findByUser(userId, email)
    }

    try {
      return await businessService.getBusinessesByUser(userId, email)
    } catch (error) {
      console.error("Database operation failed, falling back:", error)
      this.useFallback = true
      return await fallbackService.findByUser(userId, email)
    }
  }

  async updateBusiness(id: string, data: any): Promise<Business | null> {
    await this.checkConnection()

    if (this.useFallback) {
      return await fallbackService.update(id, data)
    }

    try {
      return await businessService.updateBusiness(id, data)
    } catch (error) {
      console.error("Database operation failed, falling back:", error)
      this.useFallback = true
      return await fallbackService.update(id, data)
    }
  }

  async deleteBusiness(id: string): Promise<Business | null> {
    await this.checkConnection()

    if (this.useFallback) {
      return await fallbackService.delete(id)
    }

    try {
      return await businessService.deleteBusiness(id)
    } catch (error) {
      console.error("Database operation failed, falling back:", error)
      this.useFallback = true
      return await fallbackService.delete(id)
    }
  }

  async getAllBusinesses(
    options?: any,
  ): Promise<Business[] | { businesses: Business[]; total: number; page: number; totalPages: number }> {
    await this.checkConnection()

    if (this.useFallback) {
      const businesses = await fallbackService.findAll()
      return options?.page ? { businesses, total: businesses.length, page: 1, totalPages: 1 } : businesses
    }

    try {
      if (options?.page) {
        return await businessService.getAllBusinesses(options)
      } else {
        const result = await businessService.getAllBusinesses({ limit: 1000 })
        return result.businesses
      }
    } catch (error) {
      console.error("Database operation failed, falling back:", error)
      this.useFallback = true
      const businesses = await fallbackService.findAll()
      return options?.page ? { businesses, total: businesses.length, page: 1, totalPages: 1 } : businesses
    }
  }

  // Utility methods
  async isUsingFallback(): Promise<boolean> {
    await this.checkConnection()
    return this.useFallback
  }

  async resetConnection(): Promise<void> {
    this.connectionChecked = false
    this.useFallback = false
  }
}

// Export singleton instance
export const database = new DatabaseManager()

// Re-export types and services for convenience
export type { Business } from "@prisma/client"
export { businessService } from "./services/business.service"
export { businessRepository } from "./repositories/business.repository"
export { userRepository } from "./repositories/user.repository"
export { checkDatabaseConnection, disconnectDatabase } from "./config"
