import axios from "axios";

const petApi = {
  // 펫 등록
  register(petData) {
    // formData 전송 (이미지 포함될 수 있음)
    const formData = new FormData();
    for (const key in petData) {
      formData.append(key, petData[key]);
    }
    return axios.post("http://localhost:8080/pet/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default petApi;
