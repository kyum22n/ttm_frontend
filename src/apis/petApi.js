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
  function petFind(petId){
    return axios.get("/pet/find", {params: {petId}});
  }

  // 좋아요 등록
  function petLike(userId, petId){
    return axios.post("/like/pet-like", {params: {userId,petId}});
  }

  // 좋아요 취소
  function petLikeCancel(userId, petId){
    return axios.delete("/like/pet-like/cancel", {params: {userId, petId}});
  }

const petApi = {
  register,
  update,
  remove,
  findAllByUser,
  petFind,
  petLike,
  petLikeCancel
};

export default petApi;
