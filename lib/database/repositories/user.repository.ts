// User repository - handles all user-related database operations
import { prisma } from "../config"
import { User, Prisma } from "@prisma/client"

export interface CreateUserData {
  id: string
  email: string
  name?: string
}

export interface UpdateUserData {
  email?: string
  name?: string
}

export class UserRepository {

  /**
   * Create or update a user coming from THiNKID.
   * Uses the FusionAuth user id as the primary key to avoid duplicates.
   * It will also help with updating the other fields of the user
   */
  async create(data: CreateUserData): Promise<User> {
    const { id, ...rest } = data
    return await prisma.user.upsert({
      where: { id },
      create: { id, ...rest },
      update: { ...rest },
    })
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        businesses: true,
      },
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        businesses: true,
      },
    })
  }

  async findAll(options?: {
    skip?: number
    take?: number
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]> {
    return await prisma.user.findMany({
      skip: options?.skip,
      take: options?.take,
      where: options?.where,
      orderBy: options?.orderBy || { createdAt: "desc" },
      include: {
        businesses: true,
      },
    })
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    })
  }

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return await prisma.user.count({ where })
  }

  async findOrCreate(data: Partial<User>): Promise<User> {
    const existingUser = await this.findByEmail(data.email || "")
    if (existingUser) {
      return existingUser
    }

    // If user does not exist, create a new one based on the CreateUserData type.
    return await this.create(data as CreateUserData)
  }
}

// Export singleton instance
export const userRepository = new UserRepository()
