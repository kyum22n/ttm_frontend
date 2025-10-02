<template>
  <div class="container py-4">
    <!-- 히어로 -->
    <section class="row align-items-center g-4 mb-5">
      <div class="col-lg-5">
        <div class="text-center text-lg-start">
          <img :src="logoBrown" alt="로고" class="img-fluid mb-3" style="max-width:260px;" />
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

      <!-- 오른쪽: 히어로 이미지 -->
      <div class="col-lg-7">
        <img :src="heroImage" alt="히어로" class="img-fluid rounded-4 shadow w-100" />
      </div>
    </section>

    <!-- 강아지 프로필 리스트 -->
    <div class="d-flex justify-content-center gap-4 flex-wrap mb-5">
      <div v-for="(dog, i) in dogs" :key="i" class="text-center">
        <img :src="dog.img" class="rounded-circle border border-4 border-primary mb-2" width="100" height="100"
          alt="강아지 프로필" />
        <div class="fw-semibold small">{{ dog.name }}</div>
      </div>
    </div>

    <!-- 탭/그리드 -->
    <div class="row g-4">
      <div class="col-lg-8">
        <!-- 탭 -->
        <ul class="nav nav-pills mb-3">
          <li v-for="t in tabs" :key="t.key" class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === t.key }" @click="activeTab = t.key">
              {{ t.label }}
            </button>
          </li>
        </ul>

        <!-- 게시물 그리드 -->
        <div class="row g-3">
          <div v-for="post in filteredPosts" :key="post.postId" class="col-md-6">
            <div class="card h-100 border-0 shadow-sm position-relative">
              <div class="ratio ratio-4x3">
                <img :src="post.thumbnailUrl || 'https://placehold.co/400x250'" class="card-img-top" alt="게시물 이미지" />
              </div>
              <div class="card-body">
                <div class="small text-muted mb-1">{{ post.postUserName || '익명' }}</div>
                <h6 class="card-title mb-1">{{ post.postTitle }}</h6>
                <p class="card-text text-muted small mb-0">{{ post.postContent }}</p>
              </div>
              <div class="card-footer bg-white d-flex justify-content-between align-items-center">
                <span class="small text-muted">{{ formatDate(post.createdAt) }}</span>
                <button class="btn btn-sm btn-outline-secondary">
                  ♡ {{ post.postLikeCount }}
                </button>
              </div>
              <!-- 카드 전체 클릭 → 상세 -->
              <router-link :to="`/post/${post.postId}`" class="stretched-link">
                <span class="visually-hidden">상세보기로 이동</span>
              </router-link>
            </div>
          </div>
        </div>
        <!--
        <nav class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: pager.pageNo === 1 }">
              <button class="page-link" @click="changePage(1)">처음</button>
            </li>

            <li class="page-item" :class="{ disabled: pager.groupNo <= 1 }">
              <button class="page-link" @click="changePage(pager.startPageNo - 1)">이전</button>
            </li>

            <li v-for="page in pager.pageArray" :key="page" class="page-item"
              :class="{ active: pager.pageNo === page }">
              <button class="page-link" @click="changePage(page)">{{ page }}</button>
            </li>

            <li class="page-item" :class="{ disabled: pager.groupNo >= pager.totalGroupNo }">
              <button class="page-link" @click="changePage(pager.endPageNo + 1)">다음</button>
            </li>

            <li class="page-item" :class="{ disabled: pager.pageNo === pager.totalPageNo }">
              <button class="page-link" @click="changePage(pager.totalPageNo)">맨끝</button>
            </li>
          </ul>
        </nav>
        -->

      </div>

      <!-- 오른쪽 필터 -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <button class="btn w-100 btn-outline-dark mb-3" @click="$router.push({ path: '/post/create' })">
              <i class="bi bi-pencil"></i> 글쓰기
            </button>
            <input type="text" v-model="filters.q" class="form-control mb-2" placeholder="검색어 입력" />
            <button class="btn btn-dark w-100 mt-3" @click="applyFilters">적용</button>
            <button class="btn btn-outline-secondary w-100 mt-2" @click="resetFilters">초기화</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import logoBrown from "@/assets/logo_brown.png";
import heroImage from "@/assets/heroImage_main.jpg";


const store = useStore();

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
  { key: "recruit", label: "산책 모집글" }, // isRequest === 'Y'
];
const activeTab = ref("all");

/* 필터 상태 */
const filters = reactive({
  q: "",
});

/* 게시물 목록 불러오기 */
onMounted(() => {
  store.dispatch("post/fetchList", 1);
});

const posts = computed(() => store.getters["post/getList"]);

/* 탭/검색 필터링 */
const filteredPosts = computed(() => {
  return posts.value.filter((p) => {
    // console.log(posts.value.map(p => p.isRequest));

    const isReq = (p.isRequest || "").trim();
    const matchTab =
      activeTab.value === "all" || (activeTab.value === "recruit" && isReq === "Y");
    const matchQ =
      filters.q === "" ||
      (p.postTitle && p.postTitle.includes(filters.q)) ||
      (p.postContent && p.postContent.includes(filters.q));
    return matchTab && matchQ;
  });
});

// 페이징
const pager = computed(() => store.getters["post/getPager"]);

// 페이지 번호 배열
const pageNum = computed(() => {
  if (!pager.value) return [];
  const start = pager.value.startPage || 1;
  const end = pager.value.endPage || pager.value.totalPage || 1;
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
});

// 페이지 변경
function changePage(pageNo) {
  if (!pager.value) return;
  if (pageNo < 1 || pageNo > pager.value.totalPage) return;
  store.dispatch("post/fetchList", pageNo);
}


function applyFilters() {
  console.log("적용:", filters);
}
function resetFilters() {
  filters.q = "";
}
function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR");
}
</script>
