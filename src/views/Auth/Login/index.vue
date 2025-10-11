<template>
  <div id="fixed-screen" class="bg-light">
    <!-- 로고 영역 -->
    <div class="logo-container position-absolute">
      <!-- 좌 강아지 -->
      <img src="@/assets/dog.png" alt="강아지" class="pet-left" />
      <!-- 로고 텍스트 -->
      <router-link to="/" class="text-decoration-none text-dark">
        <h1 class="fw-bold text-center">나와 <span class="paw">🐾</span><br />산책가개</h1>
      </router-link>
      <!-- 우 강아지 -->
      <img src="@/assets/dog.png" alt="강아지" class="pet-right" />
    </div>

    <!-- 로그인 박스 -->
    <div class="card bg-brown text-white p-4 position-absolute login-box">
      <div class="d-grid mb-3 grid-login-header">
        <span class="fs-5">Login</span>
        <router-link to="/Register/User" class="text-white text-decoration-none small align-self-start">Sign up</router-link>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3 position-relative">
          <span class="icon-user">👤</span>
          <input v-model="loginForm.loginId" type="text" class="form-control ps-5" placeholder="NickName" required />
        </div>

        <div class="mb-3 position-relative">
          <span class="icon-pass">🔒</span>
          <input v-model="loginForm.password" type="password" class="form-control ps-5" placeholder="Password" required />
        </div>

        <div class="text-end mb-3">
          <router-link to="/Auth/FindAccount" class="text-white small text-decoration-none">계정 찾기</router-link>
        </div>

        <button type="submit" class="btn btn-warning w-100 fw-bold">Login</button>
        <!-- <router-link to="/Post/MainFeed" class="btn btn-warning w-100 fw-bold">Login</router-link> -->
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import userLoginApi from "@/apis/userLoginApi";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const loginForm = ref({
  loginId: "",
  password: "",
});

async function handleLogin() {
  try {
    const response = await userLoginApi.userLogin(loginForm.value);
    const resultObject = response.data;

    if (resultObject.result === "success") {
      const user = {
        userId: resultObject.userId,
        userLoginId: resultObject.loginId,
        userName: resultObject.userName,
        userEmail: resultObject.userEmail,
        userAddress: resultObject.userAddress,
        userBirthDate: resultObject.userBirthDate,
        // 서버에서 내려주는 첫 번째 펫 이미지 URL
        profileImage: resultObject.profileImage || "https://via.placeholder.com/40",
      };

      store.dispatch("saveAuth", { user, jwt: resultObject.jwt });
      router.push("/Post/MainFeed");
    } else {
      alert(resultObject.message || "로그인 실패");
    }
  } catch (error) {
    console.error("로그인 중 오류:", error);
    alert("로그인 중 오류 발생");
  }
}
</script>

<style scoped>
/* ----------------- 부트스트랩 아닌 커스텀 스타일 ----------------- */

/* 전체 화면 고정 대신 반응형 */
#fixed-screen {
  width: 100vw; /* 브라우저 가로 꽉 채우기 */
  height: 100vh; /* 브라우저 세로 꽉 채우기 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fdfcf9;
  position: relative;
  overflow: hidden;
}

/* 로고 영역 */
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem; /* 좌우 간격 */
  margin-bottom: 2rem;
}

/* 강아지 이미지 크기 조절 */
.pet-left,
.pet-right {
  width: 60px;
  height: auto;
}

/* 로고 paw 아이콘 크기 */
.paw {
  font-size: 1.6rem;
}

/* 로그인 박스 */
.login-box {
  width: 100%;
  max-width: 350px;
  border-radius: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* 로그인 헤더 그리드 */
.grid-login-header {
  grid-template-columns: 1fr auto;
}

/* 입력 아이콘 */
.icon-user,
.icon-pass {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
}

/* bg-brown 정의 */
.bg-brown {
  background-color: #7b4a2d !important;
}
</style>
