<template>
  <div class="container py-5">
    <div class="card border-3 rounded-4 shadow-sm profile-frame">
      <div class="card-body p-4 p-md-5">
        <h4 class="fw-bold text-brown mb-4">My Profile</h4>

        <div class="row g-5 align-items-start">
          <!-- 왼쪽: 아바타 -->
          <div class="col-12 col-md-4 d-flex flex-column align-items-center">
            <div class="avatar-wrap mb-3">
              <img
                v-if="profileImgUrl"
                :src="profileImgUrl"
                class="rounded-circle object-cover"
                width="220"
                height="220"
                alt="프로필"
              />
            </div>
            <div class="d-grid gap-2 w-100" style="max-width: 260px">
              <label class="btn btn-outline-secondary btn-sm rounded-pill">
                사진 업로드
                <input
                  type="file"
                  accept="image/*"
                  class="d-none"
                  @change="onPickAvatar"
                  ref="fileInput"
                />
              </label>
            </div>
          </div>

          <!-- 오른쪽: 폼 -->
          <div class="col-12 col-md-8">
            <form @submit.prevent="submit">
              <div class="vstack gap-3">
                <!-- 이름 -->
                <div class="input-group">
                  <span class="input-group-text"
                    ><i class="bi bi-person"></i
                  ></span>
                  <input
                    v-model.trim="user.userName"
                    type="text"
                    class="form-control"
                    placeholder="이름"
                    required
                  />
                </div>

                <!-- 생일 -->
                <div class="input-group">
                  <span class="input-group-text"
                    ><i class="bi bi-calendar3"></i
                  ></span>
                  <input
                    :value="user.userBirthDate"
                    type="text"
                    class="form-control"
                    placeholder="2001.07.24"
                    readonly
                  />
                </div>

                <!-- 아이디 (readonly) -->
                <div class="input-group">
                  <span class="input-group-text"
                    ><i class="bi bi-badge-ad"></i
                  ></span>
                  <input
                    :value="readonlyUser.userLoginId"
                    type="text"
                    class="form-control"
                    placeholder="아이디"
                    readonly
                  />
                </div>

                <!-- 이메일 (readonly) -->
                <div class="input-group">
                  <span class="input-group-text"
                    ><i class="bi bi-envelope"></i
                  ></span>
                  <input
                    :value="readonlyUser.userEmail"
                    type="email"
                    class="form-control"
                    placeholder="email@example.com"
                    readonly
                  />
                </div>

                <!-- 비밀번호 / 비밀번호 확인 -->
                <div class="row g-3">
                  <div class="col-sm-6">
                    <div class="input-group">
                      <span class="input-group-text"
                        ><i class="bi bi-lock-fill"></i
                      ></span>
                      <input
                        v-model="user.password"
                        :type="showPw ? 'text' : 'password'"
                        class="form-control"
                        placeholder="비밀번호"
                      />
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        @click="showPw = !showPw"
                      >
                        <i
                          :class="showPw ? 'bi bi-eye-slash' : 'bi bi-eye'"
                        ></i>
                      </button>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="input-group">
                      <span class="input-group-text"
                        ><i class="bi bi-lock-fill"></i
                      ></span>
                      <input
                        v-model="user.password2"
                        :type="showPw2 ? 'text' : 'password'"
                        class="form-control"
                        placeholder="비밀번호 확인"
                      />
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        @click="showPw2 = !showPw2"
                      >
                        <i
                          :class="showPw2 ? 'bi bi-eye-slash' : 'bi bi-eye'"
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 주소 -->
                <div class="row g-3">
                  <div class="col-sm-8">
                    <div class="input-group">
                      <span class="input-group-text"
                        ><i class="bi bi-geo-alt"></i
                      ></span>
                      <input
                        v-model.trim="user.userAddress"
                        type="text"
                        class="form-control"
                        placeholder="서울시 송파구"
                      />
                    </div>
                  </div>
                  <div class="col-sm-4 d-grid">
                    <button
                      type="button"
                      class="btn btn-ivory"
                      @click="$emit('search-address')"
                    >
                      Search
                    </button>
                  </div>
                </div>

                <!-- 체크박스 (readonly) -->
                <div class="form-check mt-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="denyWalk"
                    :checked="readonlyUser.denyWalkRequest"
                    disabled
                  />
                  <label class="form-check-label" for="denyWalk">
                    산책 메이트 신청을 받고 싶지 않아요
                  </label>
                </div>

                <!-- 저장 버튼 -->
                <div class="text-center mt-3">
                  <button
                    type="submit"
                    class="btn btn-brown px-5 py-2 rounded-pill"
                  >
                    <span class="paw me-2">🐾</span> 변경사항 저장
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="d-none d-md-block cute-pets">🐱 🐶</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useStore } from "vuex";

