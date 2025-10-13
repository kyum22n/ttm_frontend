<template>
  <div class="container-fluid py-5" style="
      background-color:#faf8f5;

      /* 브랜드 색상 세트 */
      --bs-primary:#6f5034;
      --bs-primary-rgb:111,80,52;

      /* 링크, 글자 */
      --bs-link-color:#6f5034;
      --bs-link-hover-color:#5b432c;

      /* 버튼 (btn-primary) */
      --bs-btn-bg:#6f5034;
      --bs-btn-border-color:#6f5034;
      --bs-btn-hover-bg:#5b432c;
      --bs-btn-hover-border-color:#5b432c;
      --bs-btn-active-bg:#4d3826; 
      --bs-btn-active-border-color:#4d3826; 
      --bs-btn-active-color:#fff;

      /* 탭(nav-pills) */
      --bs-nav-pills-link-active-bg:#6f5034;

      /* 페이지네이션 */
      --bs-pagination-color:#6f5034;
      --bs-pagination-hover-color:#5b432c;
      --bs-pagination-active-bg:#6f5034;
      --bs-pagination-active-border-color:#6f5034;
    ">
    <div class="container">

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
        <div v-for="dog in dogs" :key="dog.petId" class="text-center" role="button"
          @click="goToOwnerProfile(dog.userId)">
          <img :src="dog.imageUrl || 'https://placehold.co/400x250'"
            class="rounded-circle border border-4 border-primary mb-2" width="100" height="100" alt="강아지 프로필" />
          <div class="fw-semibold small">{{ dog.name }}</div>
        </div>
      </div>

      <!-- 탭/그리드 -->
      <div class="row g-4">
        <div class="col-lg-8">
          <!-- 탭 -->
          <ul class="nav nav-pills mb-3" style="
            --bs-nav-pills-link-active-bg:#6f5034;
            --bs-nav-pills-link-active-color:#fff;
            ">
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

          <!-- 페이지네이션 -->
          <nav class="mt-4" v-if="pager">
            <ul class="pagination justify-content-center" style="
              --bs-pagination-color:#6f5034;
              --bs-pagination-hover-color:#5b432c;
              --bs-pagination-active-bg:#6f5034;
              --bs-pagination-active-border-color:#6f5034;
              --bs-pagination-active-color:#fff;
              --bs-pagination-border-color:#6f5034;
              --bs-pagination-focus-box-shadow:0 0 0 .25rem rgba(111,80,52,.25);
            ">
              <!-- 처음 -->
              <li class="page-item" :class="{ disabled: pager.pageNo === 1 }">
                <button class="page-link" @click="changePage(1)" :disabled="pager.pageNo === 1">처음</button>
              </li>

              <!-- 이전 그룹 -->
              <li class="page-item" :class="{ disabled: pager.groupNo <= 1 }">
                <button class="page-link" @click="changePage(pager.startPageNo - 1)"
                  :disabled="pager.groupNo <= 1">이전</button>
              </li>

              <!-- 페이지 번호 -->
              <li v-for="pno in pager.pageArray" :key="pno" class="page-item" :class="{ active: pager.pageNo === pno }">
                <button class="page-link" @click="changePage(pno)">{{ pno }}</button>
              </li>

              <!-- 다음 그룹 -->
              <li class="page-item" :class="{ disabled: pager.groupNo >= pager.totalGroupNo }">
                <button class="page-link" @click="changePage(pager.endPageNo + 1)"
                  :disabled="pager.groupNo >= pager.totalGroupNo">다음</button>
              </li>

              <!-- 맨끝 -->
              <li class="page-item" :class="{ disabled: pager.pageNo === pager.totalPageNo }">
                <button class="page-link" @click="changePage(pager.totalPageNo)"
                  :disabled="pager.pageNo === pager.totalPageNo">맨끝</button>
              </li>
            </ul>
          </nav>


        </div>

        <!-- 사이드바 -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <strong>필터</strong>
                <button class="btn btn-sm btn-outline-secondary" @click="resetFilters">
                  초기화
                </button>
              </div>

              <div class="mb-3">
                <label class="form-label small">태그</label>
                <div class="d-flex flex-wrap gap-2">
                  <div v-for="t in tags" :key="t.tagId" class="form-check">
                    <input class="form-check-input" type="checkbox" :id="`tag-${t.tagId}`" :value="t.tagName"
                      v-model="filters.cats" @change="applyFilters" />
                    <label class="form-check-label small" :for="`tag-${t.tagId}`">
                      {{ t.tagName }}
                    </label>
                  </div>
                </div>
              </div>

              <div class="mb-2">
                <label class="form-label small">정렬</label>
                <select v-model="filters.sort" class="form-select form-select-sm">
                  <option value="latest">최신순</option>
                  <option value="likes">좋아요순</option>
                </select>
              </div>

              <router-link to="/post/create" class="btn btn-primary w-100 btn-sm mt-3" style="    
              --bs-btn-bg:#6f5034;
              --bs-btn-border-color:#6f5034;
              --bs-btn-hover-bg:#5b432c;
              --bs-btn-hover-border-color:#5b432c;
              --bs-btn-active-bg:#4d3826;
              --bs-btn-active-border-color:#4d3826;
              --bs-btn-focus-shadow-rgb:111,80,52;
              ">
                ✏️ 게시글 작성하기
              </router-link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import logoBrown from "@/assets/logo_brown.png";
