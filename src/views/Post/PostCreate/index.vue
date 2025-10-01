<template>
  <div class="container my-5">
    <div class="row">
      <!-- ===== 왼쪽: 대표 이미지 미리보기 ===== -->
      <div class="col-md-4">
        <div class="card mb-3 shadow-sm">
          <img v-if="previewImage" :src="previewImage" class="card-img-top" alt="대표 미리보기" />
          <div v-else class="card-body text-muted text-center">이미지 미리보기</div>
        </div>
      </div>

      <!-- ===== 중앙: 글 작성 ===== -->
      <div class="col-md-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">게시글 작성</h5>

            <!-- 제목 -->
            <input
              v-model="title"
              type="text"
              class="form-control mb-2"
              placeholder="제목을 입력하세요"
            />

            <!-- 내용 -->
            <textarea
              v-model="content"
              rows="6"
              class="form-control mb-3"
              placeholder="내용을 입력하세요"
            ></textarea>

            <!-- 산책 모집글 여부 -->
            <div class="form-check mb-3">
              <input id="isRequest" class="form-check-input" type="checkbox" v-model="isRequest" />
              <label class="form-check-label" for="isRequest">산책 모집글</label>
            </div>

            <!-- 선택된 태그 표시 -->
            <div class="mb-3">
              <span
                v-for="(tag, idx) in selectedTags"
                :key="idx"
                class="badge bg-primary me-2"
                @click="removeTag(tag)"
                style="cursor:pointer"
              >
                {{ tag }} ✕
              </span>
            </div>

            <!-- 태그 선택 영역 -->
            <div>
              <h6 class="fw-bold">태그 선택</h6>

              <!-- 기본 태그 -->
              <div class="d-flex flex-wrap gap-2 mb-2">
                <button
                  v-for="(tag, i) in availableTags.slice(0, 5)"
                  :key="i"
                  class="btn btn-sm"
                  :class="selectedTags.includes(tag) ? 'btn-secondary' : 'btn-outline-primary'"
                  @click="toggleTag(tag)"
                >
                  {{ tag }}
                </button>
              </div>

              <!-- 더보기 태그 (부트스트랩 collapse) -->
              <div class="collapse" id="moreTags">
                <div class="d-flex flex-wrap gap-2 mt-2">
                  <button
                    v-for="(tag, i) in availableTags.slice(5)"
                    :key="'more-' + i"
                    class="btn btn-sm"
                    :class="selectedTags.includes(tag) ? 'btn-secondary' : 'btn-outline-primary'"
                    @click="toggleTag(tag)"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>

              <!-- 더보기/접기 버튼 -->
              <button
                class="btn btn-link p-0 mt-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#moreTags"
                aria-expanded="false"
                aria-controls="moreTags"
                @click="toggleMore"
              >
                {{ showMore ? "접기 ▲" : "더보기 ▼" }}
              </button>
            </div>
          </div>

          <div class="card-footer d-flex justify-content-between">
            <!-- 파일 업로드 버튼 (여러장) -->
            <label
              class="btn btn-dark d-inline-flex align-items-center gap-2 mb-0"
              style="cursor:pointer;"
            >
              <i class="bi bi-folder-plus"></i>
              이미지 선택
              <input
                type="file"
                class="d-none"
                accept="image/*"
                multiple
                @change="onFileChange"
              />
            </label>

            <button class="btn btn-success" :disabled="submitting" @click="submitPost">
              {{ submitting ? "등록 중..." : "게시" }}
            </button>
          </div>
        </div>
      </div>

      <!-- ===== 오른쪽: 첨부 이미지 썸네일 ===== -->
      <div class="col-md-3">
        <h6 class="fw-bold mb-3">첨부 이미지</h6>
        <div class="d-flex flex-column gap-2">
          <div
            v-for="(img, idx) in previewImages"
            :key="idx"
            class="position-relative"
          >
            <img :src="img" class="img-thumbnail w-100" style="max-height:120px; object-fit:cover;" />
            <button
              type="button"
              class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
              @click="removeImage(idx)"
            >
              ✕
            </button>
          </div>

          <div v-if="!previewImages.length" class="text-muted small">
            아직 선택된 이미지가 없습니다.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

// ===== 로컬 상태 =====
const title = ref("");
const content = ref("");
const isRequest = ref(false);

// 로그인 사용자 ID (임시: 스토어/로컬에서 가져오거나 하드코딩)
const store = useStore();
const router = useRouter();
const userId = computed(() =>  1 );

// 태그
const availableTags = ref([
  "#강아지", "#고양이", "#산책", "#귀여움", "#추억",
  "#일상", "#댕댕이", "#냥스타", "#훈련", "#여행", "#캠핑", "#간식"
]);
const selectedTags = ref([]);
const showMore = ref(false);
function toggleTag(tag) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
}
function removeTag(tag) {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag);
}
function toggleMore() {
  showMore.value = !showMore.value;
}

// 이미지 미리보기
const previewImages = ref([]);     // base64 미리보기용
const files = ref([]);             // 실제 File 객체들
const previewImage = ref(null);    // 대표 이미지 base64
const coverFile = ref(null);       // 대표 이미지 File
const submitting = ref(false);

// 여러 장 추가
function onFileChange(e) {
  const picked = Array.from(e.target.files || []);
  if (!picked.length) return;

  for (const file of picked) {
    // 최대 10장 예시
    if (files.value.length >= 10) break;
    files.value.push(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      previewImages.value.push(ev.target.result);
      if (!previewImage.value) previewImage.value = ev.target.result;
      if (!coverFile.value) coverFile.value = file;
    };
    reader.readAsDataURL(file);
  }

  // 동일 파일 재선택 가능하도록 초기화
  e.target.value = "";
}

function removeImage(idx) {
  files.value.splice(idx, 1);
  previewImages.value.splice(idx, 1);
  // 대표 이미지 재지정
  if (previewImages.value.length) {
    previewImage.value = previewImages.value[0];
    coverFile.value = files.value[0] || null;
  } else {
    previewImage.value = null;
    coverFile.value = null;
  }
}

// ===== 작성 제출 =====
async function submitPost() {
  if (!title.value.trim() || !content.value.trim()) {
    return;
  }
  submitting.value = true;
  try {
    // FormData 조립
    const fd = new FormData();
    fd.append("postTitle", title.value);
    fd.append("postContent", content.value);
    fd.append("isRequest", isRequest.value ? "Y" : "N");
    fd.append("postUserId", String(userId.value));
    files.value.forEach((f) => f && fd.append("postAttaches", f));

    // 생성
    const created = await store.dispatch("post/create", fd);
    const newId = created?.postId;
    if (!newId) {
      return;
    }

    // 태그 연결 (선택됨 + 서버 태그 테이블 연결 필요 시)
    if (selectedTags.value.length) {
      // 실제 서버는 tagId를 요구하므로, 운영에선 tagList()로 전체 태그 받아
      // 매칭(tagName -> tagId) 후 아래처럼 호출하세요.
      // 여기서는 데모로 '이름을 ID로 간주'하는 가짜 매핑:
      const fakeTagId = (name) => name; // TODO: 교체
      const tagIds = selectedTags.value.map(t => fakeTagId(t));
      await store.dispatch("post/addTags", { postId: newId, tagIds });
    }

    // 상세로 이동
    router.push(`/post/${newId}`);
  } catch (e) {
    console.error(e);
  } finally {
    submitting.value = false;
  }
}
</script>
