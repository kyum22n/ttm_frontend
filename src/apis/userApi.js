import axios from "axios";

// 회원가입 (User + Pet + 파일)
// user, pet 받아서 FormData로 변환
function userJoin(user, pet) {
  const formData = new FormData();

  // User 데이터
  for (const key in user) {
    // 데이터 중에 null이 아닌 값만 Form 데이터에 추가
    if (user[key] != null) {
      formData.append(key, user[key]);
    }
  }

  // Pet 데이터
  for (const key in pet) {
    // Pet도 null이 아닌 값만 추가
    // petAttach는 따로 처리
    if (pet[key] != null && key !== "petAttach") {
      formData.append(key, pet[key]);
    }
  }

  // Pet 이미지 파일
  if (pet.petAttach) {
    formData.append("petAttach", pet.petAttach);
  }

  // Axios로 /user/join POST 요청
  return axios.post("/user/join", formData, {
    // 서버에서 @RequestParam/ @RequestPart로 파일 받을 수 있음
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// 유저 정보 조회
// 서버에서 로그인된 사용자의 정보를 JSON으로 반환
function userInfo(userId, jwt) {
  // GET 요청
  return axios.get("/user/info", {
    // Params로 userId 전달
    params: { userId },
    headers: {
      // JWT 토큰을 Authorization 헤더에 담아 인증
      "Authorization": "Bearer " +jwt
    }
  });
}

// PUT 요청
function userUpdate(user) {
	// DB 갱신
  return axios.put("/user/update", user);
}

// 로그인 아이디로 유저 검색
function searchUserByLoginId(userLoginId) {
  return axios.get("/user/search/by-login-id", {
    params: { userLoginId },
  });
}

const userApi = {
  userJoin,
  userInfo,
  userUpdate,
  searchUserByLoginId
};
export default userApi;
