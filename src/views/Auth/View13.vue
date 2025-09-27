<template>
  <div class="walk-list">
    <h2 class="title">🐾 산책 리스트</h2>

    <div v-for="(walk, i) in walkList" :key="i" class="walk-card">
      <!-- 메시지 -->
      <div class="message">
        {{ walk.message }}
      </div>

      <!-- 버튼 그룹 -->
      <div class="actions">
        <button class="post-btn">게시글 가기</button>
        <button
          v-if="walk.status === '신청중'"
          class="status-btn pending"
        >
          신청중
        </button>
        <button
          v-else-if="walk.status === '수락됨'"
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

const walkList = ref([
  {
    message: "서울 강서구 식물원에서 산책하실 분 구해요",
    status: "신청중",
  },
  {
    message: "서울 강서구 식물원에서 산책하실 분 구해요",
    status: "수락됨",
  },
  {
    message: "서울 강서구 식물원에서 산책하실 분 구해요",
    status: "신청중",
  },
]);
</script>

<style scoped>
.walk-list {
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

.walk-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #faf7f3;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.message {
  flex: 1;
  font-size: 0.95rem;
  color: #333;
  padding: 10px 16px;
  border-radius: 8px;
  border: 2px solid #c8a47e;
  background: #fff;
  margin-right: 20px;
}

/* 버튼 그룹 */
.actions {
  display: flex;
  gap: 8px;
}

/* 공통 버튼 스타일 */
.post-btn,
.status-btn,
.cancel-btn {
  width: 90px;
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
