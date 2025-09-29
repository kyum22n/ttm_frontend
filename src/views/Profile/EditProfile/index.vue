<template>
  <div class="profile-container">
    <!-- 상단 네비 -->
    <header class="top-bar">
      <input
        type="text"
        class="search-input"
        placeholder="해시태그 또는 아이디 검색"
      />
      <div class="logo">나와 <span class="paw">🐾</span> 산책가개</div>
      <div class="user-info">
        <div class="notify">🔔<span class="badge">1</span></div>
        <span class="username">TWOTWO_MOM</span>
        <img src="@/assets/default-profile.png" alt="프로필" class="user-img" />
      </div>
    </header>

    <!-- 프로필 박스 -->
    <div class="profile-box">
      <h2>My Profile</h2>
      <div class="profile-content">
        <div class="profile-left">
          <img src="@/assets/default-profile.png" alt="프로필" class="profile-photo" />
        </div>
        <div class="profile-right">
          <div class="input-group">
            <span class="icon">👤</span>
            <input v-model="name" type="text" placeholder="이름" />
          </div>

          <div class="input-group">
            <span class="icon">📅</span>
            <input v-model="birth" type="date" />
          </div>

          <div class="input-group">
            <span class="icon">🆔</span>
            <input v-model="userId" type="text" disabled />
          </div>

          <div class="input-group">
            <span class="icon">✉️</span>
            <input v-model="email" type="email" />
          </div>

          <div class="input-group double">
            <span class="icon">🔒</span>
            <input v-model="password" type="password" placeholder="비밀번호" />
            <input v-model="confirm" type="password" placeholder="확인" />
          </div>

          <div class="input-group">
            <span class="icon">📍</span>
            <input v-model="region" type="text" placeholder="지역" />
            <button class="search-btn">Search</button>
          </div>

          <div class="agree">
            <input type="checkbox" v-model="allowMate" /> 산책 메이트 신청을 받고 싶지 않아요
          </div>
        </div>
      </div>

      <button class="save-btn">변경사항 저장</button>
      <div class="bottom-pets">
        <img src="@/assets/cat.png" alt="고양이" class="pet" />
        <img src="@/assets/dog.png" alt="강아지" class="pet" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const name = ref("김병현");
const birth = ref("2001-07-24");
const userId = ref("TWOTWO_MOM");
const email = ref("twotwomom@naver.com");
const password = ref("");
const confirm = ref("");
const region = ref("서울시 송파구");
const allowMate = ref(false);

function saveChanges() {
  console.log("변경사항 저장:", {
    name: name.value,
    birth: birth.value,
    userId: userId.value,
    email: email.value,
    region: region.value,
    allowMate: allowMate.value,
  });
}
</script>

<style scoped>
.profile-container {
  background: #fcfbf8;
  min-height: 100vh;
  font-family: "Noto Sans KR", sans-serif;
}

/* 상단 네비 */
.top-bar {
  background: #6b4a2b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
}

.search-input {
  width: 300px;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  outline: none;
}

.logo {
  font-weight: bold;
  font-size: 1.2rem;
}

.paw {
  font-size: 1.3rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notify {
  position: relative;
  font-size: 1.2rem;
}

.badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: red;
  color: #fff;
  font-size: 0.7rem;
  border-radius: 50%;
  padding: 2px 5px;
}

.user-img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

/* 프로필 박스 */
.profile-box {
  background: #fff;
  border: 2px solid #6b4a2b;
  border-radius: 12px;
  padding: 30px;
  margin: 40px auto;
  width: 80%;
  max-width: 800px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-box h2 {
  margin-bottom: 20px;
  color: #6b4a2b;
}

.profile-content {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
}

.profile-left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: start;
}

.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid #6b4a2b;
  object-fit: cover;
}

.profile-right {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-group {
  display: flex;
  align-items: center;
  background: #f1f1f1;
  border-radius: 6px;
  padding: 6px 10px;
}

.input-group input {
  border: none;
  flex: 1;
  padding: 6px;
  background: none;
  outline: none;
}

.icon {
  margin-right: 8px;
}

.double {
  display: flex;
  gap: 8px;
}

.search-btn {
  margin-left: 6px;
  padding: 6px 12px;
  background: #fce9b6;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
}

.search-btn:hover {
  background: #fbdc89;
}

/* 동의 체크 */
.agree {
  font-size: 0.9rem;
  margin-top: 10px;
}

/* 저장 버튼 */
.save-btn {
  margin: 20px auto 0;
  display: block;
  background: #6b4a2b;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  width: 60%;
  max-width: 300px;
}

.save-btn:hover {
  background: #56351f;
}

.bottom-pets {
  margin-top: 20px;
  text-align: center;
}

.pet {
  width: 70px;
  margin: 0 10px;
}
</style>
