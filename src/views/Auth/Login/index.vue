<template>
  <div
    class="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-cream"
  >
    <!-- ===== 로고 + 캐릭터 ===== -->
    <div class="logo-container position-relative mb-3">
      <img
        src="@/assets/logo_brown_bigsize.png"
        alt="나와산책가개 로고"
        class="logo-main"
      />
      <img src="@/assets/cat.png" alt="고양이" class="cat-img" />
      <img src="@/assets/dog.png" alt="강아지" class="dog-img" />
    </div>

    <!-- 로그인 래퍼 -->
    <div class="login-wrapper position-relative">
      <div
        class="card border-0 shadow-lg p-4 text-white text-center"
        style="background-color: #7b4a2d; width: 400px; border-radius: 18px"
      >
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-semibold mb-0">Login</h5>
          <router-link
            to="/Register/User"
            class="text-white small text-decoration-none"
            >Sign up</router-link
          >
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
              >계정 찾기</router-link
            >
          </div>

          <button
            type="submit"
            class="btn w-100 fw-bold rounded-pill"
            :disabled="loading"
            style="background-color: #ffe9b3; color: #000"
          >
            {{ loading ? "로그인 중..." : "Login" }}
          </button>
        </form>

        <div v-if="loginError" class="mt-3 text-start">
          <div class="alert alert-danger py-2 px-3 small mb-0">
            {{ loginError }}
          </div>
        </div>
        <div v-else-if="loading" class="mt-2 text-start small text-muted">
          로그인 중… 잠시만 기다려주세요.
        </div>

        <!-- 길 이미지: 카드 내부에 배치하여 카드 배경과 버튼 사이에 위치 -->
        <img
          src="@/assets/Bg1 1.png"
          alt="길 배경"
          class="ground-img position-absolute start-50 translate-middle-x"
        />
      </div>
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

const loginError = ref("");
const loading = ref(false);

async function handleLogin() {
  try {
    loading.value = true;
    loginError.value = "";
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
      loginError.value = result.message || "로그인 실패";
      setTimeout(() => (loginError.value = ""), 5000);
    }
  } catch (e) {
    console.error(e);
    // 서버가 보낸 메시지는 HTTP 400 (잘못된 아이디/비밀번호 등 사용자 입력 오류)일 때만 표시.
    // 그 외(500 등) 내부 서버 오류나 SQL 에러는 사용자에게 노출하지 않고 일반 안내문으로 대체합니다.
    let serverMsg = null;
    if (e?.response) {
      const status = e.response.status;
      if (status === 400) {
        serverMsg = e.response.data?.message || "로그인 실패";
      } else {
        serverMsg = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      }
    } else {
      serverMsg = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.";
    }

    loginError.value = serverMsg;
    setTimeout(() => (loginError.value = ""), 5000);
  } finally {
    loading.value = false;
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
  pointer-events: none; /* 클릭 막지 않게 */
}

/* 강아지 오른쪽 */
.dog-img {
  position: absolute;
  width: 120px;
  bottom: 0;
  right: 40px;
  z-index: 2;
  pointer-events: none; /* 클릭 막지 않게 */
}

/* ===== 로그인 + 길 ===== */
.login-wrapper {
  position: relative;
  display: inline-block;
}

/* 카드가 항상 위로 오게 */
.login-wrapper .card {
  position: relative;
  z-index: 5;
}

/* 길은 로그인 박스 하단에 붙음 */
.ground-img {
  width: 550px;
  bottom: -57px;
  z-index: 1; /* 카드보다 아래 */
  filter: drop-shadow(0px 4px 8px rgba(166, 124, 82, 0.4));
  transition: filter 0.3s ease;
  pointer-events: none; /* 클릭 이벤트 차단 */
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
