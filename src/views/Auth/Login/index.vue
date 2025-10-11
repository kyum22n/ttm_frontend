<template>
  <div
    class="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-cream"
  >
    <!-- ===== 로고 + 캐릭터 ===== -->
    <div class="logo-container position-relative mb-3">
      <!-- 중앙 로고 -->
      <img
        src="@/assets/logo_brown_bigsize.png"
        alt="나와산책가개 로고"
        class="logo-main"
      />

      <!-- 고양이 -->
      <img src="@/assets/cat.png" alt="고양이" class="cat-img" />

      <!-- 강아지 -->
      <img src="@/assets/dog.png" alt="강아지" class="dog-img" />
    </div>

    <!-- ===== 로그인 카드 + 길 ===== -->
    <div class="login-wrapper position-relative">
      <div
        class="card border-0 shadow-lg p-4 text-white text-center"
        style="background-color: #7b4a2d; width: 400px; border-radius: 18px;"
      >
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-semibold mb-0">Login</h5>
          <router-link
            to="/Register/User"
            class="text-white small text-decoration-none"
          >
            Sign up
          </router-link>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3 position-relative">
            <i
              class="bi bi-person-fill position-absolute top-50 start-0 translate-middle-y ms-3 text-light"
            ></i>
            <input
              v-model="loginForm.loginId"
              type="text"
              class="form-control ps-5 rounded-pill"
              placeholder="NickName"
              required
            />
          </div>

          <div class="mb-3 position-relative">
            <i
              class="bi bi-lock-fill position-absolute top-50 start-0 translate-middle-y ms-3 text-light"
            ></i>
            <input
              v-model="loginForm.password"
              type="password"
              class="form-control ps-5 rounded-pill"
              placeholder="Password"
              required
            />
          </div>

          <div class="text-end mb-3">
            <router-link
              to="/Auth/FindAccount"
              class="text-white small text-decoration-none"
            >
              계정 찾기
            </router-link>
          </div>

          <button
            type="submit"
            class="btn w-100 fw-bold rounded-pill"
            style="background-color: #ffe9b3; color: #000;"
          >
            Login
          </button>
        </form>
      </div>

      <!-- 길 이미지 (로그인 박스 아래 붙이기) -->
      <img
        src="@/assets/Bg1 1.png"
        alt="길 배경"
        class="ground-img position-absolute start-50 translate-middle-x"
      />
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
    const result = response.data;

    if (result.result === "success") {
      const user = {
        userId: result.userId,
        userLoginId: result.loginId,
        userName: result.userName,
        userEmail: result.userEmail,
        userAddress: result.userAddress,
        userBirthDate: result.userBirthDate,
        profileImage: result.profileImage || "https://via.placeholder.com/40",
      };
      store.dispatch("saveAuth", { user, jwt: result.jwt });
      router.push("/Post/MainFeed");
    } else {
      alert(result.message || "로그인 실패");
    }
  } catch (e) {
    console.error(e);
    alert("로그인 중 오류 발생");
  }
}
</script>

<style scoped>
.bg-cream {
  background-color: #fdfcf9;
}

/* ===== 로고 영역 ===== */
.logo-container {
  position: relative;
  width: 580px;
  height: 260px;
}

/* 로고 크기 */
.logo-main {
  position: relative;
  width: 330px;
  z-index: 5;
  display: block;
  margin: 0 auto;
}

/* 고양이 왼쪽 */
.cat-img {
  position: absolute;
  width: 120px;
  bottom: 0;
  left: 40px;
  z-index: 2;
}

/* 강아지 오른쪽 */
.dog-img {
  position: absolute;
  width: 120px;
  bottom: 0;
  right: 40px;
  z-index: 2;
}

/* ===== 로그인 + 길 ===== */
.login-wrapper {
  position: relative;
  display: inline-block;
}

/* 길은 로그인 박스 하단에 붙음 */
.ground-img {
  width: 500px;
  bottom: -55px; /* 로그인 박스와 자연스럽게 맞춤 */
  z-index: 1;
  filter: drop-shadow(0px 4px 8px rgba(166, 124, 82, 0.4)); /* 갈색 그림자 */
  transition: filter 0.3s ease;
}

/* hover 시 살짝 진한 그림자 */
.ground-img:hover {
  filter: drop-shadow(0px 6px 10px rgba(166, 124, 82, 0.55));
}

/* 입력창 */
input.form-control {
  height: 46px;
  border: none;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
  font-size: 15px;
}

/* 카드 */
.card {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}
</style>
