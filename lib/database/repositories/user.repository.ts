// User repository - handles all user-related database operations
import { prisma } from "../config"
import type { User, Prisma } from "@prisma/client"

export interface CreateUserData {
  email: string
  name?: string
}

export interface UpdateUserData {
  email?: string
  name?: string
}

export class UserRepository {
  async create(data: CreateUserData): Promise<User> {
    return await prisma.user.create({
      data,
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

  async findOrCreate(email: string, name?: string): Promise<User> {
    const existingUser = await this.findByEmail(email)
    if (existingUser) {
      return existingUser
    }

    return await this.create({ email, name })
  }
}

// Export singleton instance
export const userRepository = new UserRepository()
