// Business repository - handles all business-related API operations
import { apiRequest } from "../api-client"
import { BusinessInfo, BusinessInfoRequest, Unit, PagedResponseListBusinessInfo } from "@think-id/types"

export type CreateBusinessData = BusinessInfoRequest
export type UpdateBusinessData = Partial<BusinessInfoRequest> & {
  status?: string
}

export class BusinessRepository {
  async create(data: CreateBusinessData): Promise<BusinessInfo> {
    const result = await apiRequest<BusinessInfo>("/api/BusinessInfo/addBusinessInfo", "POST", data)
    return result
  }

  async findById(id: string): Promise<BusinessInfo | null> {
    try {
      const result = await apiRequest<BusinessInfo>(`/api/BusinessInfo/${id}`, "GET")
      return result
    } catch (error) {
      console.error(`Error finding business ${id}:`, error)
      return null
    }
  }

  async findByEmail(email: string): Promise<BusinessInfo[]> {
    const result = await apiRequest<PagedResponseListBusinessInfo>("/api/BusinessInfo/getBusinessInfos", "GET", undefined, {
      params: { email }
    })
    return result.item || []
  }

  async findByUserId(userId: string): Promise<BusinessInfo[]> {
    const result = await apiRequest<PagedResponseListBusinessInfo>("/api/BusinessInfo/getBusinessInfos", "GET", undefined, {
      params: { userId }
    })
    return result.item || []
  }

  async findByUser(userId: string, email: string): Promise<BusinessInfo[]> {
    const result = await apiRequest<PagedResponseListBusinessInfo>("/api/BusinessInfo/getBusinessInfos", "GET", undefined, {
      params: { userId, email }
    })
    return result.item || []
  }

  async findAll(options?: {
    skip?: number
    take?: number
    where?: any
  }): Promise<BusinessInfo[]> {
    const page = options?.skip ? Math.floor(options.skip / (options.take || 10)) : 0
    const size = options?.take || 10

    const result = await apiRequest<PagedResponseListBusinessInfo>("/api/BusinessInfo/getBusinessInfos", "GET", undefined, {
      params: { page: page.toString(), size: size.toString() }
    })
    return result.item || []
  }

  async update(id: string, data: UpdateBusinessData): Promise<BusinessInfo> {
    const result = await apiRequest<BusinessInfo>(`/api/BusinessInfo/${id}`, "PUT", data)
    return result
  }

  async delete(id: string): Promise<Unit> {
    return await apiRequest<Unit>(`/api/BusinessInfo/${id}`, "DELETE")
  }

  async count(where?: any): Promise<number> {
    const result = await apiRequest<PagedResponseListBusinessInfo>("/api/BusinessInfo/getBusinessInfos", "GET", undefined, {
      params: { size: "1" }
    })
    return Number(result.totalItems || 0)
  }

  async findByStatus(status: string): Promise<BusinessInfo[]> {
    const result = await apiRequest<PagedResponseListBusinessInfo>("/api/BusinessInfo/getBusinessInfos", "GET", undefined, {
      params: { status }
    })
    return result.item || []
  }

  async findByCategory(category: string): Promise<BusinessInfo[]> {
    const result = await apiRequest<PagedResponseListBusinessInfo>("/api/BusinessInfo/getBusinessInfos", "GET", undefined, {
      params: { category }
    })
    return result.item || []
  }

  async findByLocation(county: string, subCounty?: string): Promise<BusinessInfo[]> {
    const result = await apiRequest<PagedResponseListBusinessInfo>("/api/BusinessInfo/getBusinessInfos", "GET", undefined, {
      params: { county, subCounty: subCounty || "" }
    })
    return result.item || []
  }

  async search(query: string): Promise<BusinessInfo[]> {
    const result = await apiRequest<PagedResponseListBusinessInfo>("/api/BusinessInfo/getBusinessInfos", "GET", undefined, {
      params: { search: query }
    })
    return result.item || []
  }

  async registerEvent(id: string): Promise<string> {
    return await apiRequest<string>(`/api/BusinessInfo/${id}/register-event`, "POST")
  }
}

export const businessRepository = new BusinessRepository()