import heroImage from "@/assets/heroImage_main.jpg";
import axios from "axios";
import { useRouter } from "vue-router";
import userApi from "@/apis/userApi";

const router = useRouter();
const store = useStore();

/* ========================
  강아지 프로필 목록 (랜덤 불러오기)
======================== */
const dogs = ref([]);
async function fetchRandomDogs() {
  try {
    // 랜덤 펫 불러오기
    await store.dispatch("pet/fetchRandomList", 7);
    // 스토어 상태값 가져오기
    dogs.value = store.getters["pet/getRandomList"];

  } catch (e) {
    console.log("펫 목록 불러오기 실패:", e);
  }
}

/* 클릭 시 반려인 프로필로 이동 */
function goToOwnerProfile(userId) {
  router.push(`/mypage/${userId}`);
}

/* ========================
  게시물 분류 탭 
======================== */
const tabs = [
  { key: "all", label: "전체" },
  { key: "recruit", label: "산책 모집글" }, // isRequest === 'Y'
];
const activeTab = ref("all");

/* 게시물 목록 */
const posts = ref([]);
/* 태그 목록 */
const tags = ref([]);

// 초기 로딩
onMounted(async () => {
  try {
    // 게시물 목록
    // 페이지 데이터 로드
    await fetchPosts(1);

    // 태그 필터 적용한 게시물 목록
    await store.dispatch("post/fetchTags");
    tags.value = store.getters["post/getTags"];

    // 강아지 프로필 랜덤 목록
    await fetchRandomDogs();

    // 작성자명 로드
    await loadPostAuthors();

  } catch (err) {
    console.log("초기 데이터 로딩 실패:", err);
  }
});

// 작성자명 로드
async function loadPostAuthors() {

  const jwt = localStorage.getItem("jwt");
  const authorCache = new Map(); // 중복 호출 방지 캐시

  const postsWithAuthors = await Promise.all(
    posts.value.map(async (p) => {
      // 캐시에 이미 있다면 재사용
      if (authorCache.has(p.postUserId)) {
        return {
          ...p,
          postUserName: authorCache.get(p.postUserId),
        };
      }

      try {
        const res = await userApi.userInfo(p.postUserId, jwt);
        const userData = res.data.data || res.data;
        const userName = userData.userLoginId || `User#${p.postUserId}`;
        authorCache.set(p.postUserId, userName);
        return { ...p, postUserName: userName };
      } catch (err) {
        console.log(`작성자 ${p.postUserId} 정보 불러오기 실패`, err);
        return { ...p, postUserName: "익명" };
      }
    })
  );

  posts.value = postsWithAuthors;
}


/* 탭 변경 시 목록 분기 */
watch(activeTab, async (newTab) => {
  if (newTab === "recruit") {
    try {
      const res = await axios.get("/post/groupwalk/recruitment-list");
      posts.value = (res.data.posts || []).map(p => ({
        ...p,
        thumbnailUrl: `http://localhost:8080/post/image/${p.postId}`,
      }));
    } catch (e) {
      console.log("모집글 불러오기 실패:", e);
      posts.value = [];
    }
  } else {
    await store.dispatch("post/fetchList", 1);
    posts.value = store.getters["post/getList"];
  }
});

/* ========================
  페이지네이션
  ======================== */
// 페이징
const pager = ref(null);

async function fetchPosts(pageNo = 1) {
  await store.dispatch("post/fetchList", pageNo);
  posts.value = store.getters["post/getList"];
  pager.value = store.getters["post/getPager"];
}

// 페이지 변경
function changePage(pageNo) {
  if (!pager.value) return;
  if (pageNo < 1 || pageNo > pager.value.totalPageNo) return;
  fetchPosts(pageNo);
}

/* ========================
  사이드바 필터
======================== */
/* 필터 상태 */
const filters = ref({
  cats: [], //선택된 카테고리
  sort: "latest", //최신순
});

function resetFilters() {
  filters.value.cats = [];
  filters.value.sort = "latest";
  store.dispatch("post/fetchList", 1).then(() => {
    posts.value = store.getters["post/getList"];
  });
}

async function applyFilters() {
  try {
    if (filters.value.cats.length === 0) {
      // 태그 선택 없으면 전체 게시물 다시 불러오기
      await store.dispatch("post/fetchList", 1);
      posts.value = store.getters["post/getList"];
    } else {
      // 선택된 태그들 중 마지막 태그로 필터링
      const selectedTag = filters.value.cats[filters.value.cats.length - 1];
      await store.dispatch("post/fetchListByTag", selectedTag);
      posts.value = store.getters["post/getList"];
    }
  } catch (e) {
    console.log("태그별 게시물 불러오기 실패:", e);
  }
}


const filteredPosts = computed(() => {
  // 탭/검색 필터
  const sort = filters.value.sort;
  let list = posts.value.filter((p) => {
    const isReq = (p.isRequest || "").trim();
    return (
      activeTab.value === "all" ||
      (activeTab.value === "recruit" && isReq === "Y")
    );
  });

  // 정렬
  if (sort === "likes") {
    return [...list].sort(
      (a, b) => (b.postLikeCount || 0) - (a.postLikeCount || 0)
    );
  } else {
    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
});


/* ========================
날짜 포맷
======================== */
function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR");
}
</script>
