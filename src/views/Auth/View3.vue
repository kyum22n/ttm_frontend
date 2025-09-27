<template>
  <div class="pet-register-container">
    <!-- 왼쪽 로고/타이틀 -->
    <div class="left-area">
      <h1 class="title">나와 <span class="paw">🐾</span><br />산책가개</h1>
      <div class="pets">
        <img src="@/assets/cat.png" alt="고양이" class="pet" />
        <img src="@/assets/dog.png" alt="강아지" class="pet" />
      </div>
    </div>

    <!-- 오른쪽 등록 박스 -->
    <div class="register-box">
      <div class="top-bar">
        <h2>Register Pet</h2>
        <a href="/login" class="login-btn">Login</a>
      </div>

      <!-- 프로필 사진 업로드 -->
      <div class="profile-upload">
        <!-- <img src="@/assets/default-profile.png" alt="프로필" class="profile-img" /> -->
        <img src="@/assets/dog.png" alt="프로필" class="profile-img" />
        <label class="edit-btn">✏️</label>
      </div>

      <!-- 반려동물 소개 -->
      <textarea v-model="introduction" placeholder="반려동물을 소개해주세요" class="intro-box"></textarea>

      <!-- 입력 폼 -->
      <form @submit.prevent="handleRegister" class="form-area">
        <div class="input-group">
          <span class="icon">🐾</span>
          <input v-model="petName" type="text" placeholder="Pet Name" />
        </div>

        <div class="input-group birth">
          <span class="icon">📅</span>
          <input v-model="birth" type="date" />
          <span class="age-label">만</span>
          <input v-model="age" type="number" min="0" class="age-input" />
          <span class="age-label">세</span>
        </div>

        <div class="gender-group">
          <span class="icon">👥</span>
          <label><input type="radio" value="male" v-model="gender" /> male</label>
          <label><input type="radio" value="female" v-model="gender" /> female</label>
        </div>

        <div class="input-group">
          <span class="icon">⚖️</span>
          <input v-model="weight" type="number" placeholder="Weight" />
          <span class="unit">kg</span>
        </div>

        <div class="input-group">
          <span class="icon">🦴</span>
          <input v-model="breed" type="text" placeholder="Breed" />
        </div>

        <button type="submit" class="register-btn">반려동물 등록하기</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const petName = ref("");
const birth = ref("");
const age = ref("");
const gender = ref("");
const weight = ref("");
const breed = ref("");
const introduction = ref("");

function handleRegister() {
  console.log("등록 정보:", {
    petName: petName.value,
    birth: birth.value,
    age: age.value,
    gender: gender.value,
    weight: weight.value,
    breed: breed.value,
    introduction: introduction.value,
  });
  // axios 요청 연결
}
</script>

<style scoped>
.pet-register-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  padding: 40px;
  background: #fcfbf8;
  font-family: "Noto Sans KR", sans-serif;
}

/* 왼쪽 영역 */
.left-area {
  flex: 1;
  text-align: center;
}

.title {
  font-size: 2.2rem;
  font-weight: bold;
  color: #6b4a2b;
  line-height: 1.4;
}

.paw {
  font-size: 1.8rem;
}

.pets {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.pet {
  width: 80px;
  height: auto;
}

/* 오른쪽 박스 */
.register-box {
  flex: 1;
  max-width: 500px;
  background: #fff;
  border: 2px solid #6b4a2b;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 상단바 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.top-bar h2 {
  font-size: 1.2rem;
  color: #6b4a2b;
}

.login-btn {
  padding: 6px 14px;
  border: 1px solid #6b4a2b;
  border-radius: 6px;
  background: #fff;
  color: #6b4a2b;
  font-size: 0.9rem;
  text-decoration: none;
}

.login-btn:hover {
  background: #f9f4ef;
}

/* 프로필 업로드 */
.profile-upload {
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 16px;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #eee;
}

.edit-btn {
  position: absolute;
  bottom: 8px;
  right: calc(50% - 50px);
  background: #f9b6b6;
  border-radius: 50%;
  padding: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

/* 소개 */
.intro-box {
  width: 100%;
  height: 80px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  resize: none;
}

/* 입력 폼 */
.form-area {
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

.unit {
  margin-left: 6px;
}

/* 생년월일 + 나이 */
.birth {
  display: flex;
  gap: 6px;
}

.age-label {
  font-size: 0.8rem;
  margin: 0 4px;
}

.age-input {
  width: 50px;
  border: none;
  outline: none;
  background: #fff;
  text-align: center;
}

/* 성별 */
.gender-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gender-group .icon {
  margin-right: 8px;
}

/* 등록 버튼 */
.register-btn {
  margin-top: 10px;
  width: 100%;
  background: #6b4a2b;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.register-btn:hover {
  background: #56351f;
}
</style>
