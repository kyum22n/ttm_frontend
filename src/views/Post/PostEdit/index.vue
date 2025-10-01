<!-- src/views/PostEdit.vue (예시) -->
<template>
  <div class="container my-5" v-if="loaded">
    <div class="row">
      <!-- ===== 왼쪽: 대표 이미지 미리보기 ===== -->
      <div class="col-md-4">
        <div class="card mb-3 shadow-sm">
          <img v-if="previewImage" :src="previewImage" class="card-img-top" alt="대표 미리보기" />
          <div v-else class="card-body text-muted text-center">
            이미지 미리보기 (신규 첨부만 표시)
          </div>
        </div>
      </div>

      <!-- ===== 중앙: 글 수정 ===== -->
      <div class="col-md-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">게시글 수정</h5>

            <!-- 제목 (백엔드가 postTitle 받으므로 포함 권장) -->
            <input
              v-model="title"
              type="text"
              class="form-control mb-2"
              placeholder="제목을 입력하세요"
            />

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

              <!-- 항상 보이는 기본 태그 -->
              <div class="d-flex flex-wrap gap-2 mb-2">
                <button
                  v-for="(t, i) in topTags"
                  :key="`top-${i}`"
                  class="btn btn-sm"
                  :class="selectedTags.includes(t.tagName) ? 'btn-secondary' : 'btn-outline-primary'"
                  @click="toggleTag(t.tagName)"
                >
                  {{ t.tagName }}
                </button>
              </div>

              <!-- collapse 안에 숨겨진 태그 -->
              <div class="collapse" id="moreTags">
                <div class="d-flex flex-wrap gap-2 mt-2">
                  <button
                    v-for="(t, i) in moreTags"
                    :key="`more-${i}`"
                    class="btn btn-sm"
                    :class="selectedTags.includes(t.tagName) ? 'btn-secondary' : 'btn-outline-primary'"
                    @click="toggleTag(t.tagName)"
                  >
                    {{ t.tagName }}
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

          <div class="card-footer d-flex flex-wrap gap-3 justify-content-between align-items-center">
            <!-- 이미지 추가 방식 -->
            <div class="d-flex align-items-center gap-3">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" id="modeAppend" value="append" v-model="imageMode">
                <label class="form-check-label" for="modeAppend">이미지 추가(append)</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" id="modeReplace" value="replace" v-model="imageMode">
                <label class="form-check-label" for="modeReplace">이미지 교체(replace)</label>
              </div>
            </div>

            <button class="btn btn-success" :disabled="submitting" @click="updatePost">
              {{ submitting ? "저장 중..." : "수정 저장" }}
            </button>
          </div>
        </div>
      </div>

      <!-- ===== 오른쪽: 첨부 이미지 영역 (신규 첨부 미리보기) ===== -->
      <div class="col-md-3">
        <h6 class="fw-bold mb-3">첨부 이미지</h6>

        <!-- 파일 업로드 버튼 -->
        <div class="mb-3 text-center">
          <label
            class="d-inline-flex align-items-center justify-content-center bg-dark text-white rounded p-3"
            style="cursor:pointer; width:80px; height:80px;"
          >
            <i class="bi bi-folder-plus fs-3"></i>
            <input
              type="file"
              class="d-none"
              accept="image/*"
              multiple
              @change="onFileChange"
            />
          </label>
          <div class="small text-muted mt-2">이미지 추가 (최대 10장)</div>
          <div class="small text-muted">※ 기존 이미지는 서버에 남아있으며, <b>replace</b> 선택 + 새 이미지 업로드 시 교체됩니다.</div>
        </div>

        <!-- 썸네일 리스트(신규 업로드만 표시) -->
        <div class="d-flex flex-column gap-2">
          <div
            v-for="(img, idx) in previewImages"
            :key="idx"
            class="position-relative"
          >
            <img
              :src="img"
              class="img-thumbnail w-100"
              style="max-height:120px; object-fit:cover; cursor:pointer;"
              @click="setAsMain(idx)"
              :alt="`첨부 이미지 ${idx + 1}`"
            />
            <!-- 좌측 하단: 대표 지정 -->
            <span
              class="badge bg-success position-absolute bottom-0 start-0 m-1"
              v-if="previewImage === img"
            >
              대표
            </span>
            <!-- 삭제 버튼 -->
            <button
              type="button"
              class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
              @click="removeImage(idx)"
            >
              ✕
            </button>
          </div>

          <div v-if="!previewImages.length" class="text-muted small">
            아직 선택된 새 이미지가 없습니다.
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- 로딩/초기 -->
  <div class="container my-5" v-else>
    <div class="alert alert-light border text-center">불러오는 중...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import postApi from "@/apis/postApi";

const route = useRoute();
const router = useRouter();
const store = useStore();

const loaded = ref(false);
const submitting = ref(false);

// 폼 상태
const title = ref("");
const content = ref("");
const isRequest = ref(false);

