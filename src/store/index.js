// 상태를 관리하기 위해
import { createStore } from "vuex";
// JWT 토큰을 요청 헤더에 추가 제거 할때
import axiosConfig from "@/apis/axiosConfig";

// store변수 활용하기위한 store 선언
const store = createStore({
  // 전역 상태 정의
  state: {
    user: "",
    jwt: "",
  },
  // state를 바꿔서 가져올때 사용
  getters: {
    getUser(state, getters, rootState, rootGetters) {
      return state.user; // user 값 가져옴
    },
    getJwt(state, getters, rootState, rootGetters) {
      return state.jwt; // jwt 값을 가져옴
    },
  },
  // state를 실제로 변경
  mutations: {
    setUser(state, payload) {
      
      state.user = payload;
    },
    setJwt(state, payload) {
      state.jwt = payload;
    },
    setLoginId(state, loginId) {
      state.loginId = loginId;
    },
  },
  // 컴포넌트에서 호출 하기 위해
  // context는 action에서 자동으로 전달되는 객체
  // actions 안에서 state 접근 mutation 호출 등
  // 다른 action dispatch 도 가능
  actions: {
    saveAuth(context, payload) {
      // 전역 상태에 로그인 정보 저장
      context.commit("setLoginId", payload.loginId);
      context.commit("setJwt", payload.jwt);

      //Local 스토리지에 저장(브라우저 재시작할 때 유지)
      localStorage.setItem("LoginId", payload.loginId);
      localStorage.setItem("jwt", payload.jwt);

      //Axios의 공통 헤더로 Authorization을 추가
      axiosConfig.addAuthHeader(payload.jwt);
    },
    removeAuth(context, payload) {
      //전역 상태에서 값 삭제
      context.commit("setLoginId", "");
      context.commit("setJwt", "");

      //Local 스토리지에서 값 삭제
      localStorage.removeItem("LoginId");
      localStorage.removeItem("jwt");

      //Axios의 공통 헤더로 Authorization을 제거
      axiosConfig.removeAuthHeader();
    },
  },
  // store 기능 분리 위해서
  modules: {},
});

export default store;
