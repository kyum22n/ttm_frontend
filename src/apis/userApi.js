import axios from "axios";

// 회원가입 (User + Pet + 파일)
function userJoin(user, pet) {
  const formData = new FormData();

  // User 데이터
  for (const key in user) {
    if (user[key] != null) {
      formData.append(key, user[key]);
    }
  }

  // Pet 데이터
  for (const key in pet) {
    if (pet[key] != null && key !== "petAttach") {
      formData.append(key, pet[key]);
    }
  }

  // Pet 이미지 파일
  if (pet.petAttach) {
    formData.append("petAttach", pet.petAttach);
  }

  return axios.post("/user/join", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// 유저 정보 조회
function userInfo(userId, jwt) {
  return axios.get("/user/info", {
    params: { userId },
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
}

function userUpdate(user){
  return axios.put("/user/update", user);
}

const userApi = { 
  userJoin, 
  userInfo,
  userUpdate
};
export default userApi;
