<template>
  <div class="walk-apply-list">
    <h2 class="title">🐾 산책 신청 목록</h2>

    <div
      v-for="(apply, i) in applyList"
      :key="i"
      class="apply-card"
    >
      <!-- 프로필 이미지 -->
      <img :src="apply.img" alt="pet" class="pet-img" />

      <!-- 기본 정보 -->
      <div class="info">
        <div class="info-header">
          <span class="name">{{ apply.name }}</span>
          <span class="age">만 {{ apply.age }} 세</span>
          <span class="gender">{{ apply.gender }}</span>
          <span class="weight">{{ apply.weight }}kg</span>
          <span class="region">{{ apply.region }}</span>
        </div>
        <div class="content">
          {{ apply.message }}
        </div>
        <div class="user-id">ID: {{ apply.userId }}</div>
      </div>

      <!-- 버튼 그룹 -->
      <div class="actions">
        <button class="post-btn">게시글 가기</button>

        <button
          v-if="apply.status === '신청중'"
          class="status-btn pending"
        >
          신청중
        </button>
        <button
          v-else-if="apply.status === '수락됨'"
          class="status-btn accepted"
        >
          수락됨
        </button>

        <button class="cancel-btn">신청 취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const applyList = ref([
  {
    name: "Labrador",
    age: 2,
    gender: "남",
    weight: 4,
    region: "서울 마포구",
    message: "서울 강서구 식물원에서 산책하실 분 구해요",
    userId: "LABR_4E",
    img: "https://placedog.net/100/100?id=1",
    status: "신청중",
  },
  {
    name: "Maru",
    age: 4,
    gender: "남",
    weight: 5,
    region: "서울 강서구",
    message: "서울 강서구 식물원에서 산책하실 분 구해요",
    userId: "GIGANTIC_MARU",
    img: "https://placedog.net/100/100?id=2",
    status: "수락됨",
  },
  {
    name: "Loki",
    age: 2,
    gender: "남",
    weight: 4,
    region: "서울 마포구",
    message: "서울 강서구 식물원에서 산책하실 분 구해요",
    userId: "LOKI_YA",
    img: "https://placekitten.com/100/100",
    status: "신청중",
  },
]);
</script>

<style scoped>
.walk-apply-list {
  background: #fff;
  border: 2px solid #6b4a2b;
  border-radius: 12px;
  padding: 20px;
  max-width: 900px;
  margin: 20px auto;
  font-family: "Noto Sans KR", sans-serif;
}

.title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: #6b4a2b;
}

.apply-card {
  display: flex;
  align-items: center;
  background: #faf7f3;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  gap: 20px;
}

.pet-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f1c40f;
}

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

/* 버튼 그룹 */
.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

/* 공통 버튼 스타일 */
.post-btn,
.status-btn,
.cancel-btn {
  width: 100px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  text-align: center;
}

/* 게시글 버튼 */
.post-btn {
  background: #6b4a2b;
  color: #fff;
}

/* 상태 버튼 */
.status-btn.pending {
  background: #f1e3c1;
  color: #6b4a2b;
}
.status-btn.accepted {
  background: #27ae60;
  color: #fff;
}

/* 취소 버튼 */
.cancel-btn {
  background: #e74c3c;
  color: #fff;
}
</style>
