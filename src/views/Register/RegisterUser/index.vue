<template>
  <div class="signup-container">
    <!-- 왼쪽 영역 -->
    <div class="left-area">
      <h1 class="title">나와 <span class="paw">🐾</span><br />산책가개</h1>
      <div class="pets">
        <img src="@/assets/cat.png" alt="고양이" class="pet" />
        <img src="@/assets/dog.png" alt="강아지" class="pet" />
      </div>
    </div>

    <!-- 오른쪽 회원가입 박스 -->
    <div class="signup-box">
      <div class="top-bar">
        <h2>Create account</h2>
        <router-link to="/Auth/Login" class="login-btn">Login</router-link>
      </div>

      <!-- 프로필 이미지 업로드 -->
      <div class="profile-upload">
        <img src="@/assets/default-profile.png" alt="프로필" class="profile-img" />
        <!-- <label class="edit-btn">✏️</label> -->
      </div>

      <form @submit.prevent="handleSignup" class="form-area">
        <div class="input-group">
          <span class="icon">👤</span>
          <!-- 양방향 바인딩을 위한 v-model 사용 -->
          <!-- 입력창의 입력값에 따라 데이터 변경 데이터에 따라 입력값 변경 -->
          <!-- required 사용해 필수 값으로 지정 -->
          <!-- 단순히 비었는지 여부만 검사 -->
          <input v-model="user.userName" type="text" placeholder="이름" required />
        </div>

        <div class="input-group">
          <span class="icon">📅</span>
          <input v-model="user.userBirthDate" type="date" required />
        </div>

        <div class="input-group">
          <span class="icon">🆔</span>
          <input v-model="user.userLoginId" type="text" placeholder="아이디" required />
        </div>

        <div class="input-group">
          <span class="icon">✉️</span>
          <input v-model="user.userEmail" type="email" placeholder="이메일" required />
        </div>

        <div class="input-group">
          <span class="icon">🔒</span>
          <input v-model="password" type="password" placeholder="비밀번호" required />
        </div>
        <div class="input-group">
          <input v-model="confirm" type="password" placeholder="비밀번호 확인" required />
        </div>

        <div class="input-group">
          <span class="icon">🌍</span>
          <input v-model="region" type="text" placeholder="지역" />
          <button type="button" class="search-btn">Search</button>
        </div>

        <div class="agree"><input type="checkbox" v-model="agree" /> 개인정보 처리방침 동의</div>
        <br />
        <!-- api 연결 후 주석 해제 -->
        <!-- <button type="submit" class="signup-btn">펫 등록하러 가기</button> -->
        <router-link to="/Register/Pet" class="signup-btn text-decoration-none">펫 등록하러 가기</router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import userApi from "@/apis/userApi";
import { useRouter } from "vue-router";

const router = useRouter();

// 상태 정의
const user = ref({
  userLoginId: "userApi",
  userPassword: "1234",
  userName: "hsh",
  userEmail: "endehhau@naver.com",
  userAddress: "Seoul",
  userBirthDate: "2025-09-23",
});

const agree = false;

async function handleSignup() {
  //1) 순수 자바스크립트 객체로 변환
  const data = structuredClone(user.value);
  // 데이터 출력
  console.log(data);
  if (!agree.value) {
    alert("개인정보 처리방침에 동의해야 합니다.");
    return;
  }
  if (user.value.userPassword !== confirm.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }
  console.log("회원가입 시도:", {
    userLoginId: user.value.userLoginId,
    userPassword: user.value.userPassword,
    userName: user.value.userName,
    userEmail: user.value.userEmail,
    userAddress: user.value.userAddress,
    userBirthDate: user.value.userBirthDate,
  });

  try {
    //1) 순수 자바스크립트 객체로 변환
    // 객체를 깊은 복사 하기 위해서 사용
    // 새로운 객체 생성 가능
    const data = structuredClone(user.value);
    console.log(data);

    //2) 유효성 검사

    //3) REST API 호출
    // Axios 응답 객체 생성
    // axios.post는 promise 반환
    const response = await userApi.memberCreate(data);
    // response 안에는 data, status, headers 등 다양한 요소가 존재
    // data 안에는 서버에서 실제 보낸 응답 데이터인 (JSON, text 등)이 존재
    // resultObject 안에는 백엔드에서 응답 받은 데이터가 들어감
    const resultObject = response.data; //{result:"success"}, {result:"fail", message:"xxx"}
    if (resultObject.result === "success") {
      //4) 로그인 폼으로 이동
      await router.push("/Ch08RestAPI/Exam02Login");
    } else {
      window.alert(resultObject.message);
    }
  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped>
.signup-container {
  width: 1920px;
  height: 1080px;
  margin: 0 auto;
  background: #6b4a2b;
  font-family: "Noto Sans KR", sans-serif;
  position: relative;
}

/* 왼쪽 영역 */
.left-area {
  position: absolute;
  top: 300px;
  left: 300px; /* ✅ 좀 더 중앙으로 */
  width: 500px;
  text-align: center;
  color: #fff6d9;
}

.title {
  font-size: 2.4rem;
  font-weight: bold;
  line-height: 1.4;
}

.paw {
  font-size: 1.8rem;
}

.pets {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.pet {
  width: 80px;
  height: auto;
}

/* 오른쪽 회원가입 박스 */
.signup-box {
  position: absolute;
  top: 100px;
  left: 900px; /* ✅ 오른쪽에서 왼쪽으로 위치 지정 */
  width: 500px;
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* 상단 바 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.top-bar h2 {
  font-size: 1.3rem;
  color: #6b4a2b;
}

.login-btn {
  padding: 6px 14px;
  border: 1px solid #6b4a2b;
  border-radius: 6px;
  background: #fff;
  color: #6b4a2b;
  font-size: 0.9rem;
  text-decoration: none;
}

.login-btn:hover {
  background: #f9f4ef;
}

/* 프로필 업로드 */
.profile-upload {
  text-align: center;
  position: relative;
  margin-bottom: 20px;
}

.profile-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #eee;
}

.edit-btn {
  position: absolute;
  bottom: 6px;
  right: calc(50% - 45px);
  font-size: 0.9rem;
  cursor: pointer;
}

/* 입력 폼 */
.form-area {
  display: block;
}

.input-group {
  display: flex;
  align-items: center;
  background: #f1f1f1;
  border-radius: 6px;
  padding: 6px 10px;
  margin-bottom: 14px;
}

.input-group input {
  border: none;
  flex: 1;
  padding: 6px;
  background: none;
  outline: none;
}

.icon {
  margin-right: 8px;
}

/* 지역 검색 버튼 */
.search-btn {
  margin-left: 6px;
  padding: 6px 12px;
  background: #fce9b6;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.search-btn:hover {
  background: #fbdc89;
}

/* 개인정보 동의 */
.agree {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
}

/* 회원가입 버튼 */
.signup-btn {
  margin-top: 10px;
  width: 100%;
  background: #6b4a2b;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  text-align: center;
}

.signup-btn:hover {
  background: #56351f;
}
</style>
