<template>
  <nav class="navbar bg-brown px-3">
    <div class="container-fluid d-grid align-items-center" style="grid-template-columns: 1fr auto 1fr">
      <!-- 왼쪽: 검색창 -->
      <form class="d-flex justify-content-start" role="search" style="max-width: 300px">
        <div class="input-group">
          <span class="input-group-text bg-white">
            <i class="bi bi-search"></i>
          </span>
          <input v-model="searchText" class="form-control" type="search" placeholder="해시태그 또는 아이디 검색" />
        </div>
      </form>

      <!-- 가운데: 로고 -->
      <div class="text-center">
        <router-link to="/Post/MainFeed">
          <img :src="logoImg" alt="로고" class="img-fluid" style="max-width: 120px" />
        </router-link>
      </div>

      <!-- 오른쪽: 알림 + 프로필 -->
      <div v-if="$store.state.user.userId" class="d-flex align-items-center gap-3 justify-content-end">
        <div class="position-relative">
          <!-- 로그아웃 버튼 (닉네임 있을 때만 보이게) -->
          <button v-if="store.state.user.userLoginId" class="btn btn-outline-light btn-sm me-3" @click="logout">로그아웃</button>
          <i class="bi bi-bell fs-4 text-white"></i>
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6rem">1</span>
        </div>

        <!-- 닉네임 -->
        <span class="fw-bold text-white">{{ store.state.user.userLoginId }}</span>

        <!-- 프로필 이미지 (첫 번째 펫) -->
        <img
          v-if="profileImgUrl"
          :src="profileImgUrl"
          alt="프로필"
          style="width: 35px; height: 35px; object-fit: cover"
          class="rounded-circle border border-light"
        />

        <ProfileMenuDropdown label="내 메뉴" :items="items" align="bottom" @select="handleSelect" />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import logoImg from "@/assets/logo_white.png";
import ProfileMenuDropdown from "@/components/ProfileMenuDropdown";
import axios from "axios";

const store = useStore();
const router = useRouter();
const searchText = ref("");

// 프로필 이미지 Blob URL
const profileImgUrl = ref(null);

const items = [
  { key: "profile", text: "내 프로필", icon: "🧑‍💻" },
  { key: "mypage", text: "마이페이지", icon: "📒" },
  { key: "mate", text: "내 산책 메이트", icon: "🐕" },
  { key: "likes", text: "좋아요 목록", icon: "🤍" },
  { key: "viewed", text: "조회한 게시물", icon: "🕒" },
  { divider: true },
  { key: "settings", text: "설정", icon: "⚙️" },
];

function handleSelect(key) {
  const map = {
    profile: "/Profile/MyProfile",
    mypage: "/Profile/EditProfile",
    mate: "/Profile/MyProfile",
    likes: "/likes",
    viewed: "/history",
    settings: "/settings",
  };
  if (map[key]) router.push(map[key]);
}

// 프로필 이미지 불러오기 (blob 방식)
async function loadProfileImage() {
  try {
    if (store.state.user && store.state.user.profileImage) {
      const res = await axios.get(`http://localhost:8080${store.state.user.profileImage}`, {
        responseType: "blob",
      });
      profileImgUrl.value = URL.createObjectURL(res.data);
    }
  } catch (error) {
    console.error("프로필 이미지 불러오기 실패:", error);
  }
}

onMounted(() => {
  loadProfileImage();
});

function logout() {
  // Vuex에 LOGOUT mutation/액션 만들어두셔야 합니다.
  store.dispatch("removeAuth");
  router.push("/"); // 로그인 페이지로 이동
}

import { watch } from "vue";

watch(
  () => store.state.user.userId,
  (newVal) => {
    if (newVal) loadProfileImage();
  }
);
</script>

<style scoped>
.bg-brown {
  background-color: #6b4a2b;
}
</style>
