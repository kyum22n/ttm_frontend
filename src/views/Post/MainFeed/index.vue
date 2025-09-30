<template>
  <nav class="navbar navbar-expand bg-brown px-3">
    <div class="container-fluid d-flex align-items-center justify-content-between">
      
      <!-- 좌측 검색창 -->
      <form class="d-flex" role="search" style="max-width: 300px; flex:1;">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0">
            <i class="bi bi-search"></i>
          </span>
          <input
            v-model="searchText"
            type="search"
            class="form-control border-start-0"
            placeholder="해시태그 또는 아이디 검색"
          />
        </div>
      </form>

      <!-- 중앙 로고 -->
      <div class="text-center flex-grow-1">
        <span class="fw-bold logo-text">
          나와 <span class="fs-5">🐾</span> 산책가개
        </span>
      </div>

      <!-- 우측 사용자 영역 -->
      <div class="d-flex align-items-center gap-3">
        <!-- 알림 아이콘 + 뱃지 -->
        <div class="position-relative">
          <i class="bi bi-bell fs-4 text-white"></i>
          <span
            class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
          ></span>
        </div>

        <!-- 닉네임 -->
        <span class="fw-bold text-white small">{{ username }}</span>

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

const searchText = ref("");
const username = ref("TWOTWO_MOM"); // 로그인 사용자 이름
const profileImage = ref("https://via.placeholder.com/40"); // 프로필 이미지
</script>

<style scoped>
.bg-brown {
  background-color: #6b4a2b;
}
.logo-text {
  color: #fff6d9; /* 크림색 */
  font-size: 1.2rem;
}
</style>
