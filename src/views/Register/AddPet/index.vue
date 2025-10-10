<template>
  <div class="container-fluid bg-light min-vh-100 d-flex align-items-center">
    <div class="row w-100">
      <!-- 왼쪽: 로고/일러스트 -->
      <div
        class="col-md-6 d-flex flex-column align-items-center justify-content-center"
      >
        <img
          src="@/assets/logo_white_bigsize.png"
          alt="로고"
          class="img-fluid mb-4"
          style="max-width: 250px"
        />
        <img
          src="@/assets/catdog.png"
          alt="고양이개"
          class="img-fluid"
          style="width: 260px"
        />
      </div>

      <!-- 오른쪽: 등록 폼 -->
      <div class="col-md-6 d-flex justify-content-center">
        <div
          class="card shadow border-brown p-4"
          style="max-width: 480px; width: 100%"
        >
          <h4 class="text-brown fw-bold mb-4 text-center">Register Pet</h4>

          <form @submit.prevent="submit">
            <div class="vstack gap-3">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-paw"></i></span>
                <input
                  v-model.trim="pet.petName"
                  type="text"
                  class="form-control"
                  placeholder="반려견 이름"
                  required
                />
              </div>

              <div class="input-group">
                <span class="input-group-text"
                  ><i class="bi bi-emoji-smile"></i
                ></span>
                <input
                  v-model.trim="pet.petBreed"
                  type="text"
                  class="form-control"
                  placeholder="품종 (예: 푸들)"
                  required
                />
              </div>

              <div class="input-group">
                <span class="input-group-text"
                  ><i class="bi bi-gender-ambiguous"></i
                ></span>
                <select v-model="pet.petGender" class="form-select" required>
                  <option value="M">남</option>
                  <option value="F">여</option>
                </select>
              </div>

              <div class="input-group">
                <span class="input-group-text"
                  ><i class="bi bi-capslock"></i
                ></span>
                <input
                  v-model.number="pet.petWeight"
                  type="number"
                  class="form-control"
                  placeholder="몸무게 (kg)"
                  min="0"
                  required
                />
              </div>

              <div class="form-floating">
                <textarea
                  v-model.trim="pet.petDesc"
                  class="form-control"
                  placeholder="소개를 입력하세요"
                  style="height: 100px"
                ></textarea>
                <label>소개</label>
              </div>

              <!-- 이미지 업로드 -->
              <div class="text-center">
                <label class="btn btn-outline-brown rounded-pill">
                  <i class="bi bi-image me-2"></i> 이미지 업로드
                  <input
                    type="file"
                    accept="image/*"
                    class="d-none"
                    @change="onSelectImage"
                  />
                </label>
                <div v-if="previewUrl" class="mt-3">
                  <img
                    :src="previewUrl"
                    alt="미리보기"
                    class="rounded-circle object-cover border"
                    width="120"
                    height="120"
                  />
                </div>
              </div>

              <button type="submit" class="btn btn-brown mt-3 py-2">
                <span class="paw me-2">🐾</span> 등록하기
              </button>

              <button
                type="button"
                class="btn btn-outline-secondary mt-2"
                @click="goBack"
              >
                취소
              </button>
            </div>
          </form>
        </div>
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
  petBreed: "",
  petWeight: 0,
  petGender: "M",
  petDesc: "",
  petAttach: null,
});

const previewUrl = ref(null);

function onSelectImage(e) {
  const file = e.target.files[0];
  if (file) {
    pet.value.petAttach = file;
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = URL.createObjectURL(file);
  }
}

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
      router.push(`/Profile/${store.state.user.userId}`);
    } else {
      alert(res.data.message || "등록 실패");
    }
  } catch (err) {
    console.error("펫 등록 실패:", err);
    alert("업데이트 중 오류가 발생했습니다.");
  }
}

function goBack() {
  router.push(`/Profile/${store.state.user.userId}`);
}
</script>

<style scoped>
.border-brown {
  border: 2px solid #6b4a2b !important;
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
</style>
