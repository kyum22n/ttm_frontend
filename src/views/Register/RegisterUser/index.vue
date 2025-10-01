<template>
  <div class="container-fluid bg-brown text-light min-vh-100 d-flex align-items-center">
    <div class="row w-100">
      <!-- 왼쪽 -->
      <div class="col-md-6 d-flex flex-column align-items-center justify-content-center">
        <img
          src="@/assets/logo_white_bigsize.png"
          alt="로고"
          class="img-fluid"
          style="max-width: 300px;"
        />
        <div class="d-flex gap-0">
          <img src="@/assets/catdog.png" alt="고양이개" class="img-fluid" style="width:300px;" />
        </div>
      </div>

      <!-- 오른쪽 -->
      <div class="col-md-6 d-flex justify-content-center">
        <div class="card shadow-lg p-4" style="max-width:500px; width:100%;">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="text-brown m-0">Create account</h4>
            <router-link to="/Auth/Login" class="btn btn-outline-brown btn-sm">Login</router-link>
          </div>

          <form @submit.prevent="goNext">
            <div class="mb-3 input-group">
              <span class="input-group-text">👤</span>
              <input v-model="user.userName" type="text" class="form-control" placeholder="이름" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">📅</span>
              <input v-model="user.userBirthDate" type="date" class="form-control" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">🆔</span>
              <input v-model="user.userLoginId" type="text" class="form-control" placeholder="아이디" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">✉️</span>
              <input v-model="user.userEmail" type="email" class="form-control" placeholder="이메일" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">🔒</span>
              <input v-model="user.userPassword" type="password" class="form-control" placeholder="비밀번호" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">🔒</span>
              <input v-model="confirm" type="password" class="form-control" placeholder="비밀번호 확인" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">🌍</span>
              <input v-model="user.userAddress" type="text" class="form-control" placeholder="지역" />
            </div>

            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" v-model="agree" id="agreeCheck" />
              <label class="form-check-label small" for="agreeCheck">개인정보 처리방침 동의</label>
            </div>

            <button type="submit" class="btn btn-brown w-100">다음 (펫 등록)</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const user = ref({
  userLoginId: "hello",
  userPassword: "12345",
  userName: "hello",
  userEmail: "hello@hello.com",
  userAddress: "hello",
  userBirthDate: "",
});

const confirm = ref("");
const agree = ref(false);

function goNext() {
  if (!agree.value) {
    alert("개인정보 처리방침에 동의해야 합니다.");
    return;
  }
  if (user.value.userPassword !== confirm.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }
  // Vuex에 저장 (펫 등록 단계에서 불러옴)
  store.commit("setSignupUser", user.value);
  router.push("/Register/Pet");
}
</script>

<style scoped>
.bg-brown { background-color: #6b4a2b; }
.text-brown { color: #6b4a2b; }
.btn-brown { background-color: #6b4a2b; color: white; }
.btn-brown:hover { background-color: #56351f; }
.btn-outline-brown { color: #6b4a2b; border: 1px solid #6b4a2b; }
.btn-outline-brown:hover { background-color: #f9f4ef; }
</style>
