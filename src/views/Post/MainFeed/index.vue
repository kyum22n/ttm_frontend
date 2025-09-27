<template>
  <div class="card">
    <div class="card-header">
      <Header />
    </div>
    <div class="card-body">
      <div>메인 피드 컴포넌트</div>
      <nav>
        <router-link to="/Post/Create">게시물 작성</router-link>
      </nav>
      <nav>
        <router-link to="/Post/Detail">게시물 보기</router-link>
      </nav>
    </div>
  </div>
</template>

<script setup>
import Header from "@/components/Header";
</script>

<style scoped>
/* 필요하면 스타일 작성 */
</style>
