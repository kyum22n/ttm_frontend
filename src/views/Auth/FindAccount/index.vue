<template>
  <div class="account-find-container">
    <!-- 메인 박스 -->
    <div class="find-box">
      <div class="icon-circle">
        <span class="lock-icon">🔒</span>
      </div>

      <!-- 아이디 찾기 -->
      <section class="find-section">
        <h3>아이디 찾기</h3>
        <div class="input-group">
          <span class="icon">👤</span>
          <input v-model="email" type="email" placeholder="Email" />
        </div>
        <p class="desc">이메일을 입력해주세요</p>
        <button class="find-btn" @click="findId">아이디 찾기</button>
      </section>

      <!-- 비밀번호 찾기 -->
      <section class="find-section">
        <h3>비밀번호 찾기</h3>
        <div class="input-group">
          <span class="icon">🔑</span>
          <input v-model="loginId" type="text" placeholder="ID" />
        </div>
        <p class="desc">아이디를 입력해주세요</p>
        <button class="find-btn" @click="findPassword">임시 비밀번호 발급하기</button>
      </section>
    </div>

    <!-- 하단 캐릭터 -->
    <div class="pets">
      <img src="@/assets/dog.png" alt="고양이" class="pet" />
      <img src="@/assets/dog.png" alt="강아지" class="pet" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const loginId = ref("");
const message = ref("");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const findId = async () => {
  loginId.value = "";
  message.value = "";

  if (!email.value) {
    message.value = "이메일을 입력해주세요.";
    return;
  }
  if (!isValidEmail(email.value)) {
    message.value = "올바른 이메일 형식이 아닙니다.";
    return;
  }

  try {
    const response = await axios.post("/user-login/find-id", { email: email.value });
    loginId.value = response.data.loginId;
    alert("loginId는 " + loginId.value + " 입니다");
    message.value = response.data.message;
  } catch (err) {
    message.value = err.response?.data?.message || "서버 요청 중 오류가 발생했습니다.";
  }
};

const findPassword = async () => {
  message.value = "";

  if (!loginId.value) {
    message.value = "로그인 ID를 입력해주세요.";
    return;
  }

  try {
    const response = await axios.post("/user-login/find-password", {
      loginId: loginId.value,
    });
    message.value = response.data.message;
    alert("비밀번호가 리셋되었습니다. 메일을 확인하세요.");
  } catch (err) {
    message.value = err.response?.data?.message || "서버 요청 중 오류가 발생했습니다.";
  }
};
</script>

<style scoped>
/* 전체 배경 */
.account-find-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fcfbf8;
  font-family: "Noto Sans KR", sans-serif;
  padding: 1rem;
  box-sizing: border-box;
}

/* 메인 박스 */
.find-box {
  background: #7b4a2d;
  color: white;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
}

/* 상단 아이콘 원 */
.icon-circle {
  width: 80px;
  height: 80px;
  background: #fce9b6;
  border-radius: 50%;
  margin: 0 auto 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-icon {
  font-size: 2rem;
  color: #7b4a2d;
}

/* 섹션 */
.find-section {
  margin-bottom: 2rem;
}

.find-section h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.input-group {
  display: flex;
  align-items: center;
  background: #f1f1f1;
  border-radius: 6px;
  padding: 0.5rem;
  margin-bottom: 0.3rem;
}

.input-group input {
  border: none;
  flex: 1;
  padding: 0.5rem;
  border-radius: 6px;
  outline: none;
  background: none;
}

.icon {
  margin-right: 0.5rem;
}

.desc {
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  color: #ddd;
}

.find-btn {
  width: 100%;
  background: #fce9b6;
  border: none;
  border-radius: 6px;
  padding: 0.7rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: 0.2s;
}

.find-btn:hover {
  background: #fbdc89;
}

/* 하단 캐릭터 */
.pets {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.pet {
  width: 50px;
  height: auto;
}

/* 반응형: 모바일 */
@media (max-width: 480px) {
  .find-box {
    padding: 1.5rem;
  }
  .icon-circle {
    width: 60px;
    height: 60px;
  }
  .lock-icon {
    font-size: 1.5rem;
  }
  .pet {
    width: 40px;
  }
}
</style>
