<template>
  <div class="container-fluid bg-brown text-light min-vh-100 d-flex align-items-center">
    <div class="row w-100">
      <!-- 왼쪽 영역 -->
      <div class="col-md-6 d-flex flex-column align-items-center justify-content-center">
        <h1 class="fw-bold text-center mb-4">
          나와 <span class="fs-2">🐾</span><br />산책가개
        </h1>
        <div class="d-flex gap-4">
          <img src="@/assets/cat.png" alt="고양이" class="img-fluid" style="width:80px;" />
          <img src="@/assets/dog.png" alt="강아지" class="img-fluid" style="width:80px;" />
        </div>
      </div>

      <!-- 오른쪽 회원가입 박스 -->
      <div class="col-md-6 d-flex justify-content-center">
        <div class="card shadow-lg p-4" style="max-width:500px; width:100%;">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="text-brown m-0">Create account</h4>
            <router-link to="/Auth/Login" class="btn btn-outline-brown btn-sm">Login</router-link>
          </div>

          <!-- 프로필 이미지 업로드 (옵션) -->
          <div class="text-center mb-3">
            <label for="profileImage" style="cursor:pointer;">
              <img
                :src="previewImage || defaultImage"
                alt="프로필"
                class="rounded-circle border"
                style="width:100px; height:100px; object-fit:cover;"
              />
              <input id="profileImage" type="file" class="d-none" accept="image/*" @change="onFileChange" />
            </label>
          </div>

          <form @submit.prevent="handleSignup">
            <div class="mb-3 input-group">
              <span class="input-group-text">👤</span>
              <input v-model="user.userName" type="text" class="form-control" placeholder="이름" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">📅</span>
              <input v-model="user.userBirthDate" type="date" class="form-control" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">🆔</span>
              <input v-model="user.userLoginId" type="text" class="form-control" placeholder="아이디" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">✉️</span>
              <input v-model="user.userEmail" type="email" class="form-control" placeholder="이메일" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">🔒</span>
              <input v-model="user.userPassword" type="password" class="form-control" placeholder="비밀번호" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">🔒</span>
              <input v-model="confirm" type="password" class="form-control" placeholder="비밀번호 확인" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">🌍</span>
              <input v-model="user.userAddress" type="text" class="form-control" placeholder="지역" />
            </div>

            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" v-model="agree" id="agreeCheck" />
              <label class="form-check-label small" for="agreeCheck">개인정보 처리방침 동의</label>
            </div>

            <button type="submit" class="btn btn-brown w-100">회원가입</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import userApi from "@/apis/userApi";

const router = useRouter();

const user = ref({
  userLoginId: "user90",
  userPassword: "12345",
  userName: "kbh",
  userEmail: "exam@exam100.com",
  userAddress: "Anyang",
  userBirthDate: "2025-09-30",
});

const confirm = ref("");
const agree = ref(false);

const defaultImage = "@/assets/default-profile.png";
const previewImage = ref(null);

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
  }
}

async function handleSignup() {
  if (!agree.value) {
    alert("개인정보 처리방침에 동의해야 합니다.");
    return;
  }
  if (user.value.userPassword !== confirm.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    const response = await userApi.userJoin(user.value);
    const resultObject = response.data;

    if (resultObject.result === "success") {
      // 백엔드에서 userId 반환했다고 가정
      const newUserId = resultObject.data.userId;
      // 펫 등록 화면으로 userId 전달
      await router.push({ name: "PetRegister", query: { userId: newUserId } });
    } else {
      alert(resultObject.message);
    }
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>
.bg-brown { background-color: #6b4a2b; }
.text-brown { color: #6b4a2b; }
.btn-brown { background-color: #6b4a2b; color: white; }
.btn-brown:hover { background-color: #56351f; }
.btn-outline-brown { color: #6b4a2b; border: 1px solid #6b4a2b; }
.btn-outline-brown:hover { background-color: #f9f4ef; }
</style>
