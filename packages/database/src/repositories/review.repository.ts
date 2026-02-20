import { apiRequest } from "../api-client";

export class ReviewRepository {
  async create(data: any) {
    return await apiRequest("/api/Reviews/addReview", "POST", data);
  }

  async findAll(page = 0, size = 10) {
    return await apiRequest("/api/Reviews/getReviews", "GET", undefined, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  async findById(id: string) {
    return await apiRequest(`/api/Reviews/${id}`, "GET");
  }

  async update(id: string, data: any) {
    return await apiRequest(`/api/Reviews/${id}`, "PUT", data);
  }

  async delete(id: string) {
    return await apiRequest(`/api/Reviews/${id}`, "DELETE");
  }

  async deleteAll() {
    return await apiRequest("/api/Reviews/all", "DELETE");
  }
}

export const reviewRepository = new ReviewRepository();
