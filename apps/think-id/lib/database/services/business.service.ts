// Business service - contains business logic and orchestrates repository calls
import {
  businessRepository,
  type CreateBusinessData,
  type UpdateBusinessData,
} from "../repositories/business.repository";
import { userRepository } from "../repositories/user.repository";
import { Business } from "@prisma/client";

export interface BusinessServiceCreateData
  extends Omit<CreateBusinessData, "userId"> {
  userEmail: string;
  authUserId?: string;
}

export class BusinessService {
  async createBusiness(data: BusinessServiceCreateData): Promise<Business> {
    // Validate required fields
    this.validateBusinessData(data);

    // Find or create user using the provided userEmail and optional auth ID
    const user = await userRepository.findOrCreate({ 
      email: data.userEmail,
      id: data.authUserId
    });

    // Create business - exclude the runtime-only `userEmail` and `authUserId` properties before saving
    const { userEmail, authUserId, ...rest } = data;
    const businessData: CreateBusinessData = {
      ...(rest as Omit<CreateBusinessData, "userId">),
      userId: user.id,
    };

    return await businessRepository.create(businessData);
  }

  async getBusinessById(id: string): Promise<Business | null> {
    return await businessRepository.findById(id);
  }

  async getBusinessesByEmail(email: string): Promise<Business[]> {
    return await businessRepository.findByEmail(email);
  }

  async getBusinessesByUserId(userId: string): Promise<Business[]> {
    return await businessRepository.findByUserId(userId);
  }

  async getBusinessesByUser(userId: string, email: string): Promise<Business[]> {
    return await businessRepository.findByUser(userId, email);
  }

  async updateBusiness(
    id: string,
    data: UpdateBusinessData
  ): Promise<Business> {
    // Validate business exists
    const existingBusiness = await businessRepository.findById(id);
    if (!existingBusiness) {
      throw new Error("Business not found");
    }

    return await businessRepository.update(id, data);
  }

  async deleteBusiness(id: string): Promise<Business> {
    // Validate business exists
    const existingBusiness = await businessRepository.findById(id);
    if (!existingBusiness) {
      throw new Error("Business not found");
    }

    return await businessRepository.delete(id);
  }

  async searchBusinesses(query: string): Promise<Business[]> {
    if (!query.trim()) {
      return [];
    }

    return await businessRepository.search(query);
  }

  async getBusinessesByLocation(
    county: string,
    subCounty?: string
  ): Promise<Business[]> {
    return await businessRepository.findByLocation(county, subCounty);
  }

  async getBusinessesByCategory(category: string): Promise<Business[]> {
    return await businessRepository.findByCategory(category);
  }

  async getBusinessesByStatus(status: string): Promise<Business[]> {
    return await businessRepository.findByStatus(status);
  }

  async updateBusinessStatus(id: string, status: string): Promise<Business> {
    return await this.updateBusiness(id, { status });
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: string
  ): Promise<Business> {
    return await this.updateBusiness(id, { paymentStatus });
  }

  async getAllBusinesses(options?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }): Promise<{
    businesses: Business[];
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
      "name",
      "email",
      "phone",
      "category",
      "offeringType",
      "country",
      "county",
      "address",
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof BusinessServiceCreateData]?.toString().trim()) {
        throw new Error(`${field} is required`);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email || "")) {
      throw new Error("Invalid email format");
    }

    // Validate offering type
    if (!["goods", "services"].includes(data.offeringType || "")) {
      throw new Error('Offering type must be either "goods" or "services"');
    }
  }
}

// Export singleton instance
export const businessService = new BusinessService();
