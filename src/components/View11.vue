<template>
  <div class="dropdown-container" v-if="isOpen">
    <ul class="menu-list">
      <li v-for="item in menuItems" :key="item.label" class="menu-item">
        <img :src="item.icon" alt="icon" class="icon" />
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isOpen = ref(true); // 드롭다운 표시 여부

const menuItems = [
  { label: "내 프로필", icon: "https://img.icons8.com/color/48/user-male-circle--v1.png" },
  { label: "마이페이지", icon: "https://img.icons8.com/color/48/open-book--v1.png" },
  { label: "내 산책 메이트", icon: "https://img.icons8.com/color/48/cat.png" },
  { label: "좋아요 목록", icon: "https://img.icons8.com/color/48/facebook-like.png" },
  { label: "조회한 게시물", icon: "https://img.icons8.com/color/48/time.png" },
  { label: "설정", icon: "https://img.icons8.com/color/48/settings.png" },
];
</script>

<style scoped>
.dropdown-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 4px 4px 0 #6b4a2b;
  padding: 12px 0;
  width: 200px;
  font-family: "Noto Sans KR", sans-serif;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #f9f3ef;
}

.icon {
  width: 24px;
  height: 24px;
}
</style>
