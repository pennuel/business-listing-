// API client for business operations

export interface Business {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  website?: string
  category: string
  offeringType: "goods" | "services"
  description: string
  country: string
  county: string
  subCounty: string
  address: string
  pin?: string
  status: "active" | "pending_payment" | "inactive"
  paymentStatus: "paid" | "pending" | "failed"
  weekdaySchedule: {
    [key: string]: { open: string; close: string; isOpen: boolean }
  }
  weekendSchedule: {
    [key: string]: { open: string; close: string; isOpen: boolean }
  }
  holidayHours: { open: string; close: string; isOpen: boolean }
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success?: boolean
  error?: string
  business?: T
  businesses?: T[]
}

class ApiClient {
  private baseUrl = "/api"

  async getBusinessesByEmail(email: string): Promise<Business[]> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses?email=${encodeURIComponent(email)}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse<Business> = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      return data.businesses || []
    } catch (error) {
      console.error("Failed to fetch businesses by email:", error)
      throw error
    }
  }

  async getBusinessesByUserId(userId: string): Promise<Business[]> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses?userId=${encodeURIComponent(userId)}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse<Business> = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      return data.businesses || []
    } catch (error) {
      console.error("Failed to fetch businesses by user ID:", error)
      throw error
    }
  }

  async getBusinessById(id: string): Promise<Business | null> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses?id=${encodeURIComponent(id)}`)

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse<Business> = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      return data.business || null
    } catch (error) {
      console.error("Failed to fetch business by ID:", error)
      throw error
    }
  }

  async getBusinessPreview(id: string): Promise<Business | null> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses/${encodeURIComponent(id)}/preview`)

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse<Business> = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      return data.business || null
    } catch (error) {
      console.error("Failed to fetch business preview:", error)
      throw error
    }
  }

  async createBusiness(businessData: Partial<Business>): Promise<Business> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(businessData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse<Business> = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.business) {
        throw new Error("No business data returned")
      }

      return data.business
    } catch (error) {
      console.error("Failed to create business:", error)
      throw error
    }
  }

  async updateBusiness(id: string, businessData: Partial<Business>): Promise<Business> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses?id=${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(businessData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse<Business> = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.business) {
        throw new Error("No business data returned")
      }

      return data.business
    } catch (error) {
      console.error("Failed to update business:", error)
      throw error
    }
  }

  async getAllBusinesses(): Promise<Business[]> {
    try {
      const response = await fetch(`${this.baseUrl}/businesses`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse<Business> = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      return data.businesses || []
    } catch (error) {
      console.error("Failed to fetch all businesses:", error)
      throw error
    }
  }
}

export const apiClient = new ApiClient()
