import axios from "axios";

const petApi = {
  // 펫 추가 등록
  register(pet) {
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
  },

  // 펫 수정
  update(pet) {
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
  },

  // 펫 삭제
  remove(petId) {
    return axios.delete(`/pet/remove/${petId}`);
  },

  // 유저의 모든 펫 조회
  findAllByUser(userId) {
    return axios.get("/pet/find-allpetbyuser", { params: { petUserId: userId } });
  },
};

export default petApi;
