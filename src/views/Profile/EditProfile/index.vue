<!-- ProfileEdit.vue -->
<template>
  <div class="container py-5">
    <div class="card border-3 rounded-4 shadow-sm profile-frame">
      <div class="card-body p-4 p-md-5">
        <h4 class="fw-bold text-brown mb-4">My Profile</h4>

        <div class="row g-5 align-items-start">
          <!-- 왼쪽: 아바타 -->
          <div class="col-12 col-md-4 d-flex flex-column align-items-center">
            <div class="avatar-wrap mb-3">
              <img :src="avatarPreview" class="rounded-circle object-cover" width="220" height="220" alt="avatar" />
            </div>
            <div class="d-grid gap-2 w-100" style="max-width:260px">
              <label class="btn btn-outline-secondary btn-sm rounded-pill">
                사진 업로드
                <input type="file" accept="image/*" class="d-none" @change="onPickAvatar" />
              </label>
              <button v-if="form.avatarFile" class="btn btn-outline-danger btn-sm rounded-pill" @click="clearAvatar">
                사진 제거
              </button>
            </div>
          </div>

          <!-- 오른쪽: 폼 -->
          <div class="col-12 col-md-8">
            <form @submit.prevent="submit">
              <div class="vstack gap-3">

                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person"></i></span>
                  <input v-model.trim="form.name" type="text" class="form-control" placeholder="이름" required />
                </div>

                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-calendar3"></i></span>
                  <input v-model="form.birth" type="text" class="form-control" placeholder="2001.07.24" />
                </div>

                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-badge-ad"></i></span>
                  <input v-model.trim="form.username" type="text" class="form-control" placeholder="아이디" readonly />
                </div>

                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input v-model.trim="form.email" type="email" class="form-control" placeholder="email@example.com" />
                </div>

                <div class="row g-3">
                  <div class="col-sm-6">
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                      <input v-model="form.password" :type="showPw ? 'text' : 'password'" class="form-control" placeholder="비밀번호" />
                      <button type="button" class="btn btn-outline-secondary" @click="showPw = !showPw">
                        <i :class="showPw ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                      <input v-model="form.password2" :type="showPw2 ? 'text' : 'password'" class="form-control" placeholder="비밀번호 확인" />
                      <button type="button" class="btn btn-outline-secondary" @click="showPw2 = !showPw2">
                        <i :class="showPw2 ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="row g-3">
                  <div class="col-sm-8">
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
                      <input v-model.trim="form.address" type="text" class="form-control" placeholder="서울시 송파구" />
                    </div>
                  </div>
                  <div class="col-sm-4 d-grid">
                    <button type="button" class="btn btn-ivory" @click="$emit('search-address')">Search</button>
                  </div>
                </div>

                <div class="form-check mt-2">
                  <input class="form-check-input" type="checkbox" id="denyWalk" v-model="form.denyWalkRequest">
                  <label class="form-check-label" for="denyWalk">
                    산책 메이트 신청을 받고 싶지 않아요
                  </label>
                </div>

                <div class="text-center mt-3">
                  <button type="submit" class="btn btn-brown px-5 py-2 rounded-pill">
                    <span class="paw me-2">🐾</span> 변경사항 저장
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>

        <!-- 귀여운 구석 아이콘(선택) -->
        <div class="d-none d-md-block cute-pets">🐱 🐶</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  /** 초기값 주입 가능 (백엔드 데이터 매핑) */
  modelValue: {
    type: Object,
    default: () => ({
      name: '김병현',
      birth: '2001.07.24',
      username: 'TWOTWO_MOM',
      email: 'twotwomom@naver.com',
      address: '서울시 송파구',
      denyWalkRequest: false,
      avatarUrl: 'https://picsum.photos/seed/dog1/600/600',
    }),
  },
})
const emit = defineEmits(['update:modelValue', 'save', 'search-address'])

const form = reactive({
  name: props.modelValue.name,
  birth: props.modelValue.birth,
  username: props.modelValue.username,
  email: props.modelValue.email,
  password: '',
  password2: '',
  address: props.modelValue.address,
  denyWalkRequest: props.modelValue.denyWalkRequest,
  avatarUrl: props.modelValue.avatarUrl,
  avatarFile: null,
})

watch(form, () => emit('update:modelValue', { ...form }), { deep: true })

const showPw = ref(false)
const showPw2 = ref(false)

const avatarPreview = computed(() =>
  form.avatarFile ? URL.createObjectURL(form.avatarFile) : (form.avatarUrl || placeholder)
)
const placeholder = 'https://dummyimage.com/600x600/e9e9e9/aaaaaa&text=avatar'

function onPickAvatar(e) {
  const file = e.target.files?.[0]
  if (!file) return
  form.avatarFile = file
}
function clearAvatar() {
  form.avatarFile = null
}

function submit() {
  // 간단 검증
  if (form.password || form.password2) {
    if (form.password.length < 8) return alert('비밀번호는 8자 이상으로 입력하세요.')
    if (form.password !== form.password2) return alert('비밀번호 확인이 일치하지 않습니다.')
  }
  // 저장 payload
  const payload = {
    name: form.name,
    birth: form.birth,
    username: form.username,
    email: form.email,
    password: form.password || undefined,
    address: form.address,
    denyWalkRequest: form.denyWalkRequest,
    avatarFile: form.avatarFile, // 파일이 있는 경우에만 업로드
  }
  emit('save', payload)
}
</script>

<style scoped>
/* 테마 */
:root { --brown: #6b3f2a; --ivory:#f2e2c9; }
.text-brown { color: var(--brown); }

.profile-frame { border-color: var(--brown); }
.object-cover { object-fit: cover; }

.avatar-wrap {
  border: 4px solid var(--brown);
  border-radius: 50%;
  padding: 4px;
}

.btn-brown {
  background: var(--brown);
  color:#fff;
  border: none;
}
.btn-brown:hover { filter: brightness(0.95); }

.btn-ivory {
  background: var(--ivory);
  border: 1px solid #c7b6ac;
}
.btn-ivory:hover { filter: brightness(0.98); }

.paw { font-size: 1.2rem; vertical-align: middle; }

/* 배경 느낌 */
.cute-pets {
  position: absolute;
  right: 28px;
  bottom: 18px;
  font-size: 1.8rem;
  opacity: .8;
}
</style>
