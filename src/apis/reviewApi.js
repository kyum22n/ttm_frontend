// src/apis/reviewApi.js
import axios from "axios";

// 프록시/베이스URL 설정이 이미 되어있다는 가정
// (없다면 axios 인스턴스나 baseURL 설정 권장)
function getReceivedReviews(userId) {
  return axios.get(`/review/users/${userId}/reviews`);
}

// 리뷰 작성 (JSON 전송 + JSON 응답 기대)
function createReview(review) {
  // review: { writerId, targetId, postId|null, requestOneId|null, reviewTagId }
  return axios.post(`/review/write`, review, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });
}

export default {
   getReceivedReviews,
   createReview 
};