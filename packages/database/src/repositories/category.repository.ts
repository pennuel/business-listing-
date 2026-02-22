// Category repository - handles all category-related API operations
import { apiRequest } from "../api-client"
import { Category, PagedResponseListCategory } from "@think-id/types"

export class CategoryRepository {
  async findAll(options?: { page?: number; size?: number }): Promise<Category[]> {
    const params: Record<string, string> = {}
    if (options?.page !== undefined) params.page = options.page.toString()
    if (options?.size !== undefined) params.size = options.size.toString()

    const result = await apiRequest<PagedResponseListCategory>("/api/Category/getCategories", "GET", undefined, {
      params,
    })
    return result.item || []
  }

  async findById(id: number): Promise<Category | null> {
    try {
      const result = await apiRequest<Category>(`/api/Category/getCategory`, "GET", undefined, {
        params: { CategoryId: id.toString() }
      })
      return result
    } catch (error) {
      console.error(`Error finding category ${id}:`, error)
      return null
    }
  }

  async create(data: Partial<Category>): Promise<Category> {
    const result = await apiRequest<Category>("/api/Category/addCategory", "POST", data)
    return result
  }

  async deleteOne(id: number): Promise<void> {
    await apiRequest<void>("/api/Category/deleteOne", "DELETE", undefined, {
      params: { id: id.toString() }
    })
  }
}

export const categoryRepository = new CategoryRepository()
