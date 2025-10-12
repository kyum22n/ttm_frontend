<template>
  <div class="container py-5">
    <div class="card border-3 rounded-4 shadow-sm profile-frame">
      <div class="card-body p-4 p-md-5">
        <h4 class="fw-bold text-brown mb-4">Edit Pet</h4>

        <div class="row g-5 align-items-start">
          <!-- 왼쪽: 아바타 미리보기 -->
          <div class="col-12 col-md-4 d-flex flex-column align-items-center">
            <div class="avatar-wrap mb-3">
              <img v-if="previewUrl" :src="previewUrl" class="rounded-circle object-cover border" width="220" height="220" alt="미리보기" />
              <div v-else class="rounded-circle bg-light border d-flex align-items-center justify-content-center" style="width: 220px; height: 220px">
                <i class="bi bi-image text-muted fs-1"></i>
              </div>
            </div>

            <div class="d-grid gap-2 w-100" style="max-width: 260px">
              <label class="btn btn-outline-secondary btn-sm rounded-pill">
                사진 변경
                <input type="file" accept="image/*" class="d-none" @change="onSelectImage" />
              </label>
            </div>
          </div>

          <!-- 오른쪽: 수정 폼 -->
          <div class="col-12 col-md-8">
            <form @submit.prevent="submit">
              <div class="vstack gap-3">
                <!-- 이름 -->
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-heart text-brown"></i>
                  </span>
                  <input v-model.trim="pet.petName" type="text" class="form-control" placeholder="반려견 이름" required />
                </div>

                <!-- 생년월일 -->
                <!-- 생년월일 -->
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-calendar3 text-brown"></i>
                  </span>
                  <input v-model="pet.petBirthDay" type="date" class="form-control" />
                </div>
                <p v-if="!pet.petBirthDay" class="text-muted small mt-1">등록된 생일 정보가 없습니다.</p>

                <!-- 품종 -->
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-emoji-smile text-brown"></i>
                  </span>
                  <input v-model.trim="pet.petBreed" type="text" class="form-control" placeholder="품종 (예: 푸들)" required />
                </div>

                <!-- 성별 -->
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-gender-ambiguous text-brown"></i>
                  </span>
                  <select v-model="pet.petGender" class="form-select" required>
                    <option value="M">남</option>
                    <option value="F">여</option>
                  </select>
                </div>

                <!-- 몸무게 -->
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-capslock text-brown"></i>
                  </span>
                  <input v-model.number="pet.petWeight" type="number" class="form-control" placeholder="몸무게 (kg)" min="0" required />
                  <span class="input-group-text">kg</span>
                </div>

                <!-- 소개 -->
                <div class="form-floating">
                  <textarea v-model.trim="pet.petDesc" class="form-control" placeholder="소개를 입력하세요" style="height: 100px"></textarea>
                  <label>소개</label>
                </div>

                <!-- 버튼 -->
                <div class="text-center mt-3">
                  <button type="submit" class="btn btn-brown px-5 py-2 rounded-pill"><span class="paw me-2">🐾</span> 수정 완료</button>

                  <button type="button" class="btn btn-outline-secondary px-4 py-2 rounded-pill ms-2" @click="goBack">취소</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- 귀여운 장식 -->
        <div class="d-none d-md-block cute-pets">🐶 🐱 🐾</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const store = useStore();
const router = useRouter();
const route = useRoute();

const previewUrl = ref(null);
const pet = ref({
  petId: null,
  petUserId: store.state.user.userId,
  petName: "",
  petBirthDay: "",
  petBreed: "",
  petWeight: 0,
  petGender: "M",
  petDesc: "",
  petAttach: null,
});

// 🧩 이미지 변경 시 미리보기
function onSelectImage(e) {
  const file = e.target.files[0];
  if (file) {
    pet.value.petAttach = file;
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = URL.createObjectURL(file);
  }
}

// 🧩 페이지 로드 시 기존 펫 정보 불러오기
onMounted(async () => {
  const petId = route.params.petId;
  if (!petId) {
    alert("잘못된 접근입니다.");
    router.push(`/mypage/${store.state.user.userId}`);
    return;
  }

  try {
    const res = await axios.get("/pet/find", { params: { petId } });
    const data = res.data.pet;

    // ✅ 날짜 문자열 정규화
    if (data.petBirthDay) {
      let raw = data.petBirthDay;

      // "2025-10-10T00:00:00" → "2025-10-10"
      if (raw.includes("T")) raw = raw.split("T")[0];

      // "20251010" → "2025-10-10"
      if (/^\d{8}$/.test(raw)) {
        raw = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
      }

      data.petBirthDay = raw;
    }

    Object.assign(pet.value, data);
    pet.value = { ...pet.value };

    if (data.petId) {
      previewUrl.value = `/pet/image/${data.petId}?v=${Date.now()}`;
    }
  } catch (err) {
    console.error("펫 정보 불러오기 실패:", err);
    alert("펫 정보를 불러오는 중 오류가 발생했습니다.");
    router.push(`/mypage/${store.state.user.userId}`);
  }
});

// 🧩 수정 요청
async function submit() {
  try {
    // ✅ 날짜 형식 보정
    if (pet.value.petBirthDay) {
      const dateObj = new Date(pet.value.petBirthDay);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");
      pet.value.petBirthDay = `${yyyy}-${mm}-${dd}`; // ✅ "yyyy-MM-dd"로 변환
    }

    const formData = new FormData();
    for (const key in pet.value) {
      if (pet.value[key] != null) formData.append(key, pet.value[key]);
      console.log([...formData.entries()]);
    }

    if (!formData.has("petUserId")) {
      formData.append("petUserId", store.state.user.userId);
    }

    const res = await axios.put("/pet/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data && res.data.petId) {
      alert("반려견 정보가 수정되었습니다!");
      router.push(`/mypage/${store.state.user.userId}`);
    } else {
      alert("수정 실패. 다시 시도해주세요.");
    }
  } catch (err) {
    console.error("펫 수정 실패:", err);
    alert("업데이트 중 오류가 발생했습니다.");
  }
}

// 🧩 취소 시 뒤로가기
function goBack() {
  router.push(`/mypage/${store.state.user.userId}`);
}
</script>

<style scoped>
.profile-frame {
  max-width: 960px;
  margin: auto;
}
.text-brown {
  color: #6b4a2b;
}
.btn-brown {
  background-color: #6b4a2b;
  color: white;
  border: none;
}
.btn-brown:hover {
  background-color: #5b3d22;
}
.object-cover {
  object-fit: cover;
}
.avatar-wrap img {
  width: 220px;
  height: 220px;
  object-fit: cover;
}
.cute-pets {
  text-align: center;
  font-size: 1.6rem;
  margin-top: 2rem;
}
.input-group-text {
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #6b4a2b;
}
</style>
