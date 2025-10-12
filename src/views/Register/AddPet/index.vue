<template>
  <div class="container py-5">
    <div class="card border-3 rounded-4 shadow-sm profile-frame">
      <div class="card-body p-4 p-md-5">
        <h4 class="fw-bold text-brown mb-4">Register New Pet</h4>

        <div class="row g-5 align-items-start">
          <!-- 왼쪽: 아바타 미리보기 -->
          <div class="col-12 col-md-4 d-flex flex-column align-items-center">
            <div class="avatar-wrap mb-3">
              <img
                v-if="previewUrl"
                :src="previewUrl"
                class="rounded-circle object-cover border"
                width="220"
                height="220"
                alt="미리보기"
              />
              <div
                v-else
                class="rounded-circle bg-light border d-flex align-items-center justify-content-center"
                style="width: 220px; height: 220px"
              >
                <i class="bi bi-image text-muted fs-1"></i>
              </div>
            </div>

            <div class="d-grid gap-2 w-100" style="max-width: 260px">
              <label class="btn btn-outline-secondary btn-sm rounded-pill">
                사진 업로드
                <input
                  type="file"
                  accept="image/*"
                  class="d-none"
                  @change="onSelectImage"
                />
              </label>
            </div>
          </div>

          <!-- 오른쪽: 등록 폼 -->
          <div class="col-12 col-md-8">
            <form @submit.prevent="submit">
              <div class="vstack gap-3">
                <!-- 이름 -->
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-heart text-brown"></i>
                  </span>
                  <input
                    v-model.trim="pet.petName"
                    type="text"
                    class="form-control"
                    placeholder="반려견 이름"
                    required
                  />
                </div>

                <!-- 생년월일 -->
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-calendar3 text-brown"></i>
                  </span>
                  <input
                    v-model="pet.petBirthDay"
                    type="date"
                    class="form-control"
                    required
                  />
                </div>

                <!-- 품종 -->
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-emoji-smile text-brown"></i>
                  </span>
                  <input
                    v-model.trim="pet.petBreed"
                    type="text"
                    class="form-control"
                    placeholder="품종 (예: 푸들)"
                    required
                  />
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
                  <input
                    v-model.number="pet.petWeight"
                    type="number"
                    class="form-control"
                    placeholder="몸무게 (kg)"
                    min="0"
                    required
                  />
                  <span class="input-group-text">kg</span>
                </div>

                <!-- 소개 -->
                <div class="form-floating">
                  <textarea
                    v-model.trim="pet.petDesc"
                    class="form-control"
                    placeholder="소개를 입력하세요"
                    style="height: 100px"
                  ></textarea>
                  <label>소개</label>
                </div>

                <!-- 버튼 -->
                <div class="text-center mt-3">
                  <button
                    type="submit"
                    class="btn btn-brown px-5 py-2 rounded-pill"
                  >
                    <span class="paw me-2">🐾</span> 등록하기
                  </button>

                  <button
                    type="button"
                    class="btn btn-outline-secondary px-4 py-2 rounded-pill ms-2"
                    @click="goBack"
                  >
                    취소
                  </button>
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
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";

const store = useStore();
const router = useRouter();

const pet = ref({
  petUserId: store.state.user.userId,
  petName: "",
  petBirthDay: "", // ✅ 생년월일 추가
  petBreed: "",
  petWeight: 0,
  petGender: "M",
  petDesc: "",
  petAttach: null,
});

const previewUrl = ref(null);

// 이미지 미리보기
function onSelectImage(e) {
  const file = e.target.files[0];
  if (file) {
    pet.value.petAttach = file;
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = URL.createObjectURL(file);
  }
}

// 등록 요청
async function submit() {
  try {
    if (!pet.value.petName || !pet.value.petAttach) {
      alert("이름과 이미지는 필수입니다!");
      return;
    }

    const formData = new FormData();
    for (const key in pet.value) {
      if (pet.value[key] != null) formData.append(key, pet.value[key]);
    }

    const res = await axios.post("/pet/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.result === "success") {
      alert("새 반려견이 등록되었습니다!");
      router.push(`/mypage/${store.state.user.userId}`);
    } else {
      alert(res.data.message || "등록 실패");
    }
  } catch (err) {
    console.error("펫 등록 실패:", err);
    alert("업데이트 중 오류가 발생했습니다.");
  }
}

// 뒤로가기
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
  width: 44px; /* ✅ 고정 너비 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem; /* ✅ 아이콘 크기 동일 */
  color: #6b4a2b; /* 브랜드 색상 */
}
</style>
