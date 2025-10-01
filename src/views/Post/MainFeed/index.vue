<template>
  <div class="container py-4">
    <!-- 히어로 -->
    <section class="row align-items-center g-4 mb-5">
      <!-- 왼쪽: 로고 & 카피 & CTA -->
      <div class="col-lg-5">
        <div class="text-center text-lg-start">
          <img :src="logoBrown" alt="로고" class="img-fluid mb-3" style="max-width:260px;" />

          <!-- 로고보다 살짝 오른쪽으로 들여쓰기 -->
          <div class="ms-lg-4">
            <div class="fw-bold fs-5">믿을 수 있는 이웃과 함께하는 교류</div>
            <p class="text-muted small mb-3">
              우리 아이와 어울릴 친구, 나와 산책할 이웃을 쉽게 만나는 공간.<br class="d-none d-lg-block" />
              반려인들의 따뜻한 동네 커뮤니티가 열립니다.
            </p>

            <div class="d-flex gap-2 justify-content-center justify-content-lg-start">
              <button type="button" class="btn btn-outline-secondary">시작하기 🐾</button>
              <button type="button" class="btn btn-light border">더 알아보기</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽: 고정 히어로 이미지 한 장 -->
      <div class="col-lg-7">
        <img :src="heroImage" alt="히어로" class="img-fluid rounded-4 shadow w-100" />
      </div>
    </section>

    <!-- 강아지 프로필 리스트 -->
    <div class="d-flex justify-content-center gap-4 flex-wrap mb-5">
      <div v-for="(dog, i) in dogs" :key="i" class="text-center">
        <img
          :src="dog.img"
          class="rounded-circle border border-4 border-primary mb-2"
          width="100"
          height="100"
          alt="강아지 프로필"
        />
        <div class="fw-semibold small">{{ dog.name }}</div>
      </div>
    </div>

    <!-- 탭/그리드/사이드필터 -->
    <div class="row g-4">
      <div class="col-lg-8">
        <ul class="nav nav-pills mb-3">
          <li v-for="t in tabs" :key="t.key" class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === t.key }" @click="activeTab = t.key">
              {{ t.label }}
            </button>
          </li>
        </ul>

        <div class="row g-3">
          <div v-for="(post, i) in filteredPosts" :key="i" class="col-md-6">
            <!-- position-relative 는 stretched-link 필수 -->
            <div class="card h-100 border-0 shadow-sm position-relative">
              <div class="ratio ratio-4x3">
                <img :src="post.img" class="card-img-top" alt="" />
              </div>

              <div class="card-body">
                <div class="small text-muted mb-1">{{ post.subtitle }}</div>
                <h6 class="card-title mb-1">{{ post.title }}</h6>
                <p class="card-text text-muted small mb-0">{{ post.desc }}</p>
              </div>

              <div class="card-footer bg-white d-flex justify-content-between align-items-center">
                <span class="small text-muted">{{ post.time }}</span>
                <!-- 좋아요 버튼은 링크 클릭 막기 -->
                <button class="btn btn-sm btn-outline-secondary" @click.stop="toggleLike(post)">
                  ♡ {{ post.likes }}
                </button>
              </div>

              <!-- 카드 전체 클릭 → 상세로 이동 (임시 id: i) -->
              <router-link
                :to="{ name: 'PostDetail', params: { id: String(i) } }"
                class="stretched-link"
              >
                <span class="visually-hidden">상세보기로 이동</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽 필터(요약) -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <button class="btn w-100 btn-outline-dark mb-3">
              <i class="bi bi-pencil"></i> 글쓰기
            </button>
            <!-- 검색/필터 컨트롤들… 필요 시 이전 코드 재사용 -->
            <button class="btn btn-dark w-100 mt-3">적용</button>
            <button class="btn btn-outline-secondary w-100 mt-2">초기화</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive } from "vue";
import logoBrown from "@/assets/logo_brown.png";
import heroImage from "@/assets/heroImage_main.jpg";

/* 강아지 프로필 썸네일 */
const dogs = ref([
  { name: "TwoTwo", img: "https://place-puppy.com/100x100" },
  { name: "Husky", img: "https://place-puppy.com/101x100" },
  { name: "Pomeranian", img: "https://place-puppy.com/102x100" },
  { name: "Retriever", img: "https://place-puppy.com/103x100" },
]);

/* 탭 */
const tabs = [
  { key: "all", label: "전체" },
  { key: "recruit", label: "산책 모집글" }, // 실제론 isRecruit로 필터 권장
];
const activeTab = ref("all");

/* 필터 상태(요약) */
const filters = reactive({
  q: "",
  cats: [],
  locs: [],
});

/* 피드 데이터 (데모) */
const posts = ref([
  {
    id: 1,
    title: "냥생이란",
    img: "https://placekitten.com/400/250",
    desc: "오늘 하루도 평화로움",
    tags: ["#고양이"],
    author: "관리자",
    likes: 718,
    type: "cat",
    time: "1시간 전",
    subtitle: "관리자",
  },
  {
    id: 2,
    title: "오늘도 나와 함께",
    img: "https://place-puppy.com/400x250",
    desc: "우리집 댕댕이랑",
    tags: ["#강아지"],
    author: "사용자1",
    likes: 512,
    type: "dog",
    time: "2시간 전",
    subtitle: "사용자1",
  },
]);

/* 탭/검색 필터링 (탭은 예시, 실제로는 isRecruit 등으로 교체 권장) */
const filteredPosts = computed(() => {
  return posts.value.filter(
    (p) =>
      (activeTab.value === "all" || p.type === activeTab.value) &&
      (filters.q === "" || p.title.includes(filters.q) || p.desc.includes(filters.q))
  );
});

/* 좋아요 토글(데모) */
function toggleLike(post) {
  post.likes += 1;
}

function applyFilters() {
  console.log("적용:", filters);
}
</script>
