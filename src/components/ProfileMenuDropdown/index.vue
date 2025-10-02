<!-- components/ProfileMenuDropdown.vue (라우터/keep-alive 대응 포함) -->
<template>
  <div ref="root" class="dropdown" :class="{ dropstart: align === 'start', dropend: align === 'end' }" @pointerdown.stop>
    <slot name="toggle">
      <button
        class="btn btn-outline-secondary rounded-pill px-3"
        type="button"
        @pointerdown.stop.prevent="onTogglePointer"
        :aria-expanded="isOpen ? 'true' : 'false'"
      >
        {{ label }}
      </button>
    </slot>

    <ul
      class="dropdown-menu dropdown-menu-end menu-card p-0 overflow-hidden"
      :class="{ show: isOpen }"
      v-show="isOpen"
      role="menu"
      tabindex="-1"
      @pointerdown.stop
    >
      <li v-for="(it, idx) in items" :key="idx">
        <hr v-if="it.divider" class="dropdown-divider m-0" />
        <button v-else class="dropdown-item d-flex align-items-center gap-2 py-3" type="button" @click.prevent="onSelect(it)">
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
import { ref, computed, onMounted, onBeforeUnmount, watch, onActivated, onDeactivated } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  label: { type: String, default: "메뉴" },
  align: { type: String, default: "end" },
  forceOpen: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
});
const emit = defineEmits(["select"]);

const open = ref(false);
const root = ref(null);

const route = useRoute();
const router = useRouter();

const isOpen = computed(() => props.forceOpen || open.value);

function isImg(icon) {
  return typeof icon === "string" && /^(https?:|data:|\.\/|\/)/.test(icon);
}

function onSelect(it) {
  emit("select", it.key ?? it.text, it);
  if (!props.forceOpen) close();
}

/* 토글/열기 닫기 */
function openMenu() {
  open.value = true;
}
function close() {
  open.value = false;
}
function toggle() {
  open.value = !open.value;
}
function onTogglePointer() {
  toggle();
}

/* 외부 클릭 처리 (pointerdown) */
function onDocumentPointerDown(e) {
  if (!root.value) return;
  if (!root.value.contains(e.target)) {
    close();
  }
}

/* Esc 키 */
function onDocumentKeyDown(e) {
  if (e.key === "Escape" || e.key === "Esc") close();
}

/* --- 라우트 변경 시 닫기 (SPA) --- */
watch(
  () => route.fullPath,
  (newVal, oldVal) => {
    // 라우트가 바뀌면 닫음
    if (newVal !== oldVal) {
      // console.log('route changed -> close dropdown', oldVal, '=>', newVal);
      close();
    }
  }
);

/* --- keep-alive 활성화/비활성화 대응 --- */
onActivated(() => {
  // 컴포넌트가 활성화될 때 필요하면 닫음(또는 열기)
  // console.log('ProfileMenuDropdown activated');
  close();
});
onDeactivated(() => {
  // 비활성화 될 때도 닫기
  // console.log('ProfileMenuDropdown deactivated');
  close();
});

onMounted(() => {
  // 문서 이벤트 등록
  document.addEventListener("pointerdown", onDocumentPointerDown);
  document.addEventListener("keydown", onDocumentKeyDown);
  // console.log('ProfileMenuDropdown mounted, listeners added');
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown);
  document.removeEventListener("keydown", onDocumentKeyDown);
  // console.log('ProfileMenuDropdown beforeUnmount, listeners removed');
});

/* 외부의 forceOpen prop이 false로 바뀌면 로컬 닫기 */
watch(
  () => props.forceOpen,
  (v) => {
    if (!v) open.value = false;
  }
);
</script>

<style scoped>
/* 기존 스타일 유지 (생략) */
:root {
  --brown: #6b3f2a;
  --shadow: #caa27a33;
}
.menu-card {
  position: absolute; /* 오버레이 */
  top: 100%; /* 버튼 바로 아래 */
  right: 0; /* 버튼 왼쪽에 맞춤 */
  margin-top: 4px; /* 버튼과 메뉴 사이 간격 */
  min-width: 100%; /* 버튼 너비와 동일 */
  z-index: 9999;
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
.dropdown-menu.show {
  display: block !important;
}
</style>
