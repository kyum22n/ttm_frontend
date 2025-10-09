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
      <div v-for="(dog, i) in dogs" :key="i" class="text-center" role="button" @click="goToOwnerProfile(dog.userId)">
        <img :src="dog.img" @error="e => e.target.src = '/default_dog.png'"
          class="rounded-circle border border-4 border-primary mb-2" width="100" height="100" alt="강아지 프로필" />

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

        <!-- 페이지네이션 -->
        <nav class="mt-4" v-if="pager">
          <ul class="pagination justify-content-center">
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

            <button class="btn btn-dark w-100 btn-sm mt-2" @click="applyFilters">
              적용
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch } from "vue";
import { useStore } from "vuex";
import logoBrown from "@/assets/logo_brown.png";
import heroImage from "@/assets/heroImage_main.jpg";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();

/* ========================
  강아지 프로필 목록 (랜덤 불러오기)
======================== */
const dogs = ref([]);
async function fetchRandomDogs() {
  try {
    const res = await axios.get("/api/pet/random-list?limit=7");
    dogs.value = res.data.pets.map(pet => ({
      petId: pet.petId,
      name: pet.petName,
      img: `/api/pet/image/${pet.petId}`,
      userId: pet.petUserId,
    }));
  } catch (e) {
    console.error("🐶 펫 목록 불러오기 실패:", e);
  }
}

/* 클릭 시 반려인 프로필로 이동 */
function goToOwnerProfile(userId) {
  router.push(`/profile/${userId}`);
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

onMounted(async () => {
  // 게시물 목록(기본)
  await store.dispatch("post/fetchList", 1);
  posts.value = store.getters["post/getList"];

  // 태그 필터 적용한 게시물 목록
  await store.dispatch("post/fetchTags");
  tags.value = store.getters["post/getTags"];

  // 강아지 프로필 랜덤 목록
  fetchRandomDogs();
});

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
      console.error("🚫 모집글 불러오기 실패:", e);
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
const pager = computed(() => store.getters["post/getPager"]);

// 페이지 변경
function changePage(pageNo) {
  if (!pager.value) return;
  if (pageNo < 1 || pageNo > pager.value.totalPageNo) return;
  store.dispatch("post/fetchList", pageNo);
}

/* ========================
  사이드바 필터
======================== */
/* 필터 상태 */
const filters = reactive({
  q: "",
  cats: [], //선택된 카테고리
  sort: "latest", //최신순
});

function resetFilters() {
  filters.q = "";
  filters.cats = [];
  filters.sort = "latest";
  store.dispatch("post/fetchList", 1).then(() => {
    posts.value = store.getters["post/getList"];
  });
}

async function applyFilters() {
  try {
    if (filters.cats.length === 0) {
      // 태그 선택 없으면 전체 게시물 다시 불러오기
      await store.dispatch("post/fetchList", 1);
      posts.value = store.getters["post/getList"];
    } else {
      // 선택된 태그들 중 마지막 태그로 필터링
      const selectedTag = filters.cats[filters.cats.length - 1];
      await store.dispatch("post/fetchListByTag", selectedTag);
      posts.value = store.getters["post/getList"];
    }
  } catch (e) {
    console.error("태그별 게시물 불러오기 실패:", e);
  }
}


const filteredPosts = computed(() => {
  let list = posts.value.filter((p) => {
    const isReq = (p.isRequest || "").trim();
    const matchTab =
      activeTab.value === "all" ||
      (activeTab.value === "recruit" && isReq === "Y");

    const matchQ =
      filters.q === "" ||
      (p.postTitle && p.postTitle.includes(filters.q)) ||
      (p.postContent && p.postContent.includes(filters.q));

    // 카테고리 필터 (선택된 cats 중 하나라도 포함되면 통과)
    const matchCat =
      filters.cats.length === 0 ||
      filters.cats.some((cat) => (p.postCategory || "").includes(cat));

    return matchTab && matchQ && matchCat;
  });

  // 정렬
  if (filters.sort === "likes") {
    list.sort((a, b) => (b.postLikeCount || 0) - (a.postLikeCount || 0));
  } else if (filters.sort === "latest") {
    list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return list;
});


/* ========================
날짜 포맷
======================== */
function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR");
}
</script>
