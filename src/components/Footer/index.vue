<!-- 컴포넌트의 UI -->
<template>
  <nav>
    <router-link v-if="route.path !== '/'" to="/">홈</router-link> <router-link v-if="route.path !== '/Auth/Login'" to="/Auth/Login">로그인</router-link>
  </nav>
</template>

<!-- 컴포넌트의 초기화 또는 이벤트 처리 -->
<script setup>
import { useRoute } from "vue-router";

// 현재 라우트 정보 가져오기 위해 사용
const route = useRoute();
</script>

<!-- 컴포넌트의 스타일 정의 -->
<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 10px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
