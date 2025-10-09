// src/store/index.js
import { createStore } from "vuex";
import axiosConfig from "@/apis/axiosConfig";
import post from "./post";
import review from "./review";
import userApi from "@/apis/userApi";
import pet from "./pet";

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
    searchResults: [],
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
    getSearchResult(state) {
      return state.searchResults;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setJwt(state, payload) {
      state.jwt = payload;
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
    setSearchResults(state, results) {
      state.searchResults = results || [];
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

    async searchUserByLoginId({ commit }, query) {
      try {
        const res = await userApi.searchUserByLoginId(query);
        if(res.data.result === "success") {
          commit("setSearchResults", [res.data.user]);
        } else {
          commit("setSearchResults", []);
        }
      } catch (e) {
        commit("setSearchResults", []);
      }
    }
  },
  modules: { post, review, pet },
});

export default store;
