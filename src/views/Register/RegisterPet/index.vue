<template>
  <div class="container-fluid bg-light min-vh-100 d-flex align-items-center">
    <div class="row w-100">
      <!-- 왼쪽 영역 -->
      <div class="col-md-6 d-flex flex-column align-items-center justify-content-center">
        <h1 class="fw-bold text-brown text-center mb-4">
          나와 <span class="fs-2">🐾</span><br />산책가개
        </h1>
        <div class="d-flex gap-4">
          <img src="@/assets/cat.png" alt="고양이" class="img-fluid" style="width:80px;" />
          <img src="@/assets/dog.png" alt="강아지" class="img-fluid" style="width:80px;" />
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
            <textarea v-model="form.petDesc" class="form-control" rows="3" placeholder="반려동물을 소개해주세요"></textarea>
          </div>

          <form @submit.prevent="handleRegister">
            <div class="mb-3 input-group">
              <span class="input-group-text">🐾</span>
              <input v-model="form.petName" type="text" class="form-control" placeholder="Pet Name" required />
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">📅</span>
              <input v-model="form.petBirthday" type="date" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label text-brown">Gender</label><br />
              <div class="form-check form-check-inline">
                <input v-model="form.petGender" class="form-check-input" type="radio" id="male" value="M" required />
                <label class="form-check-label" for="male">Male</label>
              </div>
              <div class="form-check form-check-inline">
                <input v-model="form.petGender" class="form-check-input" type="radio" id="female" value="F" />
                <label class="form-check-label" for="female">Female</label>
              </div>
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">⚖️</span>
              <input v-model="form.petWeight" type="number" class="form-control" placeholder="Weight" />
              <span class="input-group-text">kg</span>
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">🦴</span>
              <input v-model="form.petBreed" type="text" class="form-control" placeholder="Breed" />
            </div>

            <button type="submit" class="btn btn-brown w-100">펫 등록 완료</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import petApi from "@/apis/petApi";

const route = useRoute();
const router = useRouter();

const userId = ref(null); // 회원가입에서 넘어온 userId

const form = ref({
  petName: "",
  petBirthday: "",
  petGender: "",
  petWeight: "",
  petBreed: "",
  petDesc: "",
  petUserId: null, // 백엔드에서 FK
});

const defaultImage = "@/assets/default-profile.png";
const previewImage = ref(null);

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
  }
}

onMounted(() => {
  userId.value = route.query.userId;
  form.value.petUserId = userId.value; // FK 세팅
});

async function handleRegister() {
  try {
    const response = await petApi.register(form.value);
    const resultObject = response.data;
    if (resultObject.result === "success") {
      alert("반려동물이 등록되었습니다!");
      await router.push("/"); // 홈 또는 마이페이지로 이동
    } else {
      alert(resultObject.message);
    }
  } catch (error) {
    console.error(error);
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
