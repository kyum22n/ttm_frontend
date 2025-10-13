<template>
  <div class="container-fluid bg-light min-vh-100 d-flex align-items-center">
    <div class="row w-100">
      <!-- 왼쪽 영역 -->
      <div class="col-md-6 d-flex flex-column align-items-center justify-content-center">
        <img src="@/assets/logo_white_bigsize.png" alt="로고" class="img-fluid" style="max-width: 300px;" />
        <div class="d-flex gap-4">
          <img src="@/assets/catdog.png" alt="고양이개" class="img-fluid" style="width:300px;" />
        </div>
      </div>

      <!-- 오른쪽 등록 박스 -->
      <div class="col-md-6 d-flex justify-content-center">
        <div class="card border-brown shadow p-4" style="max-width:500px; width:100%;">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-brown m-0">Register Pet</h4>
            <router-link to="/Auth/Login" class="btn btn-outline-brown btn-sm">Login</router-link>
          </div>

          <!-- 프로필 사진 업로드 -->
          <div class="text-center mb-3">
            <label for="petImage" style="cursor:pointer;">
              <img
                :src="previewImage || defaultImage"
                alt="프로필"
                class="rounded-circle border"
                style="width:100px; height:100px; object-fit:cover;"
              />
              <input id="petImage" type="file" class="d-none" accept="image/*" @change="onFileChange" />
            </label>
            <!-- 이미지 선택 안 했을 때 경고 표시 -->
            <div v-if="triedSubmit && !pet.petAttach" class="text-danger small mt-1">
              프로필 이미지를 등록해주세요.
            </div>
          </div>

          <!-- 소개 -->
          <div class="mb-3">
            <textarea
              v-model="pet.petDesc"
              class="form-control"
              rows="3"
              placeholder="반려동물을 소개해주세요"
            ></textarea>
          </div>

          <form @submit.prevent="handleRegister">
            <div class="mb-3 input-group">
              <span class="input-group-text">🐾</span>
              <input v-model="pet.petName" type="text" class="form-control" placeholder="Pet Name" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">📅</span>
              <input v-model="pet.petBirthDay" type="date" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label text-brown">Gender</label><br />
              <div class="form-check form-check-inline">
                <input v-model="pet.petGender" class="form-check-input" type="radio" id="male" value="M" required />
                <label class="form-check-label" for="male">Male</label>
              </div>
              <div class="form-check form-check-inline">
                <input v-model="pet.petGender" class="form-check-input" type="radio" id="female" value="F" />
                <label class="form-check-label" for="female">Female</label>
              </div>
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">⚖️</span>
              <input v-model="pet.petWeight" type="number" class="form-control" placeholder="Weight" />
              <span class="input-group-text">kg</span>
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">🦴</span>
              <input v-model="pet.petBreed" type="text" class="form-control" placeholder="Breed" />
            </div>

            <!-- 오류 / 성공 메시지 -->
            <div v-if="errorMessage" class="text-danger text-center mb-2 small">{{ errorMessage }}</div>
            <div v-if="successMessage" class="text-success text-center mb-2 small">{{ successMessage }}</div>

            <button type="submit" class="btn btn-brown w-100">펫 등록 완료</button>
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
import userApi from "@/apis/userApi";

const store = useStore();
const router = useRouter();

const pet = ref({
  petName: "",
  petBirthDay: "",
  petGender: "",
  petWeight: "",
  petBreed: "",
  petDesc: "",
  petAttach: null,
});

const previewImage = ref(null);
const defaultImage = "@/assets/default-profile.png";
const errorMessage = ref("");
const successMessage = ref("");
const triedSubmit = ref(false); // 제출 시도 여부 (이미지 필수 경고용)

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    pet.value.petAttach = file;
    previewImage.value = URL.createObjectURL(file);
  }
}

async function handleRegister() {
  triedSubmit.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  // 프로필 이미지 필수 검사
  if (!pet.value.petAttach) {
    return;
  }

  try {
    const user = store.state.signupUser;
    if (!user) {
      errorMessage.value = "회원 정보가 없습니다. 다시 회원가입을 진행해주세요.";
      setTimeout(() => router.push("/Register/User"), 1500);
      return;
    }

    const response = await userApi.userJoin(user, pet.value);
    const result = response.data;

    if (result.result === "success") {
      successMessage.value = "🎉 회원가입이 완료되었습니다! 잠시 후 로그인 화면으로 이동합니다.";
      store.commit("clearSignupUser");
      setTimeout(() => router.push("/Auth/Login"), 2000);
    } else {
      errorMessage.value = result.message || "등록 중 오류가 발생했습니다.";
    }
  } catch (error) {
    console.error("회원가입 중 오류:", error);
    errorMessage.value = error.response?.data?.message || "서버 통신 중 오류가 발생했습니다.";
  }
}
</script>

<style scoped>
.text-brown { color: #6b4a2b; }
.border-brown { border: 2px solid #6b4a2b; }
.btn-brown { background-color: #6b4a2b; color: white; }
.btn-brown:hover { background-color: #56351f; }
.btn-outline-brown { color: #6b4a2b; border: 1px solid #6b4a2b; }
.btn-outline-brown:hover { background-color: #f9f4ef; }
.text-danger, .text-success { font-size: 0.9rem; transition: opacity 0.3s ease; }
</style>
