import axios from "axios";

// 로그인
// loginForm 객체 전송
function userLogin(loginForm) {
  return axios.post("/user-login/login", loginForm);
}

// 함수 정리
const userLoginApi = {
  userLogin,
};

// 내보내기
export default userLoginApi;
