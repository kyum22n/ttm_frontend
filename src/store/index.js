// 상태를 관리하기 위해
import { createStore } from "vuex";
// JWT 토큰을 요청 헤더에 추가 제거 할때
import axiosConfig from "@/apis/axiosConfig";
import post from "./post";
import review from "./review";

const store = createStore({
  // 전역 상태 정의
  state: {
    user: {
      userId: "",
      userLoginId: "",
      userName: "",
      userEmail: "",
      userAddress: "",
      userBirthDate: "",
      profileImage: "",
    },
    signupUser: null, // 회원가입 단계에서 임시 저장
    jwt: "",
  },

  // state를 읽기 전용으로 가져올 때 사용
  getters: {
    // 현재 로그인 사용자 정보 반환
    getUser(state) {
      return state.user;
    },
    // 현재 JWT 반환
    getJwt(state) {
      return state.jwt;
    },
    // 로그인 상태 판단(jwt + userId 확인)
    isLogin(state) {
      return !!state.jwt && !!state.user && !!state.user.userId; // jwt 있으면 true
    },
  },

  // state를 실제로 변경하는 곳 (동기적)
  mutations: {
    setUser(state, payload) { // 로그인용
      // payload로 받은 사용자 정보를 state.user에 저장
      state.user = payload;
    },
    setSignupUser(state, payload) { // 회원가입 임시 저장용
      state.signupUser = payload;
    },
    clearUser(state) {
      state.user = null;
    },
    clearSignupUser(state) {
      state.signupUser = null;
    },
    setLoginId(state, loginId) {
      state.user.userLoginId = loginId;
    },
    setJwt(state, payload) {
      state.jwt = payload;
    },
    clearAuth(state) {
      state.user = {
        userId: "",
        userLoginId: "",
        userName: "",
        userEmail: "",
        userAddress: "",
        userBirthDate: "",
      };
      state.jwt = "";
    },
  },

  // 비동기 로직 or 여러 mutation 호출
  actions: {
    saveAuth(context, payload) {
      // payload = { user, jwt }
      context.commit("setUser", payload.user);
      context.commit("setJwt", payload.jwt);

      // LocalStorage에 저장
      // 25.10.04 LocalStorage는 문자열로만 저장 하기때문에 서버에서 넘어온 JSON 객체는 JSON 문자열로 변환하여 저장해야 함
      // 꺼내올 때는 JSON.parse()로 다시 JS 객체로 복원해서 사용해야 한다. -> loadAuthFromStorage() 참고
      // JWT는 발급 되었을 때 이미 문자열 형ㅌ애로 넘어오기 떄문에 JSON으로 변환하지 않아도 됨
      localStorage.setItem("user", JSON.stringify(payload.user)); //Json 문자열로 변환
      localStorage.setItem("jwt", payload.jwt);

      // Axios Authorization 헤더 추가
      axiosConfig.addAuthHeader(payload.jwt);
    },

    removeAuth(context) {
      context.commit("clearAuth");

      // LocalStorage에서 값 삭제
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");

      // Axios Authorization 헤더 제거
      axiosConfig.removeAuthHeader();
    },

    loadAuthFromStorage(context) {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const jwt = localStorage.getItem("jwt") || "";

      context.commit("setUser", user);
      context.commit("setJwt", jwt);
      if (jwt != "") {
        axiosConfig.addAuthHeader(jwt);
      }
    },
  },

  modules: {
    post,
    review
  },
});

export default store;
