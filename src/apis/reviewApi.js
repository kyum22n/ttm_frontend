import axios from "axios";

function getReceivedReviews(userId, opts = {}) {
  return axios.get(`/users/${userId}/reviews`, { ...opts });
}

export default { getReceivedReviews };