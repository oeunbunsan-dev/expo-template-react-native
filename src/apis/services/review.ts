import { apiCore } from '../core';

class ReviewService {

  async getProductReviews(productId: string | number) {
    const response = await apiCore.get(`/reviews/product/${productId}`);
    return response.data;
  }


  async createReview(payload: { productId: string | number; rating: number; comment: string; [key: string]: any }) {
    const response = await apiCore.post('/reviews/', payload);
    return response.data;
  }


  async replyToReview(id: string | number, replyComment: string) {
    const response = await apiCore.post(`/reviews/${id}/reply`, { comment: replyComment });
    return response.data;

  }
}

export const reviewService = new ReviewService();
