<template>
  <div class="account-find-container">
    <!-- 상단 네비 -->
    <header class="top-bar">
      <div>
        <router-link to="/" class="home-link">
          <h1>나와 <span class="paw">🐾</span><br />산책가개</h1>
        </router-link>
      </div>
      <div class="nav-btns">
        <router-link to="/Auth/View1" class="btn">Login</router-link>
        <a href="/signup" class="btn">Sign up</a>
      </div>
    </header>

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
          <input v-model="userId" type="text" placeholder="ID" />
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
import userApi from "@/apis/userApi";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

// 전역 상태를 저장하기 위해
const store = useStore();

// Router 얻기
// 라우팅을 조작할때 사용
const router = useRouter();

const email = ref("endehhau@naver.com");
const userId = ref("userApi");

function findId() {
  console.log("아이디 찾기:", email.value);
}

function findPassword() {
  console.log("비밀번호 찾기:", userId.value);
}
</script>

<style scoped>
/* 전체 배경 */
.account-find-container {
  min-height: 100vh;
  background: #fcfbf8;
  font-family: "Noto Sans KR", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 상단 바 */
.top-bar {
  width: 100%;
  background: #6b4a2b;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.home-link {
  text-decoration: none;
  color: #fce9b6; /* 부모 색상 따라감 (#6b3f22) */
}

.top-bar .btn {
  margin-left: 10px;
  padding: 6px 14px;
  background: #fce9b6;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #333;
  text-decoration: none;
  font-weight: bold;
}

.top-bar .btn:hover {
  background: #fbdc89;
}

/* 메인 박스 */
.find-box {
  background: #7b4a2d;
  color: white;
  padding: 30px;
  border-radius: 16px;
  width: 360px;
  margin-top: 50px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  text-align: left;
}

/* 상단 아이콘 원 */
.icon-circle {
  width: 100px;
  height: 100px;
  background: #fce9b6;
  border-radius: 50%;
  margin: 0 auto 20px auto;
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
  margin-bottom: 30px;
}

.find-section h3 {
  font-size: 1rem;
  margin-bottom: 8px;
  font-weight: bold;
}

.input-group {
  display: flex;
  align-items: center;
  background: #f1f1f1;
  border-radius: 6px;
  padding: 8px 10px;
}

.input-group input {
  border: none;
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  outline: none;
  background: none;
}

.icon {
  margin-right: 8px;
}

.desc {
  font-size: 0.8rem;
  margin: 6px 0 10px;
  color: #ddd;
}

.find-btn {
  width: 100%;
  background: #fce9b6;
  border: none;
  border-radius: 6px;
  padding: 10px;
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
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.pet {
  width: 70px;
  height: auto;
}
</style>
