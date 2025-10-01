<!-- WalkListItem.vue -->
<template>
  <div class="d-flex align-items-center gap-3 flex-wrap">
    <!-- 말풍선 형태 (좌측 큰 캡슐) -->
    <div class="flex-grow-1">
      <div class="rounded-pill px-4 py-3 bg-body-tertiary border shadow-sm walk-bubble">
        <strong class="small">{{ title }}</strong>
      </div>
    </div>

    <!-- 게시글 가기 -->
    <button class="btn btn-brown px-3" @click="$emit('open', postId)">게시글<br />가기</button>

    <!-- 상태/취소 -->
    <div class="d-flex flex-column gap-2">
      <span class="badge text-bg-light border fw-semibold px-3 py-2" :class="statusClass">
        {{ statusLabel }}
      </span>
      <button class="btn btn-sm btn-outline-danger px-3" @click="$emit('cancel', postId)">신청 취소</button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  status: { type: String, default: "APPLY" }, // APPLY | ACCEPT | REJECT | DONE
  postId: { type: [Number, String], required: true },
});

const statusLabel = computed(
  () =>
    ({
      APPLY: "신청중",
      ACCEPT: "수락됨",
      REJECT: "거절됨",
      DONE: "완료",
    }[props.status] ?? "신청중")
);

// 부트스트랩 배지 색 매핑(디자인 감성 맞춤)
const statusClass = computed(
  () =>
    ({
      APPLY: "badge-apply", // 아이보리
      ACCEPT: "badge-accept", // 초록
      REJECT: "badge-reject", // 붉은기
      DONE: "badge-done", // 회갈색
    }[props.status] ?? "badge-apply")
);
</script>

<style scoped>
/* 테마 색 */
:root {
  --brown: #6b3f2a;
  --brown-200: #e7d4c8;
}

.btn-brown {
  background-color: var(--brown);
  color: #fff;
  border: none;
  border-radius: 12px;
}
.btn-brown:hover {
  filter: brightness(0.92);
}

.walk-bubble {
  border-color: #c7b6ac !important;
}

/* 배지 커스텀 (디자인 시안 느낌) */
.badge-apply {
  background: #f6eddc !important;
  color: #6b3f2a;
  border-color: #e9dfcf !important;
}
.badge-accept {
  background: #2e7d32 !important;
  color: #fff;
  border-color: #246428 !important;
}
.badge-reject {
  background: #ffc2c2 !important;
  color: #b21e1e;
  border-color: #ffb0b0 !important;
}
.badge-done {
  background: #e0e0e0 !important;
  color: #555;
  border-color: #d0d0d0 !important;
}
</style>
