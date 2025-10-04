// src/store/index.js
import { createStore } from "vuex";
import axiosConfig from "@/apis/axiosConfig";
import post from "./post";
import review from "./review";

const store = createStore({
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
    signupUser: null,
    jwt: "",
  },
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
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setJwt(state, payload) {
      state.jwt = payload;
    },
    clearAuth(state) {
      state.jwt = "";
      state.user = {
        userId: "",
        userLoginId: "",
        userName: "",
        userEmail: "",
        userAddress: "",
        userBirthDate: "",
        profileImage: "",
      };
    },
  },
  actions: {
    saveAuth(context, payload) {
      context.commit("setUser", payload.user);
      context.commit("setJwt", payload.jwt);

      // LocalStorage에 저장
      // 25.10.04 LocalStorage는 문자열로만 저장 하기때문에 서버에서 넘어온 JSON 객체는 JSON 문자열로 변환하여 저장해야 함
      // 꺼내올 때는 JSON.parse()로 다시 JS 객체로 복원해서 사용해야 한다. -> loadAuthFromStorage() 참고
      // JWT는 발급 되었을 때 이미 문자열 형ㅌ애로 넘어오기 떄문에 JSON으로 변환하지 않아도 됨
      localStorage.setItem("user", JSON.stringify(payload.user)); //Json 문자열로 변환
      localStorage.setItem("jwt", payload.jwt);
      axiosConfig.addAuthHeader(payload.jwt);
    },
    removeAuth(context) {
      context.commit("clearAuth");
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");
      axiosConfig.removeAuthHeader();
    },
    loadAuthFromStorage(context) {
      try {
        const userStr = localStorage.getItem("user");
        const jwt = localStorage.getItem("jwt") || "";
        const user = userStr
          ? JSON.parse(userStr)
          : {
              userId: "",
              userLoginId: "",
              userName: "",
              userEmail: "",
              userAddress: "",
              userBirthDate: "",
              profileImage: "",
            };
        context.commit("setUser", user);
        context.commit("setJwt", jwt);
        if (jwt) axiosConfig.addAuthHeader(jwt);
      } catch (e) {
        console.error("loadAuthFromStorage error:", e);
        context.commit("clearAuth");
      }
    },
  },
  modules: { post, review },
});

export default store;
