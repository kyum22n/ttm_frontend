<template>
  <div class="container-fluid py-5" style="
      background-color:#faf8f5;

      /* 브랜드 색상 세트 */
      --bs-primary:#6f5034;
      --bs-primary-rgb:111,80,52;

      /* 링크, 글자 */
      --bs-link-color:#6f5034;
      --bs-link-hover-color:#5b432c;

      /* 버튼 */
      --bs-btn-bg:#6f5034;
      --bs-btn-border-color:#6f5034;
      --bs-btn-hover-bg:#5b432c;
      --bs-btn-hover-border-color:#5b432c;
      --bs-btn-active-bg:#4d3826;
      --bs-btn-active-border-color:#4d3826;
      --bs-btn-active-color:#fff;
      --bs-btn-focus-shadow-rgb:111,80,52;

      /* 페이지네이션/뱃지 공용 */
      --bs-pagination-color:#6f5034;
      --bs-pagination-hover-color:#5b432c;
      --bs-pagination-active-bg:#6f5034;
      --bs-pagination-active-border-color:#6f5034;
      --bs-pagination-focus-box-shadow:0 0 0 .25rem rgba(111,80,52,.25);
    ">

    <div class="container my-5" v-if="loaded">
      <div class="row">
        <!-- ===== 왼쪽: 대표 이미지 미리보기 (신규 첨부 중 첫 장) ===== -->
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

              <input v-model="title" type="text" class="form-control mb-2" placeholder="제목을 입력하세요" />

              <textarea v-model="content" rows="6" class="form-control mb-3" placeholder="내용을 입력하세요"></textarea>

              <div class="form-check mb-3">
                <input id="isRequest" class="form-check-input" type="checkbox" v-model="isRequest" />
                <label class="form-check-label" for="isRequest">산책 모집글</label>
              </div>

              <!-- 선택된 태그 표시 -->
              <div class="mb-3">
                <span v-for="(tag, idx) in selectedTags" :key="idx" class="badge bg-primary me-2" role="button"
                  @click="removeTag(tag)">
                  {{ tag }} ✕
                </span>
              </div>

              <!-- 태그 선택 영역 -->
              <div>
                <h6 class="fw-bold">태그 선택</h6>

                <!-- 항상 보이는 기본 태그 -->
                <div class="d-flex flex-wrap gap-2 mb-2">
                  <button v-for="(t, i) in topTags" :key="`top-${i}`" class="btn btn-sm"
                    :class="selectedTags.includes(t.tagName) ? 'btn-secondary' : 'btn-outline-primary'"
                    @click="toggleTag(t.tagName)">
                    {{ t.tagName }}
                  </button>
                </div>

                <!-- collapse 안에 숨겨진 태그 -->
                <div class="collapse" id="moreTags">
                  <div class="d-flex flex-wrap gap-2 mt-2">
                    <button v-for="(t, i) in moreTags" :key="`more-${i}`" class="btn btn-sm"
                      :class="selectedTags.includes(t.tagName) ? 'btn-secondary' : 'btn-outline-primary'"
                      @click="toggleTag(t.tagName)">
                      {{ t.tagName }}
                    </button>
                  </div>
                </div>

                <!-- 더보기/접기 버튼 -->
                <button class="btn btn-link p-0 mt-2" type="button" data-bs-toggle="collapse" data-bs-target="#moreTags"
                  aria-expanded="false" aria-controls="moreTags" @click="toggleMore">
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

              <button class="btn btn-primary" :disabled="submitting" @click="updatePost" style="
                  --bs-btn-bg:#6f5034;
                  --bs-btn-border-color:#6f5034;
                  --bs-btn-hover-bg:#5b432c;
                  --bs-btn-hover-border-color:#5b432c;
                  --bs-btn-active-bg:#4d3826;
                  --bs-btn-active-border-color:#4d3826;
                  --bs-btn-focus-shadow-rgb:111,80,52;
                "
              >  
                {{ submitting ? "저장 중..." : "수정 저장" }}
              </button>
            </div>
          </div>
        </div>

        <!-- ===== 오른쪽: 기존/신규 첨부 이미지 ===== -->
        <div class="col-md-3">
          <h6 class="fw-bold mb-2">기존 이미지</h6>

          <!-- 기존 이미지 리스트: 유지/삭제 토글 -->
          <div class="mb-3">
            <div v-for="img in existingImages" :key="img.id" class="card mb-2">
              <img :src="absoluteUrl(img.url)" class="card-img-top img-fluid" :alt="`기존 이미지 ${img.id}`" />
            </div>

            <div v-if="!existingImages.length" class="text-muted small">
              기존 이미지가 없습니다.
            </div>
          </div>

          <hr>

          <h6 class="fw-bold mb-2">신규 첨부 이미지</h6>

          <!-- 파일 업로드 버튼 -->
          <div class="mb-3 text-center">
            <label class="btn btn-dark">
              <i class="bi bi-folder-plus"></i> 이미지 추가
              <input type="file" class="d-none" accept="image/*" multiple @change="onFileChange" />
            </label>
            <div class="small text-muted mt-2">최대 10장까지 추가할 수 있습니다.</div>
            <div class="small text-muted">※ 기존 이미지를 삭제하려면, <b>유지</b> 스위치를 끄세요. 저장 시 자동으로 교체 모드로 업로드됩니다.</div>
          </div>

          <!-- 신규 썸네일 리스트 -->
          <div class="d-flex flex-column gap-2">
            <div v-for="(img, idx) in previewImages" :key="idx" class="card">
              <img :src="img" class="card-img-top img-fluid" :alt="`신규 이미지 ${idx + 1}`" role="button"
                @click="setAsMain(idx)" />
              <div class="card-body d-flex justify-content-between align-items-center">
                <span class="badge bg-success" v-if="previewImage === img">대표</span>
                <button type="button" class="btn btn-sm btn-danger" @click="removeImage(idx)">
                  삭제
                </button>
              </div>
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

