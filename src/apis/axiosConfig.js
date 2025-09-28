import axios from "axios";

// 기본 URL 지정
axios.defaults.baseURL = "http://localhost:8080";

// JWT 토큰을 axios 요청 헤더에 자동으로 추가
// 서버와 통신할 때 사용자 인증하기 위해
// Bearer <jwt> 형식으로 들어감
function addAuthHeader(jwt) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
}

// JWT 토큰을 헤더에서 제거
function removeAuthHeader() {
  delete axios.defaults.headers.common["Authorization"];
}

// 다른곳에서 import 하기 위해 ex) store
export default { addAuthHeader, removeAuthHeader };