const store = useStore();

const user = ref({
  userId: null,
  userLoginId: "",
  userName: "",
  userAddress: "",
  userBirthDate: "",
  userAvatarUrl: "",
  password: "",
  password2: "",
});

const readonlyUser = ref({
  userLoginId: "",
  userEmail: "",
  userAvatarUrl: "",
  userBirthDate: "",
  denyWalkRequest: false,
});

const profileImgUrl = ref(null);
const pet = ref(null);
const showPw = ref(false);
const showPw2 = ref(false);
const fileInput = ref(null);

// 프로필 이미지 미리보기
function onPickAvatar(e) {
  const file = e.target.files[0];
  if (file) {
    profileImgUrl.value = URL.createObjectURL(file);
  }
}

// 유저 정보 + Pet 정보 불러오기
onMounted(async () => {
  const userId = store.state.user.userId;

  // 1. 유저 정보
  const resUser = await axios.get("/user/info", { params: { userId } });
  const data = resUser.data.data;
  readonlyUser.value = {
    userLoginId: data.userLoginId,
    userEmail: data.userEmail,
    userAvatarUrl: data.userAvatarUrl,
    userBirthDate: data.userBirthDate,
    denyWalkRequest: data.denyWalkRequest,
  };
  user.value = {
    ...user.value,
    userId: data.userId,
    userLoginId: data.userLoginId,
    userName: data.userName || "",
    userAddress: data.userAddress || "",
    userBirthDate: data.userBirthDate || "",
  };

  // 2. Pet 정보 (첫 번째 pet)
  try {
    const resPet = await axios.get("/pet/find-allpetbyuser", {
      params: { petUserId: userId },
    });
    if (resPet.data && resPet.data.length > 0) {
      pet.value = resPet.data[0];
    }
  } catch (e) {
    console.error("Pet 정보 로드 실패", e);
  }

  // 3. 프로필 이미지
  if (store.state.user.profileImage) {
    const res = await axios.get(
      `http://localhost:8080${store.state.user.profileImage}`,
      { responseType: "blob" }
    );
    profileImgUrl.value = URL.createObjectURL(res.data);
  }
});

// 저장
import petApi from "@/apis/petApi";
import userApi from "@/apis/userApi";

async function submit() {
  try {
    // 1️⃣ 유저 정보 업데이트
    const userPayload = {
      userId: user.value.userId,
      userName: user.value.userName,
      userAddress: user.value.userAddress,
      password: user.value.password || undefined, // 비밀번호가 입력되면 포함
    };

    const resUser = await userApi.userUpdate(userPayload);

    if (!resUser.data || resUser.data.result !== "success") {
      alert("유저 정보 업데이트 실패");
      return;
    }

    // 2️⃣ 펫 이미지 업데이트 (선택된 파일이 있을 때만)
    if (pet.value && pet.value.petAttach) {
      const formData = new FormData();
      formData.append("petId", pet.value.petId);
      formData.append("petUserId", user.value.userId);
      formData.append("petAttach", pet.value.petAttach);

      const resPet = await petApi.update(formData);

      if (resPet.data && resPet.data.result === "success") {
        // 서버에서 리턴한 URL로 UI 갱신
        if (resPet.data.petAttachUrl) {
          profileImgUrl.value = resPet.data.petAttachUrl;
        }
        // pet 객체 갱신
        pet.value = { ...pet.value, ...resPet.data.pet };
        // 업로드 완료 후 petAttach 초기화
        pet.value.petAttach = null;
      } else {
        alert("펫 이미지 업데이트 실패");
        return;
      }
    }

    alert("프로필 및 펫 이미지 업데이트 완료!");
    // 비밀번호 초기화
    user.value.password = "";
    user.value.password2 = "";
  } catch (error) {
    console.error("업데이트 실패", error);
    alert("업데이트 중 오류가 발생했습니다.");
  }
}
</script>

<style scoped>
.profile-frame {
  max-width: 960px;
  margin: auto;
}
.avatar-wrap img {
  width: 220px;
  height: 220px;
  object-fit: cover;
}
</style>
