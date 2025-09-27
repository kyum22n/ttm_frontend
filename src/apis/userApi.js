import axios from "axios";

function userJoin(user) {
  return axios.post("/user/join", user);
}

function userInfo(userId, jwt) {
  return axios.get("/user/info", {
    params: { userId },
    headers: {
      Authorization: "Bearer " + jwt,
    },
  });
}

const userApi = {
  userJoin,
  userInfo,
};

export default userApi;
