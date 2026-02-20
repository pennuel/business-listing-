import { serviceRepository } from "../repositories/service.repository";

export class ServiceService {
  async createService(data: any) {
    return await serviceRepository.create(data);
  }

  async getAllServices(page?: number, size?: number) {
    return await serviceRepository.findAll(page, size);
  }

  async getServiceById(id: string) {
    return await serviceRepository.findById(id);
  }

  async updateService(id: string, data: any) {
    return await serviceRepository.update(id, data);
  }

  async deleteService(id: string) {
    return await serviceRepository.delete(id);
  }
}

export const serviceService = new ServiceService();
