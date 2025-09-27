<!-- 컴포넌트의 UI -->
<template>
  <div class="card">
    <div class="card-header">My Profile</div>
    <div class="card-body">
      내 프로필 컴포넌트
      <nav>
        <router-link to="/Post/MainFeed">메인 피드로</router-link>
      </nav>
      <nav>
        <router-link to="/Auth/Login">로그아웃</router-link>
      </nav>
      <nav>
        <router-link to="/Profile/Edit">프로필 수정</router-link>
      </nav>
      <nav>
        <router-link to="/Post/Detail">내 게시글</router-link>
      </nav>
    </div>
  </div>
</template>

<!-- 컴포넌트의 초기화 또는 이벤트 처리 -->
<script setup></script>

<!-- 컴포넌트의 스타일 정의 -->
<style scoped></style>
