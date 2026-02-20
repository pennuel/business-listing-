import { apiRequest } from "../api-client";

export class ServiceRepository {
  async create(data: any) {
    return await apiRequest("/api/services/addService", "POST", data);
  }

  async findAll(page = 0, size = 10) {
    return await apiRequest("/api/services/getServices", "GET", undefined, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  async findById(id: string) {
    return await apiRequest(`/api/services/${id}`, "GET");
  }

  async update(id: string, data: any) {
    return await apiRequest(`/api/services/${id}`, "PUT", data);
  }

  async delete(id: string) {
    return await apiRequest(`/api/services/${id}`, "DELETE");
  }
}

export const serviceRepository = new ServiceRepository();
