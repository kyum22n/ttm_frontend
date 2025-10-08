import axios from "axios";

// 펫 추가 등록
function register(pet) {
  const formData = new FormData();
  for (const key in pet) {
    if (pet[key] != null && key !== "petAttach") {
      formData.append(key, pet[key]);
    }
  }
  if (pet.petAttach) {
    formData.append("petAttach", pet.petAttach);
  }
  return axios.post("/pet/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// 펫 수정
function update(pet) {
  const formData = new FormData();
  for (const key in pet) {
    if (pet[key] != null && key !== "petAttach") {
      formData.append(key, pet[key]);
    }
  }
  if (pet.petAttach) {
    formData.append("petAttach", pet.petAttach);
  }
  return axios.put("/pet/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// 펫 삭제
function remove(petId) {
  return axios.delete(`/pet/remove/${petId}`);
}

// 유저의 모든 펫 조회
function findAllByUser(userId) {
  return axios.get("/pet/find-allpetbyuser", { params: { petUserId: userId } });
}

// 특정 반려견 정보 조회
function petFind(petId) {
  return axios.get("/pet/find", { params: { petId } });
}

// 좋아요 등록
function petLike(userId, petId) {
  return axios.post("/like/pet-like", { params: { userId, petId } });
}

// 좋아요 취소
function petLikeCancel(userId, petId) {
  return axios.delete("/like/pet-like/cancel", { params: { userId, petId } });
}

// 첫번째 펫 참조 조회
async function firstPetOfUser(userId) {
  const res = await axios.get(`/pet/${userId}/first-pet`, {
    // 204도 정상 처리로 간주
    validateStatus: (s) => (s >= 200 && s < 300) || s === 204,
  });
  if (res.status === 204) return null;
  return res.data; // { petId, imageUrl }
}

// 유저 프로필 이미지 얻기
async function avatarUrlByUser(userId, basePrefix = "") {
  const ref = await firstPetOfUser(userId);
  if (!ref || !ref.imageUrl) return "";
  return basePrefix ? `${basePrefix}${ref.imageUrl}` : ref.imageUrl;
}

const petApi = {
  register,
  update,
  remove,
  findAllByUser,
  petFind,
  petLike,
  petLikeCancel,
  firstPetOfUser,
  avatarUrlByUser
};

export default petApi;