// 기존/신규 이미지
const existingImages = ref([]);  // [{ id, url, keep: true }]
const files = ref([]);           // 신규 File[]
const previewImages = ref([]);   // 신규 base64[]
const previewImage = ref(null);  // 신규 대표(첫 이미지)
const imageMode = ref("append"); // 'append' | 'replace'

// 기존 상세
const detail = computed(() => store.state.post.detail);

// util: 절대 URL 만들기 (미리보기/재업로드용)
function absoluteUrl(url) {
  return url.startsWith("http") ? url : `http://localhost:8080${url}`;
}
function parseImageId(url) {
  try {
    const u = new URL(absoluteUrl(url));
    return Number(u.searchParams.get("postImageId"));
  } catch {
    return null;
  }
}

// 초기 로딩
onMounted(async () => {
  const postId = route.params.id;
  if (!postId) return;

  // 1) 상세 불러오기
  await store.dispatch("post/fetchDetail", postId);

  // 2) 전체 태그 목록(이름→id 매핑용)
  const tagRes = await postApi.getTagList();
  allTags.value = (tagRes.data && tagRes.data.tags) ? tagRes.data.tags : [];

  // 3) 폼 채우기 + 기존 이미지 세팅
  if (detail.value) {
    title.value = detail.value.postTitle || "";
    content.value = detail.value.postContent || "";
    isRequest.value = (String(detail.value.isRequest || "N").toUpperCase() === "Y");

    const currentTags = (store.state.post.tags || []).map(t => t.tagName);
    selectedTags.value = currentTags;

    const urls = (detail.value.images || []);
    existingImages.value = urls.map(u => ({
      id: parseImageId(u),
      url: u,
      keep: true
    }));
  }

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

// 파일 추가 (신규)
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

// 신규 썸네일 삭제/대표 지정
function removeImage(idx) {
  const removed = previewImages.value.splice(idx, 1)[0];
  files.value.splice(idx, 1);
  if (previewImage.value === removed) {
    previewImage.value = previewImages.value[0] || null;
  }
}
function setAsMain(idx) {
  // 신규 파일 업로드 순서를 바꾸기 위해 files도 재정렬
  if (idx < 0 || idx >= files.value.length) return;
  const pickedFile = files.value.splice(idx, 1)[0];
  files.value.unshift(pickedFile);

  const pickedPreview = previewImages.value.splice(idx, 1)[0];
  previewImages.value.unshift(pickedPreview);
  previewImage.value = pickedPreview;
}

// 저장
async function updatePost() {
  if (!detail.value) return;

  submitting.value = true;
  try {
    const fd = new FormData();
    fd.append("postId", String(detail.value.postId));
    if (title.value) fd.append("postTitle", title.value);
    if (content.value) fd.append("postContent", content.value);
    fd.append("isRequest", isRequest.value ? "Y" : "N");

    // 삭제가 하나라도 있으면 강제로 replace 모드 사용 (삭제 반영)
    const hasDeletion = existingImages.value.some(img => img.keep === false);
    let modeToUse = imageMode.value;
    if (hasDeletion) modeToUse = "replace";

    // 업로드할 파일 목록 구성
    const filesToUpload = [];

    if (modeToUse === "replace") {
      // 1) 유지할 기존 이미지를 blob으로 다시 첨부
      for (const img of existingImages.value) {
        if (!img.keep) continue;
        const url = absoluteUrl(img.url);
        try {
          const res = await fetch(url, { credentials: "include" });
          const blob = await res.blob();
          // 파일명은 임의로 구성
          const name = `old-${img.id || "img"}`;
          const file = new File([blob], name, { type: blob.type || "application/octet-stream" });
          filesToUpload.push(file);
        } catch (err) {
          // 개별 실패는 건너뜀 (최소한 저장이 막히지 않도록)
          console.error("기존 이미지 재첨부 실패:", url, err);
        }
      }
      // 2) 신규 파일 이어붙이기
      filesToUpload.push(...files.value);
    } else {
      // append: 신규 파일만
      filesToUpload.push(...files.value);
    }

    // FormData에 순서대로 추가 (대표를 맨 앞에 두고 싶으면 위에서 files 재정렬됨)
    for (const f of filesToUpload) {
      fd.append("postAttaches", f);
    }

    // 게시물/이미지 업데이트
    await store.dispatch("post/update", {
      formData: fd,
      imageMode: modeToUse, // 'append' or 'replace'
    });

    // 태그 변경(추가/삭제)
    const oldNames = new Set((store.state.post.tags || []).map(t => t.tagName));
    const newNames = new Set(selectedTags.value);
    const toAddNames = [...newNames].filter(n => !oldNames.has(n));
    const toDelNames = [...oldNames].filter(n => !newNames.has(n));

    if (toAddNames.length || toDelNames.length) {
      const nameToId = new Map(allTags.value.map(t => [t.tagName, t.tagId]));
      const addIds = toAddNames.map(n => nameToId.get(n)).filter(Boolean);
      const delIds = toDelNames.map(n => nameToId.get(n)).filter(Boolean);

      if (addIds.length) {
        await store.dispatch("post/addTags", { postId: detail.value.postId, tagIds: addIds });
      }
      if (delIds.length) {
        await store.dispatch("post/deleteTags", { postId: detail.value.postId, tagIds: delIds });
      }
      await store.dispatch("post/fetchDetail", detail.value.postId);
    }

    // 상세로 이동
    router.push(`/post/${detail.value.postId}`);
  } catch (e) {
    console.error("업데이트 실패:", e);
    // alert 금지: 버튼 텍스트/상태로만 피드백
  } finally {
    submitting.value = false;
  }
}
</script>
