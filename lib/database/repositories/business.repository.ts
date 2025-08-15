// Business repository - handles all business-related database operations
import { prisma } from "../config"
import type { Business, Prisma } from "@prisma/client"

export interface CreateBusinessData {
  userId: string
  name: string
  email: string
  phone: string
  website?: string
  category: string
  offeringType: string
  description: string
  country: string
  county: string
  subCounty: string
  address: string
  pin?: string
  weekdaySchedule: Prisma.JsonValue
  weekendSchedule: Prisma.JsonValue
  holidayHours: Prisma.JsonValue
}

export interface UpdateBusinessData {
  name?: string
  email?: string
  phone?: string
  website?: string
  category?: string
  offeringType?: string
  description?: string
  country?: string
  county?: string
  subCounty?: string
  address?: string
  pin?: string
  weekdaySchedule?: Prisma.JsonValue
  weekendSchedule?: Prisma.JsonValue
  holidayHours?: Prisma.JsonValue
  status?: string
  paymentStatus?: string
}

export class BusinessRepository {
  async create(data: CreateBusinessData): Promise<Business> {
    return await prisma.business.create({
      data: {
        ...data,
        status: "pending_payment",
        paymentStatus: "pending",
      },
    })
  }

  async findById(id: string): Promise<Business | null> {
    return await prisma.business.findUnique({
      where: { id },
    })
  }

  async findByEmail(email: string): Promise<Business[]> {
    return await prisma.business.findMany({
      where: { email },
      orderBy: { createdAt: "desc" },
    })
  }

  async findByUserId(userId: string): Promise<Business[]> {
    return await prisma.business.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
  }

  async findAll(options?: {
    skip?: number
    take?: number
    where?: Prisma.BusinessWhereInput
    orderBy?: Prisma.BusinessOrderByWithRelationInput
  }): Promise<Business[]> {
    return await prisma.business.findMany({
      skip: options?.skip,
      take: options?.take,
      where: options?.where,
      orderBy: options?.orderBy || { createdAt: "desc" },
    })
  }

  async update(id: string, data: UpdateBusinessData): Promise<Business> {
    return await prisma.business.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<Business> {
    return await prisma.business.delete({
      where: { id },
    })
  }

  async count(where?: Prisma.BusinessWhereInput): Promise<number> {
    return await prisma.business.count({ where })
  }

  async findByStatus(status: string): Promise<Business[]> {
    return await prisma.business.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
    })
  }

  async findByCategory(category: string): Promise<Business[]> {
    return await prisma.business.findMany({
      where: { category },
      orderBy: { createdAt: "desc" },
    })
  }

  async findByLocation(county: string, subCounty?: string): Promise<Business[]> {
    const where: Prisma.BusinessWhereInput = { county }
    if (subCounty) {
      where.subCounty = subCounty
    }

    return await prisma.business.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })
  }

  async search(query: string): Promise<Business[]> {
    return await prisma.business.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { address: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    })
  }
}

// Export singleton instance
export const businessRepository = new BusinessRepository()
