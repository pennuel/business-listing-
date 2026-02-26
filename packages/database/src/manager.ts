// // Main database interface - provides unified access to database operations
// import { businessService } from "./services/business.service"
// import { userService } from "./services/user.service"
// import { authService } from "./services/auth.service"
// import { reviewService } from "./services/review.service"
// import { serviceService } from "./services/service.service"
// import { categoryService } from "./services/category.service"
// import { BusinessInfo, User } from "@think-id/types"

// export interface DatabaseInterface {
//   // Service access
//   businesses: typeof businessService
//   users: typeof userService
//   auth: typeof authService
//   reviews: typeof reviewService
//   offerings: typeof serviceService
//   categories: typeof categoryService

//   // Top-level operations (delegated to services)
//   createBusiness(data: any): Promise<BusinessInfo>
//   getBusinessById(id: string): Promise<BusinessInfo | null>
//   getBusinessesByEmail(email: string): Promise<BusinessInfo[]>
//   getBusinessesByUserId(userId: string): Promise<User | null>
//   updateBusiness(id: string, data: any): Promise<BusinessInfo | null>
//   deleteBusiness(id: string): Promise<any>
//   getAllBusinesses(
//     options?: any,
//   ): Promise<BusinessInfo[] | { businesses: BusinessInfo[]; total: number; page: number; totalPages: number }>
// }

// export async function checkDatabaseConnection(): Promise<boolean> {
//   try {
//     await prisma.$queryRaw`SELECT 1`
//     return true
//   } catch (error) {
//     console.error("Database connection failed:", error)
//     return false
//   }
// }

// class DatabaseManager implements DatabaseInterface {
//   private useFallback = false
//   private connectionChecked = false

//   // Public services
//   public readonly businesses = businessService
//   public readonly users = userService
//   public readonly auth = authService
//   public readonly reviews = reviewService
//   public readonly offerings = serviceService
//   public readonly categories = categoryService

//   private async checkConnection(): Promise<boolean> {
//     if (this.connectionChecked) {
//       return !this.useFallback
//     }

//     try {
//       const isConnected = await checkDatabaseConnection()
//       this.useFallback = !isConnected
//       this.connectionChecked = true

//       if (this.useFallback) {
//         console.warn("Database connection failed")
//       } else {
//         console.log("Database connection successful")
//       }

//       return isConnected
//     } catch (error) {
//       console.error("Database connection check failed:", error)
//       this.useFallback = true
//       this.connectionChecked = true
//       return false
//     }
//   }

//   async createBusiness(data: any): Promise<BusinessInfo> {
//     await this.checkConnection()
//     return await businessService.createBusiness(data)
//   }

//   async getBusinessById(id: string): Promise<BusinessInfo | null> {
//     await this.checkConnection()
//     return await businessService.getBusinessById(id)
//   }

//   async getBusinessesByEmail(email: string): Promise<BusinessInfo[]> {
//     await this.checkConnection()
//     return await businessService.getBusinessesByEmail(email)
//   }

//   async getBusinessesByUserId(userId: string): Promise<User | null> {
//     await this.checkConnection()
//     return await businessService.getBusinessesByUserId(userId)
//   }

//   async updateBusiness(id: string, data: any): Promise<BusinessInfo | null> {
//     await this.checkConnection()
//     return await businessService.updateBusiness(id, data)
//   }

//   async deleteBusiness(id: string): Promise<any> {
//     await this.checkConnection()
//     return await businessService.deleteBusiness(id)
//   }

//   async getAllBusinesses(
//     options?: any,
//   ): Promise<BusinessInfo[] | { businesses: BusinessInfo[]; total: number; page: number; totalPages: number }> {
//     await this.checkConnection()

//     if (options?.page) {
//       return await businessService.getAllBusinesses(options)
//     } else {
//       const result = await businessService.getAllBusinesses({ limit: 1000 })
//       return result.businesses
//     }
//   }

//   async isUsingFallback(): Promise<boolean> {
//     await this.checkConnection()
//     return this.useFallback
//   }
// }

// export const database = new DatabaseManager()
