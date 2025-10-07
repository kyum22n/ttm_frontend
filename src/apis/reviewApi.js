// src/apis/reviewApi.js
import axios from "axios";

/** 받은 리뷰 전체 조회 */
function getReceivedReviews(userId) {
  return axios.get(`/review/users/${userId}/reviews`);
}

/** 리뷰 작성 (단일 태그) */
function createReview(review) {
  return axios.post(`/review/write`, review, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });
}

/** 리뷰 태그 목록 조회 */
function getReviewTags() {
  return axios.get(`/review/tags`);
}

export default {
  getReceivedReviews,
  createReview,
  getReviewTags,
};
