<template>
  <div class="message-list">
    <!-- 타이틀 -->
    <h2 class="title">
      <span class="icon">🐱</span>
      메시지 목록
      <span class="icon">🐶</span>
    </h2>

    <!-- 메시지 카드 -->
    <div v-for="(msg, i) in messages" :key="i" class="message-card">
      <!-- 프로필 -->
      <div class="profile">
        <img :src="msg.img" alt="pet" class="profile-img" />
      </div>

      <!-- 정보 -->
      <div class="info">
        <div class="info-header">
          <span class="name">{{ msg.name }}</span>
          <span class="age">만 {{ msg.age }} 세</span>
          <span class="gender">{{ msg.gender }}</span>
          <span class="weight">{{ msg.weight }}kg</span>
          <span class="region">{{ msg.region }}</span>
        </div>
        <div class="content">{{ msg.message }}</div>
        <div class="user-id">ID: {{ msg.userId }}</div>
      </div>

      <!-- 버튼 -->
      <div class="actions">
        <button class="accept-btn">수락</button>
        <button class="reject-btn">거절</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const messages = ref([
  {
    name: "Labrador",
    age: 2,
    gender: "남",
    weight: 4,
    region: "서울 마포구",
    message: "다른 강아지 냄새 맡으면서 산책하고 싶다멍!",
    userId: "LABR_4E",
    img: "https://placedog.net/100/100?id=1",
  },
  {
    name: "Maru",
    age: 4,
    gender: "남",
    weight: 5,
    region: "서울 강서구",
    message: "오빠랑 개껌 씹으러 갈까?",
    userId: "GIGANTIC_MARU",
    img: "https://placedog.net/100/100?id=2",
  },
  {
    name: "Loki",
    age: 2,
    gender: "남",
    weight: 4,
    region: "서울 마포구",
    message: "로키는 개냥이라 산책도 가능해요!",
    userId: "LOKI_YA",
    img: "https://placekitten.com/100/100",
  },
]);
</script>

<style scoped>
.message-list {
  background: #fff;
  border: 2px solid #6b4a2b;
  border-radius: 12px;
  padding: 20px;
  max-width: 950px;
  margin: 20px auto;
  font-family: "Noto Sans KR", sans-serif;
}

/* 타이틀 */
.title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: #6b4a2b;
}
.title .icon {
  font-size: 1.8rem;
  margin: 0 8px;
}

/* 메시지 카드 */
.message-card {
  display: flex;
  align-items: center;
  background: #faf7f3;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  gap: 20px;
}

/* 프로필 */
.profile {
  flex-shrink: 0;
}
.profile-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e170ff; /* 보라빛 테두리 */
}

/* 정보 */
.info {
  flex: 1;
}
.info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  margin-bottom: 8px;
}
.name {
  font-weight: bold;
  font-size: 1.1rem;
}
.content {
  font-size: 0.95rem;
  margin-bottom: 8px;
}
.user-id {
  font-size: 0.8rem;
  color: #777;
}

/* 버튼 */
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.accept-btn,
.reject-btn {
  width: 80px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  text-align: center;
}
.accept-btn {
  background: #f1e3c1;
  color: #6b4a2b;
}
.reject-btn {
  background: #e74c3c;
  color: #fff;
}
</style>
