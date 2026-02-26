// User repository - adapted to use the Auth API instead of Prisma
import { apiRequest } from "../api-client";
import { authRepository } from "./auth.repository";
import { User } from "@think-id/types";

export interface CreateUserData {
  id?: string;
  email: string;
  name?: string;
}

export class UserRepository {
  /**
   * For the new server-based setup, "creating" a user is part of sign up.
   * Returns the FusionAuth registration response
   */
  async create(data: CreateUserData): Promise<User | null> {
    const response = await authRepository.signUp(data);
    // Extract user data from the response if available
    if (response.user) {
      return response.user as unknown as User;
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return null;
  }

  async sync_with_db(userId: string): Promise<User > {
    // No-op since we're using the API
    const result = await apiRequest<User>("/api/auth/sync/" + userId, "GET", undefined, {
          params: { userId }
        })
        return result 
  }

  async findOrCreate(data: Partial<CreateUserData>): Promise<User | null> {
    // If no user found, the signUp will typically handle duplicates or return existing.
    return await this.create(data as CreateUserData);
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async update(id: string, data: any): Promise<User | null> {
    return null;
  }

  async delete(id: string): Promise<User | null> {
    return null;
  }

  async count(): Promise<number> {
    return 0;
  }
}

export const userRepository = new UserRepository();
