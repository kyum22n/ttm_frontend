<!--컴포넌트의 UI-->
<template>
  <div class="card">
    <div class="card-header">
      <nav style="text-align: right"><router-link to="/Auth/Login">로그아웃</router-link> | <router-link to="/Profile/My">내 프로필</router-link></nav>
      MainFeed
    </div>
    <div class="card-body">
      <div>메인 피드 컴포넌트</div>
      <nav><router-link to="/Post/Create">게시물 작성</router-link></nav>
      <nav><router-link to="/Post/Detail">게시물 보기</router-link></nav>
      <nav></nav>
    </div>
  </div>
</template>

<!--컴포넌트의 초기화 or 이벤트 처리-->
<script setup>
//JavaScript를 작성
</script>

<!--컴포넌트의 스타일 정의-->
<style scoped></style>
