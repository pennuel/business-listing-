// Category service - contains business logic and orchestrates repository calls
import { categoryRepository } from "../repositories/category.repository"
import { Category } from "@think-id/types"

export class CategoryService {
  async getCategories(options?: {
    page?: number
    size?: number
  }): Promise<{
    categories: Category[]
    total: number
    page: number
    totalPages: number
  }> {
    const page = options?.page || 0
    const size = options?.size || 20

    const categories = await categoryRepository.findAll({ page, size })

    // If result is paged, it should ideally have metadata.
    // Based on the PagedResponseListCategory implementation, it shows a list.
    // We'll return it as a list for now.
    return {
      categories,
      total: categories.length,
      page,
      totalPages: 1, // Placeholder
    }
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return await categoryRepository.findById(id)
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    return await categoryRepository.create(data)
  }

  async deleteCategory(id: number): Promise<void> {
    return await categoryRepository.deleteOne(id)
  }
}

export const categoryService = new CategoryService()
