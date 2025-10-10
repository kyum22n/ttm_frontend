<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- 공통 헤더 -->
    <!-- ✅ hideLayout이 true가 아닌 경우에만 헤더/푸터 표시 -->
    <Header v-if="!$route.meta.hideLayout" />

    <!-- 메인 -->
    <div class="flex-grow-1">
      <RouterView :key="$route.fullPath"/> <!--:key="$route.fullPath" 마운트 재사용시 새로 마운트함-->
    </div>

    <!-- 공통 푸터 -->
    <Footer v-if="!$route.meta.hideLayout" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
const route = useRoute();
</script>

<style></style>
