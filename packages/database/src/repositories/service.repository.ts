import { apiRequest } from "../api-client";

export class ServiceRepository {
  async create(data: any) {
    // Map frontend field names → backend ServiceRequest field names
    const payload = {
      serviceName: data.name,
      serviceDescription: data.description ?? null,
      costing: data.price != null ? String(data.price) : null,
      currency: data.currency ?? "KES",
      duration: data.duration ?? null,
      businessId: data.businessId != null ? Number(data.businessId) : null,
    };
    // Backend controller is mapped to /api/Services (capital S)
    return await apiRequest("/api/Services/addService", "POST", payload);
  }

  async findAll(page = 0, size = 10) {
    return await apiRequest("/api/Services/getServices", "GET", undefined, {
      params: { page: page.toString(), size: size.toString() },
    });
  }

  async findById(id: string) {
    return await apiRequest(`/api/Services/${id}`, "GET");
  }

  async update(id: string, data: any) {
    // Map frontend field names → backend ServiceRequest field names
    const payload = {
      serviceName: data.name ?? data.serviceName,
      serviceDescription: data.description ?? data.serviceDescription ?? null,
      costing: data.price != null ? String(data.price) : (data.costing ?? null),
      currency: data.currency ?? "KES",
      duration: data.duration ?? null,
      businessId: data.businessId != null ? Number(data.businessId) : null,
    };
    return await apiRequest(`/api/Services/${id}`, "PUT", payload);
  }

  async delete(id: string) {
    return await apiRequest(`/api/Services/${id}`, "DELETE");
  }
}

export const serviceRepository = new ServiceRepository();
