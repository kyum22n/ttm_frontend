<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- 헤더 -->
    <AppHeader />

    <!-- 본문 -->
    <main class="flex-grow-1 d-flex justify-content-center align-items-center bg-light">
      <h1>여기는 TestView 입니다 🎉</h1>
    </main>

    <!-- 푸터 -->
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from "@/components/Header";
</script>
