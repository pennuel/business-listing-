// User repository - adapted to use the Auth API instead of Prisma
import { authRepository } from "./auth.repository";

export interface CreateUserData {
  id?: string;
  email: string;
  name?: string;
}

export class UserRepository {
  /**
   * For the new server-based setup, "creating" a user is part of sign up.
   */
  async create(data: CreateUserData) {
    return await authRepository.signUp(data);
  }

  async findById(id: string) {
    return null;
  }

  async findByEmail(email: string) {
    return null;
  }

  async findOrCreate(data: Partial<CreateUserData>) {
    // If no user found, the signUp will typically handle duplicates or return existing.
    return await this.create(data as CreateUserData);
  }

  async findAll() {
    return [];
  }

  async update(id: string, data: any) {
    return null;
  }

  async delete(id: string) {
    return null;
  }

  async count() {
    return 0;
  }
}

export const userRepository = new UserRepository();
