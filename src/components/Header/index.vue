<template>
  <nav class="navbar bg-brown px-3">
    <div class="container-fluid d-grid align-items-center"
         style="grid-template-columns: 1fr auto 1fr;">

      <!-- 왼쪽: 검색창 -->
      <form class="d-flex justify-content-start" role="search" style="max-width: 300px;">
        <div class="input-group">
          <span class="input-group-text bg-white">
            <i class="bi bi-search"></i>
          </span>
          <input
            v-model="searchText"
            class="form-control"
            type="search"
            placeholder="해시태그 또는 아이디 검색"
          />
        </div>
      </form>

      <!-- 가운데: 로고 (항상 정중앙) -->
      <div class="text-center">
        <img
          :src="logoImg"
          alt="로고"
          class="img-fluid"
          style="max-width: 120px;"
        />
      </div>

      <!-- 오른쪽: 알림 + 프로필 -->
      <div class="d-flex align-items-center gap-3 justify-content-end">
        <!-- 알림 -->
        <div class="position-relative">
          <i class="bi bi-bell fs-4 text-white"></i>
          <span
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style="font-size:0.6rem;"
          >
            1
          </span>
        </div>

        <!-- 닉네임 -->
        <span class="fw-bold text-white">{{ username }}</span>

        <!-- 프로필 이미지 -->
        <img
          :src="profileImage"
          alt="프로필"
          class="rounded-circle border border-light"
          style="width:35px; height:35px; object-fit:cover;"
        />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import logoImg from "@/assets/logo_white.png";

const searchText = ref("");
const username = ref("TWOTWO_MOM");
const profileImage = ref("https://via.placeholder.com/40");
</script>

<style scoped>
.bg-brown {
  background-color: #6b4a2b;
}
</style>
