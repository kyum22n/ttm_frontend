import axios from "axios";
import store from "@/store";
import router from "@/router";

// 공통 API 호출 함수
async function apiRequest(method, url, data = null, params = null) {
  const token = store.state.jwt || localStorage.getItem("jwt");

  try {
    // 기본 헤더 (Authorization만 공통으로 붙임)
    const headers = {};
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }

    // FormData가 아닌 경우에만 Content-Type JSON으로 세팅
    // FormData면 axios가 자동으로 multipart 헤더를 붙여줌
    if (data && !(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await axios({
      method,
      url,
      data, 
      params,
      headers,
    });
    return res;
  } catch (err) {
    const status = err.response?.status;
    if (status === 401) {
        // JWT 만료 or 유효하지 않음 → 알림 표시 + 로그아웃 처리
      alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
      // 인증 실패 → 자동 로그아웃
      store.dispatch("removeAuth");
      router.push("/auth/login");
    }
    throw err;
  }
}

export default apiRequest;
