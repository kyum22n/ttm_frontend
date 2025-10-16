import axios from "axios";
import store from "@/store";
import router from "@/router";

// 기본 URL 지정
axios.defaults.baseURL = "http://localhost:8080";

// JWT 토큰을 axios 요청 헤더에 자동으로 추가
// 서버와 통신할 때 사용자 인증하기 위해
// Bearer <jwt> 형식으로 들어감

// 초기 세팅용
function addAuthHeader(jwt) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
}

// JWT 토큰을 헤더에서 제거
function removeAuthHeader() {
  delete axios.defaults.headers.common["Authorization"];
}

// 요청 인터셉터
// 매 요청 자동 적용용
axios.interceptors.request.use(
  (config) => {
    const token = store.state.jwt || localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      store.dispatch("removeAuth");
      router.push("/auth/login");
    }
    return Promise.reject(error);
  }
);

// 다른곳에서 import 하기 위해 ex) store
export default { addAuthHeader, removeAuthHeader };

