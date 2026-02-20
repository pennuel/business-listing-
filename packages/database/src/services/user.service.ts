import { userRepository, type CreateUserData } from "../repositories/user.repository";

export class UserService {
  async createUser(data: CreateUserData) {
    return await userRepository.create(data);
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) return null;
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;
    return user;
  }

  async findOrCreateUser(data: Partial<CreateUserData>) {
    return await userRepository.findOrCreate(data);
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }

  async updateUser(id: string, data: any) {
    return await userRepository.update(id, data);
  }

  async deleteUser(id: string) {
    return await userRepository.delete(id);
  }
}

export const userService = new UserService();
