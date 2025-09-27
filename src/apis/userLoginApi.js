import axios from "axios";

function userLogin(loginForm) {
  return axios.post("/user-login/login", loginForm);
}

const userLoginApi = {
  userLogin,
};

export default userLoginApi;
