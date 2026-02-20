import { reviewRepository } from "../repositories/review.repository";

export class ReviewService {
  async createReview(data: any) {
    return await reviewRepository.create(data);
  }

  async getAllReviews(page?: number, size?: number) {
    return await reviewRepository.findAll(page, size);
  }

  async getReviewById(id: string) {
    return await reviewRepository.findById(id);
  }

  async updateReview(id: string, data: any) {
    return await reviewRepository.update(id, data);
  }

  async deleteReview(id: string) {
    return await reviewRepository.delete(id);
  }

  async deleteAllReviews() {
    return await reviewRepository.deleteAll();
  }
}

export const reviewService = new ReviewService();
