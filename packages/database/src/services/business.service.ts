// Business service - contains business logic and orchestrates repository calls
import {
  businessRepository,
  type CreateBusinessData,
  type UpdateBusinessData,
} from "../repositories/business.repository";
import { userRepository } from "../repositories/user.repository";
import { BusinessInfo, User } from "@think-id/types";

export type BusinessServiceCreateData = CreateBusinessData;

export class BusinessService {
  async createBusiness(data: BusinessServiceCreateData): Promise<BusinessInfo> {
    // Validate required fields
    this.validateBusinessData(data);

    return await businessRepository.create(data);
  }

  async getBusinessById(id: string): Promise<BusinessInfo | null> {
    return await businessRepository.findById(id);
  }

  async getBusinessesByEmail(email: string): Promise<BusinessInfo[]> {
    return await businessRepository.findByEmail(email);
  }

  async getBusinessesByUserId(userId: string): Promise<BusinessInfo[] | null> {
    return await businessRepository.findByUserId(userId);
  }

  async getBusinessesByUser(userId: string, email: string): Promise<BusinessInfo[]> {
    return await businessRepository.findByUser(userId, email);
  }

  async updateBusiness(
    id: string,
    data: UpdateBusinessData
  ): Promise<BusinessInfo> {
    // Validate business exists
    const existingBusiness = await businessRepository.findById(id);
    if (!existingBusiness) {
      throw new Error("Business not found");
    }

    return await businessRepository.update(id, data);
  }

  async deleteBusiness(id: string): Promise<any> {
    // Validate business exists
    const existingBusiness = await businessRepository.findById(id);
    if (!existingBusiness) {
      throw new Error("Business not found");
    }

    return await businessRepository.delete(id);
  }

  async searchBusinesses(query: string): Promise<BusinessInfo[]> {
    if (!query.trim()) {
      return [];
    }

    return await businessRepository.search(query);
  }

  async getBusinessesByLocation(
    county: string,
    subCounty?: string
  ): Promise<BusinessInfo[]> {
    return await businessRepository.findByLocation(county, subCounty);
  }

  async getBusinessesByCategory(category: string): Promise<BusinessInfo[]> {
    return await businessRepository.findByCategory(category);
  }

  async getBusinessesByStatus(status: string): Promise<BusinessInfo[]> {
    return await businessRepository.findByStatus(status);
  }

  async updateBusinessStatus(id: string, status: string): Promise<BusinessInfo> {
    return await this.updateBusiness(id, { status });
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: string
  ): Promise<BusinessInfo> {
    return await this.updateBusiness(id, { paymentStatus });
  }

  async getAllBusinesses(options?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }): Promise<{
    businesses: BusinessInfo[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options?.status) where.status = options.status;
    if (options?.category) where.category = options.category;

    const [businesses, total] = await Promise.all([
      businessRepository.findAll({ skip, take: limit, where }),
      businessRepository.count(where),
    ]);

    return {
      businesses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  private validateBusinessData(data: Partial<BusinessServiceCreateData>): void {
    const requiredFields = [
      "businessName",
      "email",
      "phoneNumber",
      "categoryId",
      "country",
      "county",
      "address",
    ];

    for (const field of requiredFields) {
      const value = (data as any)[field];
      if (value === undefined || value === null || value.toString().trim() === "") {
        throw new Error(`${field} is required`);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email || "")) {
      throw new Error("Invalid email format");
    }
  }
}

// Export singleton instance
export const businessService = new BusinessService();
