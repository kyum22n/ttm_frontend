import axios from "axios";

// 회원가입
function userJoin(user) {
  return axios.post("/user/join", user);
}

// 사용자 정보를 가져옴
// userId는 쿼리 파라미터로 보내고
// jwt 토큰은 authorization 헤더에 포함 시켜 인증
// 유저 정보를 불러올떄 해당 유저인지 확인하기 위함
function userInfo(userId, jwt) {
  return axios.get("/user/info", {
    params: { userId },
    headers: {
      // 여기서 헤더에 넣음
      Authorization: "Bearer " + jwt,
    },
  });
}

// 함수 정리
const userApi = {
  userJoin,
  userInfo,
};

// 내보내기
export default userApi;
