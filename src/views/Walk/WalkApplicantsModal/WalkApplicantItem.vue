<!-- components/WalkApplicantItem.vue -->
<template>
  <div class="d-flex align-items-center gap-3 flex-wrap">
    <!-- 아바타 -->
    <div class="avatar-ring">
      <img :src="avatar || require('@/assets/dog.png')" alt="" class="rounded-circle object-cover" />
    </div>

    <!-- 프로필 라인 -->
    <div class="small text-muted d-flex flex-column gap-1 flex-grow-1">
      <div class="d-flex align-items-center flex-wrap gap-3">
        <strong class="me-1 text-dark"> <i class="bi bi-shield-shaded me-1"></i>{{ name }} </strong>
        <span><i class="bi bi-calendar3 me-1"></i>만 {{ ageYears }} 세</span>
        <span><i class="bi bi-people me-1"></i>{{ gender }}</span>
        <span><i class="bi bi-clipboard2-pulse me-1"></i>{{ weightKg }}kg</span>
        <span><i class="bi bi-geo-alt me-1"></i>{{ location }}</span>
      </div>

      <!-- 메시지 버블 -->
      <div class="rounded-pill px-4 py-3 bg-body-tertiary border shadow-sm bubble">
        <span class="text-dark">{{ message }}</span>
      </div>

      <div class="small text-muted">ID: {{ userIdStr }}</div>
    </div>

    <!-- 게시글 가기 -->
    <div class="d-flex flex-column align-items-stretch">
      <button class="btn btn-brown px-3" @click="$emit('open', postId)">게시글<br />가기</button>
    </div>

    <!-- 상태/취소 -->
    <div class="d-flex flex-column gap-2">
      <span class="badge px-3 py-2 fw-semibold" :class="statusClass">{{ statusLabel }}</span>
      <button class="btn btn-sm btn-outline-danger px-3" @click="$emit('cancel', postId)">신청 취소</button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  avatar: String,
  name: String,
  ageYears: [Number, String],
  gender: String,
  weightKg: [Number, String],
  location: String,
  userIdStr: String,
  postId: [Number, String],
  message: String,
  status: { type: String, default: "APPLY" }, // APPLY|ACCEPT|REJECT|DONE
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

const statusClass = computed(
  () =>
    ({
      APPLY: "badge-apply",
      ACCEPT: "badge-accept",
      REJECT: "badge-reject",
      DONE: "badge-done",
    }[props.status] ?? "badge-apply")
);
</script>

<style scoped>
:root {
  --brown: #6b3f2a;
}
.object-cover {
  object-fit: cover;
}

.avatar-ring {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  padding: 4px;
  background: #ffc83b;
  display: grid;
  place-items: center;
}
.avatar-ring img {
  width: 100%;
  height: 100%;
}

.bubble {
  border-color: #c7b6ac !important;
}

/* 버튼/배지 테마 */
.btn-brown {
  background: var(--brown);
  color: #fff;
  border: none;
  border-radius: 12px;
}
.btn-brown:hover {
  filter: brightness(0.95);
}

.badge-apply {
  background: #f6eddc;
  color: #6b3f2a;
  border: 1px solid #e9dfcf;
}
.badge-accept {
  background: #2e7d32;
  color: #fff;
  border: 1px solid #246428;
}
.badge-reject {
  background: #ffc2c2;
  color: #b21e1e;
  border: 1px solid #ffb0b0;
}
.badge-done {
  background: #e0e0e0;
  color: #555;
  border: 1px solid #d0d0d0;
}
</style>
