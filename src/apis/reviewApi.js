// src/apis/reviewApi.js
import axios from "axios";

// 프록시/베이스URL 설정이 이미 되어있다는 가정
// (없다면 axios 인스턴스나 baseURL 설정 권장)
function getReceivedReviews(userId) {
  return axios.get(`/review/users/${userId}/reviews`);
}

export default { getReceivedReviews };