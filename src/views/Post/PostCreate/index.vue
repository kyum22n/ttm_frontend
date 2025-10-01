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


      <!-- ===== 중앙: 글 작성 ===== -->
      <div class="col-md-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">게시글 작성</h5>
            <textarea v-model="content" rows="6" class="form-control mb-3" placeholder="내용을 입력하세요"></textarea>

            <!-- 선택된 태그 표시 -->
            <div class="mb-3">
              <span v-for="(tag, idx) in selectedTags" :key="idx" class="badge bg-primary me-2" @click="removeTag(tag)"
                style="cursor:pointer">
                {{ tag }} ✕
              </span>
            </div>

            <!-- 태그 선택 영역 -->
            <div>
              <h6 class="fw-bold">태그 선택</h6>

              <!-- 항상 보이는 기본 태그 -->
              <div class="d-flex flex-wrap gap-2 mb-2">
                <button v-for="(tag, i) in availableTags.slice(0, 5)" :key="i" class="btn btn-sm"
                  :class="selectedTags.includes(tag) ? 'btn-secondary' : 'btn-outline-primary'" @click="toggleTag(tag)">
                  {{ tag }}
                </button>
              </div>

              <!-- collapse 안에 숨겨진 태그 -->
              <div class="collapse" id="moreTags">
                <div class="d-flex flex-wrap gap-2 mt-2">
                  <button v-for="(tag, i) in availableTags.slice(5)" :key="'more-' + i" class="btn btn-sm"
                    :class="selectedTags.includes(tag) ? 'btn-secondary' : 'btn-outline-primary'"
                    @click="toggleTag(tag)">
                    {{ tag }}
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
          <div class="card-footer text-end">
            <button class="btn btn-success" @click="submitPost">게시</button>
          </div>
        </div>
      </div>

      <!-- ===== 오른쪽: 첨부 이미지 영역 ===== -->
      <div class="col-md-3">
        <h6 class="fw-bold mb-3">첨부 이미지</h6>

        <!-- 파일 업로드 버튼 -->
        <div class="mb-3 text-center">
          <label class="d-inline-flex align-items-center justify-content-center bg-dark text-white rounded p-3"
            style="cursor:pointer; width:80px; height:80px;">
            <i class="bi bi-folder-plus fs-3"></i>
            <input type="file" class="d-none" accept="image/*" @change="onFileChange" />
          </label>
        </div>

        <!-- 썸네일 리스트 (최대 10장) -->
        <div class="d-flex flex-column gap-2">
          <div v-for="(img, idx) in previewImages" :key="idx" class="position-relative">
            <img :src="img" class="img-thumbnail w-100" style="max-height:120px; object-fit:cover;" />
            <!-- 삭제 버튼 -->
            <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
              @click="removeImage(idx)">
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

// 글 작성 내용
const content = ref("");

// 태그 선택 로직
const availableTags = ref([
  "#강아지", "#고양이", "#산책", "#귀여움", "#추억",
  "#일상", "#댕댕이", "#냥스타", "#훈련", "#여행", "#캠핑", "#간식"
]);
const selectedTags = ref([]);
const showMore = ref(false); // 더보기 상태

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
const previewImages = ref([]);
const previewImage = ref(null); // 대표 이미지(왼쪽 큰 프리뷰 용)

function onFileChange(e) {
  const file = e.target.files[0]; // 여러 개 선택해도 첫 번째만
  if (!file) return;

  if (previewImages.value.length >= 10) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    previewImages.value.push(event.target.result);

    // 대표 이미지가 아직 없으면 첫 번째 걸로 지정
    if (!previewImage.value) {
      previewImage.value = event.target.result;
    }
  };
  reader.readAsDataURL(file);

  // 같은 파일 다시 선택 가능하게 input 초기화
  e.target.value = "";
}

function removeImage(idx) {
  previewImages.value.splice(idx, 1);
  previewImage.value = previewImages.value[0] || null;
}

// 게시하기
function submitPost() {
  console.log("내용:", content.value);
  console.log("태그:", selectedTags.value);
  console.log("이미지:", previewImages.value);
  alert("게시물이 등록되었습니다!");
}


</script>
