import axios from "axios";

// 로그인
// loginForm 객체 전송
function userLogin(loginForm) {
  return axios.post("/user-login/login", loginForm);
}

// 아이디 찾기
function findId(email){
  return axios.post("/user-login/find-id", {email});
}

// 비밀번호 찾기
function findPassword(loginId){
  return axios.post("/user-login/find-password", {loginId});
}

// 함수 정리
const userLoginApi = {
  userLogin,
  findId,
  findPassword
};

// 내보내기
export default userLoginApi;
