<template>
  <div class="container-fluid bg-light min-vh-100 d-flex align-items-center">
    <div class="row w-100">
      <!-- 왼쪽 영역 -->
      <div class="col-md-6 d-flex flex-column align-items-center justify-content-center">
        <img
          src="@/assets/logo_white_bigsize.png"
          alt="로고"
          class="img-fluid"
          style="max-width: 300px;"
        />
        <div class="d-flex gap-4">
          <img src="@/assets/catdog.png" alt="고양이개" class="img-fluid" style="width:300px;" />
        </div>
      </div>

      <!-- 오른쪽 등록 박스 -->
      <div class="col-md-6 d-flex justify-content-center">
        <div class="card border-brown shadow p-4" style="max-width:500px; width:100%;">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-brown m-0">Register Pet</h4>
            <router-link to="/Auth/Login" class="btn btn-outline-brown btn-sm">Login</router-link>
          </div>

          <!-- 프로필 사진 업로드 -->
          <div class="text-center mb-3">
            <label for="petImage" style="cursor:pointer;">
              <img
                :src="previewImage || defaultImage"
                alt="프로필"
                class="rounded-circle border"
                style="width:100px; height:100px; object-fit:cover;"
              />
              <input id="petImage" type="file" class="d-none" accept="image/*" @change="onFileChange" />
            </label>
          </div>

          <!-- 소개 -->
          <div class="mb-3">
            <textarea v-model="pet.petDesc" class="form-control" rows="3" placeholder="반려동물을 소개해주세요"></textarea>
          </div>

          <form @submit.prevent="handleRegister">
            <div class="mb-3 input-group">
              <span class="input-group-text">🐾</span>
              <input v-model="pet.petName" type="text" class="form-control" placeholder="Pet Name" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">📅</span>
              <input v-model="pet.petBirthDay" type="date" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label text-brown">Gender</label><br />
              <div class="form-check form-check-inline">
                <input v-model="pet.petGender" class="form-check-input" type="radio" id="male" value="M" required />
                <label class="form-check-label" for="male">Male</label>
              </div>
              <div class="form-check form-check-inline">
                <input v-model="pet.petGender" class="form-check-input" type="radio" id="female" value="F" />
                <label class="form-check-label" for="female">Female</label>
              </div>
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">⚖️</span>
              <input v-model="pet.petWeight" type="number" class="form-control" placeholder="Weight" />
              <span class="input-group-text">kg</span>
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">🦴</span>
              <input v-model="pet.petBreed" type="text" class="form-control" placeholder="Breed" />
            </div>

            <button type="submit" class="btn btn-brown w-100">펫 등록 완료</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import userApi from "@/apis/userApi";

const store = useStore();
const router = useRouter();

const pet = ref({
  petName: "",
  petBirthDay: "",
  petGender: "",
  petWeight: "",
  petBreed: "",
  petDesc: "",
  petAttach: null,
});

const previewImage = ref(null);
const defaultImage = "@/assets/default-profile.png";

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    pet.value.petAttach = file;
    previewImage.value = URL.createObjectURL(file);
  }
}

async function handleRegister() {
  try {
    const user = store.state.signupUser;
    if (!user) {
      alert("회원 정보가 없습니다. 다시 회원가입을 진행해주세요.");
      router.push("/Register/User");
      return;
    }

    // API 모듈에서 FormData 생성
    const response = await userApi.userJoin(user, pet.value);
    const result = response.data;

    if (result.result === "success") {
      alert("회원가입이 완료되었습니다!");
      store.commit("clearSignupUser");
      router.push("/Auth/Login");
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("회원가입 중 오류:", error);
    alert("회원가입 중 오류가 발생했습니다.");
  }
}
</script>


<style scoped>
.text-brown { color: #6b4a2b; }
.border-brown { border: 2px solid #6b4a2b; }
.btn-brown { background-color: #6b4a2b; color: white; }
.btn-brown:hover { background-color: #56351f; }
.btn-outline-brown { color: #6b4a2b; border: 1px solid #6b4a2b; }
.btn-outline-brown:hover { background-color: #f9f4ef; }
</style>
