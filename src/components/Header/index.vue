<!-- 컴포넌트의 UI -->
<template>
  <div class="container">
    <div class="left ms-5">
      <router-link to="MainFeed">
        <img alt="Vue logo" src="@/assets/나와 산책가개 logo_white.png" height="50" />
      </router-link>
    </div>
    <div class="right">
      <nav>
        <div v-if="store.state.loginId !== ''">
          <span class="me-3">User: {{ $store.state.loginId }}</span>
          <button class="btn btn-info btn-sm" @click="handleLogout">로그아웃</button>
        </div>
        <div v-if="store.state.loginId === ''">
          <router-link to="/Register/Pet">회원가입</router-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<!-- 컴포넌트의 초기화 또는 이벤트 처리 -->
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// 전역 상태를 저장하기 위해
const store = useStore();

// Router 얻기
// 라우팅을 조작할때 사용
const router = useRouter();

// loginForm 초기값
const loginForm = ref({
  loginId: "userApi",
  password: "1234",
});

// 입력값 초기화
function handleReset() {
  loginForm.value = {
    loginId: "",
    password: "",
  };
}
</script>

<!-- 컴포넌트의 스타일 정의 -->
<style scoped>
.container {
  display: flex;
  justify-content: space-between; /* 좌우 끝으로 배치 */
  align-items: center;
  width: 100vw; /* 화면 전체 너비 */
  margin: 0;
  padding: 0; /* 내부 여백 제거 */
  box-sizing: border-box;
  height: 50px;
}
</style>
