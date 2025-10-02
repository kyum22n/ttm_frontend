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
    // 로그인 상태 판단
    isLogin(state) {
      return !!state.jwt; // jwt 있으면 true
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
      localStorage.setItem("user", payload.user);
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
      const user = localStorage.getItem("user") || "";
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
