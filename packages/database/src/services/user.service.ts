import { userRepository, type CreateUserData } from "../repositories/user.repository";
import { User } from "@think-id/types";

export class UserService {
  async createUser(data: CreateUserData): Promise<User | null> {
    return await userRepository.create(data);
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await userRepository.findById(id);
    return user;
  }
  async syncUserWithDB(userId: string): Promise<User > {
    return await userRepository.sync_with_db(userId);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;
    return user;
  }

  async findOrCreateUser(data: Partial<CreateUserData>): Promise<User | null> {
    return await userRepository.findOrCreate(data);
  }

  async getAllUsers(): Promise<User[]> {
    return await userRepository.findAll();
  }

  async updateUser(id: string, data: any): Promise<User | null> {
    return await userRepository.update(id, data);
  }

  async deleteUser(id: string) {
    return await userRepository.delete(id);
  }
}

export const userService = new UserService();
