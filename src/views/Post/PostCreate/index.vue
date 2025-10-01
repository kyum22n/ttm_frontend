<template>
  <div class="container my-5">
    <div class="row g-4">
      <!-- ===== 왼쪽: 대표 이미지 미리보기 ===== -->
      <div class="col-md-4">
        <div class="border rounded p-3 text-center">
          <img v-if="previewImage" :src="previewImage" class="img-fluid rounded" alt="대표 미리보기" />
          <div v-else class="text-muted small">이미지 미리보기</div>
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

            <!-- 선택된 태그 -->
            <div class="mb-3">
              <span
                v-for="(tag, idx) in selectedTags"
                :key="idx"
                class="badge bg-primary me-2"
                style="cursor:pointer"
                @click="removeTag(tag)"
              >
                {{ tag }} ✕
              </span>
            </div>

            <!-- 태그 선택 -->
            <h6 class="fw-bold">태그 선택</h6>
            <div class="d-flex flex-wrap gap-2 mb-2">
              <button
                v-for="(tag, i) in availableTags.slice(0, 5)"
                :key="i"
                type="button"
                class="btn btn-sm"
                :class="selectedTags.includes(tag) ? 'btn-secondary' : 'btn-outline-primary'"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </button>
            </div>

            <div class="collapse" id="moreTags">
              <div class="d-flex flex-wrap gap-2 mt-2">
                <button
                  v-for="(tag, i) in availableTags.slice(5)"
                  :key="'more-' + i"
                  type="button"
                  class="btn btn-sm"
                  :class="selectedTags.includes(tag) ? 'btn-secondary' : 'btn-outline-primary'"
                  @click="toggleTag(tag)"
                >
                  {{ tag }}
                </button>
              </div>
            </div>

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

          <div class="card-footer d-flex justify-content-between">
            <!-- 파일 업로드 -->
            <label class="btn btn-dark d-inline-flex align-items-center gap-2 mb-0">
              <i class="bi bi-folder-plus"></i>
              이미지 선택
              <input type="file" class="d-none" multiple accept="image/*" @change="onFileChange" />
            </label>

            <button type="button" class="btn btn-success" :disabled="submitting" @click="submitPost">
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
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

// 작성 상태
const title = ref("");
const content = ref("");
const isRequest = ref(false);
const userId = 1; // TODO: 로그인 값 연동

// 태그
const availableTags = ["#강아지", "#고양이", "#산책", "#귀여움", "#추억", "#일상", "#여행", "#캠핑"];
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

// 이미지
const previewImages = ref([]);
const files = ref([]);
const previewImage = ref(null);
const submitting = ref(false);

function onFileChange(e) {
  const picked = Array.from(e.target.files || []);
  for (const file of picked) {
    if (files.value.length >= 10) break;
    files.value.push(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      previewImages.value.push(ev.target.result);
      if (!previewImage.value) previewImage.value = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
  e.target.value = "";
}

function removeImage(idx) {
  files.value.splice(idx, 1);
  previewImages.value.splice(idx, 1);
  previewImage.value = previewImages.value[0] || null;
}

// 제출
async function submitPost() {
  if (!title.value.trim() || !content.value.trim()) return;
  submitting.value = true;
  try {
    const fd = new FormData();
    fd.append("postTitle", title.value);
    fd.append("postContent", content.value);
    fd.append("isRequest", isRequest.value ? "Y" : "N");
    fd.append("postUserId", String(userId));
    files.value.forEach((f) => f && fd.append("postAttaches", f));

    const created = await store.dispatch("post/create", fd);
    const newId = created?.postId;
    if (!newId) return;

    if (selectedTags.value.length) {
      const fakeTagId = (name) => name;
      const tagIds = selectedTags.value.map((t) => fakeTagId(t));
      await store.dispatch("post/addTags", { postId: newId, tagIds });
    }

    router.push(`/post/${newId}`);
  } catch (e) {
    console.error(e);
  } finally {
    submitting.value = false;
  }
}
</script>
