```vue
<template>
  <div class="login-container">
    <!-- 로고 영역 -->
    <div class="logo-area">
      <img src="@/assets/dog.png" alt="강아지" class="pet pet-left" />
      <div class="title">
        <router-link to="/" class="home-link">
          <h1>나와 <span class="paw">🐾</span><br />산책가개</h1>
        </router-link>
      </div>
      <img src="@/assets/dog.png" alt="강아지" class="pet pet-right" />
    </div>

    <!-- 로그인 박스 -->
    <div class="login-box">
      <div class="header">
        <span>Login</span>
        <router-link to="/Register/User" class="signup">Sign up</router-link>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <span class="icon">👤</span>
          <input v-model="loginForm.loginId" type="text" placeholder="NickName" required />
        </div>
        <div class="input-group">
          <span class="icon">🔒</span>
          <input v-model="loginForm.password" type="password" placeholder="Password" required />
        </div>

        <div class="find-account">
          <router-link to="/Auth/FindAccount">계정 찾기</router-link>
        </div>

        <button type="submit" class="login-btn">Login</button>
      </form>
    </div>
    <RouterLink to="/Auth/View2">아이디 비밀번호 찾기</RouterLink>
    <RouterLink to="/Auth/View3">펫등록</RouterLink>
    <RouterLink to="/Auth/View5">마이프로필</RouterLink>
    <RouterLink to="/Auth/View6">게시물 작성</RouterLink>
    <RouterLink to="/Auth/View7">게시물 상세보기</RouterLink>
    <RouterLink to="/Auth/View8">메인 페이지</RouterLink>
    <RouterLink to="/Auth/View9">마이 페이지</RouterLink>
    <RouterLink to="/Auth/View10">상대 페이지</RouterLink>
    <RouterLink to="/Auth/View11">드롭다운</RouterLink>
    <RouterLink to="/Auth/View12">산책신청목록</RouterLink>
    <RouterLink to="/Auth/View13">산책리스트</RouterLink>
    <RouterLink to="/Auth/View14">메세지목록</RouterLink>
    <RouterLink to="/Auth/View15">메세지</RouterLink>
  </div>
</template>

<script setup>
import { ref } from "vue";
import userLoginApi from "@/apis/userLoginApi";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

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

async function handleLogin() {
  try {
    const data = structuredClone(loginForm.value);
    const response = await userLoginApi.userLogin(data);
    const resultObject = response.data;
    if (resultObject.result === "success") {
      // loginId 와 jwt 출력
      // console.log("userLoginId:", resultObject.loginId);
      // console.log("jwt:", resultObject.jwt);
      console.log("로그인 성공: ", resultObject.loginId);
      store.dispatch("saveAuth", resultObject);
      await router.push("/post/MainFeed");
    } else {
      console.log(resultObject.message);
    }
  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped>
/* 배경 */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #fdfcf9;
  font-family: "Noto Sans KR", sans-serif;
}

/* 로고 타이틀 */
.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
}

.home-link {
  text-decoration: none;
  color: inherit; /* 부모 색상 따라감 (#6b3f22) */
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #6b3f22;
  text-align: center;
  line-height: 1.4;
}

.paw {
  font-size: 1.8rem;
}

.pet {
  width: 60px;
  height: auto;
}

.pet-left {
  margin-right: 10px;
}

.pet-right {
  margin-left: 10px;
}

/* 로그인 박스 */
.login-box {
  background: #7b4a2d;
  color: white;
  padding: 30px;
  border-radius: 20px;
  width: 350px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.login-box .header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.signup {
  font-size: 0.9rem;
  color: #fff;
  text-decoration: underline;
}

/* 입력창 */
.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  background: #fff;
  border-radius: 6px;
  padding: 5px 10px;
}

.input-group .icon {
  margin-right: 8px;
}

.input-group input {
  border: none;
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  outline: none;
}

/* 계정 찾기 */
.find-account {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}

.find-account a {
  display: block; /* 블록으로 만들어서 text-align 가능 */
  text-align: right;
  margin: 10px 0;
  font-size: 0.9rem;
  color: #fff; /* 로그인 박스 배경색에 맞게 */
  text-decoration: none; /* 🔥 밑줄 제거 */
}

/* 로그인 버튼 */
.login-btn {
  width: 100%;
  background: #fce9b6;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.login-btn:hover {
  background: #fbdc89;
}
</style>
