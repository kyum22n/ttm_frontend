<!-- components/ProfileMenuDropdown.vue -->
<template>
  <div class="dropdown" :class="{ dropstart: align === 'start', dropend: align === 'end' }">
    <!-- 트리거 버튼 (기본 제공, 혹은 slot으로 교체 가능) -->
    <slot name="toggle">
      <button class="btn btn-outline-secondary rounded-pill px-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {{ label }}
      </button>
    </slot>

    <ul class="dropdown-menu dropdown-menu-end menu-card p-0 overflow-hidden" :class="{ show: forceOpen }">
      <li v-for="(it, idx) in items" :key="idx">
        <!-- 구분선 -->
        <hr v-if="it.divider" class="dropdown-divider m-0" />
        <!-- 메뉴 항목 -->
        <button v-else class="dropdown-item d-flex align-items-center gap-2 py-3" @click="onSelect(it)">
          <span v-if="it.icon && isImg(it.icon)" class="icon-wrap">
            <img :src="it.icon" alt="" />
          </span>
          <span v-else-if="it.icon" class="fs-5">{{ it.icon }}</span>
          <span class="flex-grow-1">{{ it.text }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  label: { type: String, default: "메뉴" },
  align: { type: String, default: "end" }, // start|end
  forceOpen: { type: Boolean, default: false }, // 필요시 강제 열기
  /** [{ key, text, icon?: 'emoji'|imageUrl, divider?:true }] */
  items: { type: Array, default: () => [] },
});
const emit = defineEmits(["select"]);

function isImg(icon) {
  return typeof icon === "string" && /^(https?:|data:|\.\/|\/)/.test(icon);
}
function onSelect(it) {
  emit("select", it.key ?? it.text, it);
}
</script>

<style scoped>
/* 카드 느낌 + 시안 컬러 */
:root {
  --brown: #6b3f2a;
  --shadow: #caa27a33;
}
.menu-card {
  min-width: 240px;
  border: 2px solid var(--brown);
  border-radius: 16px;
  box-shadow: 10px 10px 0 var(--shadow);
  background: #fffdfa;
}

.dropdown-item {
  font-weight: 500;
}
.dropdown-item:hover {
  background: #fff2e3;
}
.dropdown-divider {
  border-color: #e8d9c8;
}
.icon-wrap {
  width: 24px;
  height: 24px;
  display: inline-grid;
  place-items: center;
}
.icon-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