// 태그
const selectedTags = ref([]);
const allTags = ref([]); // [{tagId, tagName}, ...]
const showMore = ref(false);
const topTags = computed(() => allTags.value.slice(0, 5));
const moreTags = computed(() => allTags.value.slice(5));

// 신규 업로드 파일/미리보기
const files = ref([]);          // File[]
const previewImages = ref([]);  // base64[]
const previewImage = ref(null); // 대표(첫 이미지)
const imageMode = ref("append"); // 'append' | 'replace'

// 기존 상세
const detail = computed(() => store.state.post.detail);

// 초기 로딩
onMounted(async () => {
  const postId = route.params.id;
  if (!postId) return;

  // 1) 상세 불러오기
  await store.dispatch("post/fetchDetail", postId);

  // 2) 전체 태그 목록(이름→id 매핑용)
  const tagRes = await postApi.getTagList();
  allTags.value = (tagRes.data && tagRes.data.tags) ? tagRes.data.tags : [];

  // 3) 폼에 기존 값 채우기
  if (detail.value) {
    title.value = detail.value.postTitle || "";
    content.value = detail.value.postContent || "";
    isRequest.value = (String(detail.value.isRequest || "N").toUpperCase() === "Y");

    // 현재 게시물의 태그 → 이름 배열로 변환
    const currentTags = (store.state.post.tags || []).map(t => t.tagName);
    selectedTags.value = currentTags;
  }

  // (참고) 기존 이미지는 서버에서 내려주는 이미지 URL/엔드포인트가 없으므로
  // 신규로 추가한 이미지들만 미리보기로 표시합니다.
  loaded.value = true;
});

// 태그 토글
function toggleTag(name) {
  const idx = selectedTags.value.indexOf(name);
  if (idx >= 0) selectedTags.value.splice(idx, 1);
  else selectedTags.value.push(name);
}
function removeTag(name) {
  const idx = selectedTags.value.indexOf(name);
  if (idx >= 0) selectedTags.value.splice(idx, 1);
}
function toggleMore() {
  showMore.value = !showMore.value;
}

// 파일 추가
function onFileChange(e) {
  const picked = Array.from(e.target.files || []);
  if (!picked.length) return;

  for (const f of picked) {
    if (files.value.length >= 10) break;
    files.value.push(f);

    const reader = new FileReader();
    reader.onload = ev => {
      previewImages.value.push(ev.target.result);
      if (!previewImage.value) previewImage.value = ev.target.result;
    };
    reader.readAsDataURL(f);
  }
  e.target.value = "";
}

// 썸네일 삭제/대표 지정
function removeImage(idx) {
  const removed = previewImages.value.splice(idx, 1)[0];
  files.value.splice(idx, 1);
  if (previewImage.value === removed) {
    previewImage.value = previewImages.value[0] || null;
  }
}
function setAsMain(idx) {
  previewImage.value = previewImages.value[idx] || null;
}

// 저장
async function updatePost() {
  if (!detail.value) return;

  submitting.value = true;
  try {
    // 1) 글/이미지 업데이트 (multipart)
    const fd = new FormData();
    fd.append("postId", String(detail.value.postId));
    if (title.value) fd.append("postTitle", title.value);
    if (content.value) fd.append("postContent", content.value);
    fd.append("isRequest", isRequest.value ? "Y" : "N");

    // 새로 추가한 이미지
    for (const f of files.value) {
      fd.append("postAttaches", f);
    }

    await store.dispatch("post/update", {
      formData: fd,
      imageMode: imageMode.value, // 'append' or 'replace'
    });

    // 2) 태그 변경(추가/삭제)
    // 기존 태그 이름 집합
    const oldNames = new Set((store.state.post.tags || []).map(t => t.tagName));
    // 새 태그 이름 집합
    const newNames = new Set(selectedTags.value);

    const toAddNames = [...newNames].filter(n => !oldNames.has(n));
    const toDelNames = [...oldNames].filter(n => !newNames.has(n));

    if (toAddNames.length || toDelNames.length) {
      // 이름→id 매핑
      const nameToId = new Map(allTags.value.map(t => [t.tagName, t.tagId]));
      const addIds = toAddNames.map(n => nameToId.get(n)).filter(Boolean);
      const delIds = toDelNames.map(n => nameToId.get(n)).filter(Boolean);

      if (addIds.length) {
        await store.dispatch("post/addTags", { postId: detail.value.postId, tagIds: addIds });
      }
      if (delIds.length) {
        await store.dispatch("post/deleteTags", { postId: detail.value.postId, tagIds: delIds });
      }
      // 상세 리프레시
      await store.dispatch("post/fetchDetail", detail.value.postId);
    }

    // 3) 상세로 이동
    router.push(`/post/${detail.value.postId}`);
  } catch (e) {
    console.error(e);
    alert("수정 중 오류가 발생했습니다.");
  } finally {
    submitting.value = false;
  }
}
</script>
