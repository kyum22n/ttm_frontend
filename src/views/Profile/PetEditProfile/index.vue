<template>
  <div class="container my-5">
    <div class="card border-2 shadow" style="border-color:#7a5a3a;">
      <div class="card-header bg-white">
        <h4 class="fw-bold m-0" style="color:#7a5a3a;">✏️ 펫 프로필 수정</h4>
      </div>

      <div class="card-body">
        <form @submit.prevent="handleUpdate" class="row g-4 align-items-center">

          <!-- LEFT : 펫 이미지 -->
          <div class="col-12 col-md-4 d-flex flex-column align-items-center">
            <img
              :src="petPreview || defaultImg"
              alt="pet profile"
              class="rounded-circle border"
              style="width:200px; height:200px; object-fit:cover;"
            />
            <div class="mt-3 w-100">
              <label class="form-label">프로필 사진 변경</label>
              <input
                type="file"
                accept="image/*"
                class="form-control"
                @change="onImageChange"
              />
            </div>
          </div>

          <!-- RIGHT : 펫 정보 -->
          <div class="col-12 col-md-8">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label">이름</label>
                <input v-model="pet.petName" type="text" class="form-control" required />
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">품종</label>
                <input v-model="pet.petBreed" type="text" class="form-control" />
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">성별</label>
                <select v-model="pet.petGender" class="form-select" required>
                  <option disabled value="">선택</option>
                  <option value="M">남아</option>
                  <option value="F">여아</option>
                </select>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">나이</label>
                <input v-model.number="pet.petAge" type="number" min="0" class="form-control" />
              </div>

              <div class="col-12">
                <button type="submit" class="btn btn-primary w-100 btn-lg">
                  수정하기
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- FOOTER 귀여운 고양이, 강아지 -->
      <div class="card-footer bg-white d-flex justify-content-end align-items-end gap-2" style="min-height:80px;">
        <img src="@/assets/cat.png" alt="고양이" style="width:60px; height:auto;" />
        <img src="@/assets/dog.png" alt="강아지" style="width:60px; height:auto;" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import defaultImg from "@/assets/default-profile.png";
// import axios from "axios";

const route = useRoute();

const pet = reactive({
  petId: null,
  petName: "",
  petBreed: "",
  petGender: "",
  petAge: null,
});

const petFile = ref(null);
const petPreview = ref("");
const saving = ref(false);

function onImageChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  petFile.value = file;
  petPreview.value = URL.createObjectURL(file);
}

async function handleUpdate() {
  saving.value = true;
  try {
    const fd = new FormData();
    Object.entries(pet).forEach(([k, v]) => fd.append(k, v));
    if (petFile.value) fd.append("petAttach", petFile.value);

    // 실제 수정 API 호출
    // await axios.put("/pet/update", fd, { headers: { "Content-Type": "multipart/form-data" } });

    await new Promise((r) => setTimeout(r, 500));
    alert("펫 프로필 수정 완료!");
  } catch (err) {
    console.error(err);
    alert("수정 실패!");
  } finally {
    saving.value = false;
  }
}

// 🚩 페이지 진입 시 기존 데이터 불러오기
onMounted(async () => {
  const petId = route.query.petId; // 예: /pet/edit?petId=3
  if (petId) {
    pet.petId = petId;

    // 실제 API 예시
    // const { data } = await axios.get(`/pet/find-by-id?petId=${petId}`);
    // Object.assign(pet, data);

    // 데모용 더미 데이터
    pet.petName = "두두";
    pet.petBreed = "말티즈";
    pet.petGender = "M";
    pet.petAge = 3;
    petPreview.value = defaultImg; // DB 이미지 불러오면 Blob → URL.createObjectURL 로 교체
  }
});
</script>
