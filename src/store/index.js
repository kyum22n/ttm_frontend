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
    getUser: (state) => state.user,
    getJwt: (state) => state.jwt,
    isLogin: (state) => !!state.jwt,
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
      localStorage.setItem("user", JSON.stringify(payload.user));
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
