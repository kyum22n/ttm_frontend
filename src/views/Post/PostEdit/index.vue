<template>
  <div class="container my-5">
    <div class="row">
      <!-- ===== 왼쪽: 대표 이미지 미리보기 ===== -->
      <div class="col-md-4">
        <div class="card mb-3 shadow-sm">
          <img v-if="previewImage" :src="previewImage" class="card-img-top" alt="대표 미리보기" />
          <div v-else class="card-body text-muted text-center">
            이미지 미리보기
          </div>
        </div>
      </div>

      <!-- ===== 중앙: 글 수정 ===== -->
      <div class="col-md-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">게시글 수정</h5>
            <textarea
              v-model="content"
              rows="6"
              class="form-control mb-3"
              placeholder="내용을 입력하세요"
            ></textarea>

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
                  v-for="(tag, i) in availableTags.slice(0, 5)"
                  :key="i"
                  class="btn btn-sm"
                  :class="selectedTags.includes(tag) ? 'btn-secondary' : 'btn-outline-primary'"
                  @click="toggleTag(tag)"
                >
                  {{ tag }}
                </button>
              </div>

              <!-- collapse 안에 숨겨진 태그 -->
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

          <div class="card-footer d-flex justify-content-end gap-2">
            <button class="btn btn-success" @click="updatePost">수정 저장</button>
          </div>
        </div>
      </div>

      <!-- ===== 오른쪽: 첨부 이미지 영역 ===== -->
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
              @change="onFileChange"
            />
          </label>
          <div class="small text-muted mt-2">이미지 추가 (최대 10장)</div>
        </div>

        <!-- 썸네일 리스트 -->
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
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

/**
 * 1) 기존 게시글(원본) 데이터 — 실제에선 API로 받아오면 됨
 */
const originalPost = ref({
  content:
    "퇴근길에 우리 로키 친구 만남\n댓글 예쁘게 달아라 (원본 내용입니다)",
  tags: ["#고양이", "#일상", "#산책"],
  images: [
    "https://placekitten.com/400/250",
    "https://placekitten.com/401/250",
    "https://placekitten.com/402/250",
  ],
});

/**
 * 2) 수정용 상태 (폼에 바인딩)
 */
const content = ref(originalPost.value.content);
const selectedTags = ref([...originalPost.value.tags]);
const previewImages = ref([...originalPost.value.images]);
const previewImage = ref(previewImages.value[0] || null);

/**
 * 태그 소스 (선택형)
 */
const availableTags = ref([
  "#강아지",
  "#고양이",
  "#산책",
  "#귀여움",
  "#추억",
  "#일상",
  "#댕댕이",
  "#냥스타",
  "#훈련",
  "#여행",
  "#캠핑",
  "#간식",
]);

const showMore = ref(false);
function toggleMore() {
  showMore.value = !showMore.value;
}

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

/**
 * 이미지 업로드 — 기존 썸네일에 추가로 “쌓임”
 */
function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (previewImages.value.length >= 10) {
    alert("이미지는 최대 10장까지 업로드할 수 있습니다.");
    e.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    previewImages.value.push(event.target.result);
    if (!previewImage.value) previewImage.value = event.target.result;
  };
  reader.readAsDataURL(file);

  e.target.value = "";
}

/**
 * 썸네일 삭제/대표 지정
 */
function removeImage(idx) {
  const removed = previewImages.value.splice(idx, 1)[0];
  if (previewImage.value === removed) {
    previewImage.value = previewImages.value[0] || null;
  }
}
function setAsMain(idx) {
  previewImage.value = previewImages.value[idx] || null;
}


/**
 * 수정 저장(업데이트)
 */
function updatePost() {
  // 실제론 API 호출 (PUT/PATCH)로 바꿔서 보내면 됨
  const payload = {
    content: content.value,
    tags: selectedTags.value,
    images: previewImages.value,
    mainImage: previewImage.value,
  };
  console.log("수정 요청 payload:", payload);
  alert("수정이 저장되었습니다!");
}
</script>
