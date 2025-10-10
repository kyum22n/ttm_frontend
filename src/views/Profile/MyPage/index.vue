<template>
  <div class="container py-4">
    <!-- 프로필 헤더 -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row align-items-center g-3">
          <div class="col-auto">
            <!-- profileImgUrl이 존재하면 표시 -->
            <img
              v-if="profileImgUrl"
              :src="profileImgUrl"
              alt="프로필"
              class="rounded-circle object-cover"
              width="88"
              height="88"
            />
          </div>

          <div class="col">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <h5 class="mb-0">
                ID: {{ profileUser?.userLoginId || "불러오는 중..." }}
              </h5>

              <span class="text-muted small">·</span>
              <RouterLink to="/Profile/EditProfile">
                <button class="btn btn-sm btn-outline-secondary">설정</button>
              </RouterLink>
            </div>

            <ul class="list-inline text-muted small mb-2 mt-2">
              <li
                class="list-inline-item"
                v-for="(s, i) in profile.stats"
                :key="i"
              >
                <span class="me-1">{{ s.label }}</span
                ><strong class="text-dark">{{ s.value }}</strong>
              </li>
            </ul>

            <div class="row g-3">
              <div class="col-lg-8">
                <div class="p-3 bg-light rounded">
                  <p class="mb-0 small">{{ profile.bio }}</p>
                </div>
              </div>
              <div class="col-lg-2 text-lg-end">
                <button class="btn btn-primary">산책신청+</button>
              </div>
              <div class="col-lg-2">
                <button class="btn btn-primary">메세지 목록</button>
              </div>

              <div>
                <!-- 프로필 내용들 ... -->
                <ChatRequestButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하이라이트 펫 썸네일 -->
    <div class="d-flex align-items-center gap-4 mb-4 flex-wrap">
      <button
        class="btn btn-outline-secondary btn-sm"
        @click="router.push('/Register/AddPet')"
      >
        Add Pets
      </button>

      <!-- 유저의 모든 펫 썸네일 렌더링 -->
      <div
        v-for="pet in petList"
        :key="pet.petId"
        class="text-center"
        @click="openPetModal(pet)"
        style="cursor: pointer"
      >
        <div class="story-ring mx-auto mb-1">
          <img
            :src="getPetImageUrl(pet)"
            alt="pet thumbnail"
            class="rounded-circle object-cover"
            width="64"
            height="64"
          />
        </div>
        <div class="small text-muted">{{ pet.petName }}</div>
      </div>
    </div>

    <!-- 모달 컴포넌트 -->
    <PetProfileModal
      :pet="selectedPet"
      :show="showModal"
      :currentUserId="currentUserId"
      @update:show="showModal = $event"
      @edit="handleEdit"
      @chat="handleChat"
    />

    <!-- 콘텐츠 + 사이드바 -->
    <div class="row g-4">
      <div class="col-lg-8">
        <!-- 필터 탭 -->
        <ul class="nav nav-pills mb-3">
          <li v-for="t in tabs" :key="t.key" class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === t.key }"
              @click="activeTab = t.key"
            >
              {{ t.label }}
            </button>
          </li>
        </ul>
        <section class="mt-5">
          <h5 class="fw-bold mb-3">내 게시물</h5>

          <div v-if="loadingMyPosts" class="text-center text-muted py-5">
            불러오는 중...
          </div>

          <div
            v-else-if="myPosts.length === 0"
            class="text-center text-muted py-5"
          >
            아직 작성한 게시물이 없습니다.
          </div>

          <div v-else class="row g-3">
            <div
              v-for="post in myPosts"
              :key="post.postId"
              class="col-md-6 col-lg-4"
            >
              <div class="card h-100 border-0 shadow-sm">
                <div class="ratio ratio-4x3">
                  <img
                    :src="post.thumbnailUrl || '/default_post.png'"
                    class="card-img-top object-cover"
                    alt="게시물 이미지"
                  />
                </div>
                <div class="card-body">
                  <h6 class="card-title mb-1">{{ post.postTitle }}</h6>
                  <p class="card-text text-muted small">
                    {{ post.postContent }}
                  </p>
                </div>
                <div
                  class="card-footer bg-white d-flex justify-content-between align-items-center"
                >
                  <small class="text-muted">{{
                    formatDate(post.createdAt)
                  }}</small>
                  <span class="text-muted small"
                    >♥ {{ post.postLikeCount }}</span
                  >
                </div>

                <!-- 상세 페이지로 이동 -->
                <router-link
                  :to="`/post/${post.postId}`"
                  class="stretched-link"
                ></router-link>
              </div>
            </div>
          </div>
        </section>

        <!-- 페이지네이션 -->
        <nav class="mt-4">
          <ul class="pagination pagination-sm">
            <li class="page-item" :class="{ disabled: page === 1 }">
              <button class="page-link" @click="page--" :disabled="page === 1">
                Prev
              </button>
            </li>
            <li
              class="page-item"
              v-for="n in totalPages"
              :key="n"
              :class="{ active: page === n }"
            >
              <button class="page-link" @click="page = n">{{ n }}</button>
            </li>
            <li class="page-item" :class="{ disabled: page === totalPages }">
              <button
                class="page-link"
                @click="page++"
                :disabled="page === totalPages"
              >
                Next
              </button>
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
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="resetFilters"
              >
                초기화
              </button>
            </div>

            <div class="mb-3">
              <label class="form-label small">검색</label>
              <input
                v-model="filters.q"
                type="search"
                class="form-control form-control-sm"
                placeholder="키워드..."
              />
            </div>

            <div class="mb-3">
              <label class="form-label small">종류</label>
              <div class="d-flex flex-wrap gap-2">
                <div v-for="c in categories" :key="c" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`cat-${c}`"
                    :value="c"
                    v-model="filters.cats"
                  />
                  <label class="form-check-label small" :for="`cat-${c}`">{{
                    c
                  }}</label>
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

            <button
              class="btn btn-dark w-100 btn-sm mt-2"
              @click="applyFilters"
            >
              적용
            </button>
          </div>
        </div>

        <!-- 해시태그 박스 -->
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <!-- 해시태그 박스 -->
            <div class="card border-0 shadow-sm mb-3">
              <div class="card-body">
                <ReviewDisplayBox
                  title="해시태그"
                  :tags="tagsFromReviews"
                  :max-visible="10"
                  prefix="#"
                  pill
                  clickable
                  @select="onSelect"
                />
              </div>
            </div>

            <strong class="d-block mb-2">통계</strong>
            <div class="d-flex justify-content-between small text-muted">
              <span>게시물</span><span>{{ posts.length }}</span>
            </div>
            <div class="d-flex justify-content-between small text-muted">
              <span>좋아요 합계</span><span>{{ totalLikes }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ReviewDisplayBox from "@/components/reviewDisplayBox.vue";
import { computed, reactive, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import PetProfileModal from "@/components/PetProfileModal";
import postApi from "@/apis/postApi";

// 채팅 신청 버튼
import ChatRequestButton from "@/components/Chat/ChatRequestButton.vue";

const profileUser = ref(null); // URL 기준 유저 정보 저장

const store = useStore();
const route = useRoute();
const router = useRouter();
const profileImgUrl = ref(null);
const profile = reactive({ bio: "로딩 중입니다..." });

// ✅ 유저 ID
const routeUserId = ref(null);
watch(
  () => route.params.userId,
  (newVal) => {
    if (newVal) {
      routeUserId.value = Number(newVal);
      loadPetProfile();
    }
  },
  { immediate: true }
);
const isMine = computed(() => routeUserId.value === store.state.user.userId);

async function loadProfileUser() {
  try {
    const userId = Number(route.params.userId) || store.state.user.userId;
    if (!userId) return;

    // 백엔드에서 @RequestParam 으로 받기 때문에 쿼리 파라미터 방식으로 요청해야 함
    const res = await axios.get("/user/info", { params: { userId } });

    // ✅ 실제 유저 객체는 res.data.data 안에 있음
    profileUser.value = res.data.data || {};

    console.log("✅ 불러온 유저 정보:", profileUser.value);
  } catch (e) {
    console.error("유저 정보 불러오기 실패:", e);
  }
}

// ✅ 펫 이미지 + pet_desc 로드
async function loadPetProfile() {
  try {
    const userId = routeUserId.value || store.state.user.userId;
    const resPets = await axios.get("/pet/find-allpetbyuser", {
      params: { petUserId: userId },
    });

    const pets = resPets.data || [];

    if (pets.length === 0) {
      profile.bio = "등록된 반려견이 없습니다.";
      profileImgUrl.value = "https://via.placeholder.com/100?text=No+Image";
      return;
    }

    // ✅ createdAt 기준으로 정렬 (오래된 순)
    pets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // ✅ 메인 펫 = 등록일이 가장 오래된 펫
    const mainPet = pets[0];

    profile.bio = mainPet.petDesc || "아직 반려견 소개가 없습니다.";

    // ✅ 이미지를 blob으로 변환하지 말고 URL 직접 연결
    profileImgUrl.value = `/pet/image/${mainPet.petId}`;
  } catch (e) {
    console.error("펫 프로필 불러오기 실패:", e);
    profile.bio = "프로필 정보를 불러오지 못했습니다.";
    profileImgUrl.value = "https://via.placeholder.com/100?text=No+Image";
  }
}

// ✅ 게시물 로드
const posts = ref([]); // DB에서 불러올 게시물 저장

// 게시물 목록 불러오기
// ✅ 게시물 목록 불러오기 (postApi 이용)
async function loadUserPosts() {
  try {
    const userId = routeUserId.value || store.state.user.userId;
    const res = await postApi.getUserPost(userId);

    if (res.data && res.data.posts) {
      posts.value = res.data.posts.map((p) => ({
        id: p.postId,
        title: p.postTitle,
        desc: p.postContent,
        subtitle: `좋아요 ${p.postLikeCount || 0}개`,
        img: postApi.getPostImage(p.postId),
        likes: p.postLikeCount || 0,
        time: new Date(p.createdAt).toLocaleString(),
        type: p.isRequest === "Y" ? "group" : "feed",
        cats: [],
      }));
    } else {
      posts.value = [];
    }
  } catch (e) {
    console.error("게시물 불러오기 실패:", e);
  }
}

// ✅ 필터 탭 & 정렬 적용
const activeTab = ref("all");
const filters = reactive({ q: "", cats: [], sort: "latest" });
const page = ref(1);
const pageSize = 6;

const filteredPosts = computed(() => {
  let list = posts.value.filter((p) =>
    activeTab.value === "all" ? true : p.type === activeTab.value
  );
  if (filters.q)
    list = list.filter((p) =>
      (p.title + p.subtitle + p.desc).includes(filters.q)
    );
  if (filters.sort === "likes")
    list = [...list].sort((a, b) => b.likes - a.likes);
  const start = (page.value - 1) * pageSize;
  return list.slice(start, start + pageSize);
});
const totalPages = computed(() =>
  Math.max(1, Math.ceil(posts.value.length / pageSize))
);

// ✅ 필터 및 게시물 로직
const tabs = [
  { key: "all", label: "전체" },
  { key: "story", label: "스토리" },
  { key: "group", label: "그룹산책" },
  { key: "feed", label: "피드" },
];

const categories = ["강아지", "고양이", "일상", "산책", "모임"];

function resetFilters() {
  filters.q = "";
  filters.cats = [];
  filters.sort = "latest";
}
function applyFilters() {
  page.value = 1;
}

// ✅ 리뷰 해시태그
const reviews = computed(() => store.getters["review/reviews"] || []);
const tagsFromReviews = computed(() => {
  const ids = reviews.value.map((r) => r?.reviewTagId).filter(Boolean);
  return [...new Set(ids)].map((id) => String(id));
});

// ✅ 펫 모달
const highlights2 = [
  { id: 1, name: "뽀삐", img: "https://via.placeholder.com/80" },
];
const selectedPet = ref(null);
const showModal = ref(false);
const currentUserId = 1;

function handleEdit(pet) {
  console.log("편집:", pet);
}
function handleChat(pet) {
  console.log("채팅 신청:", pet);
}

// ReviewDisplayBox에서 해시태그 클릭 시 동작
function onSelect(tag) {
  console.log("선택된 해시태그:", tag);
  // 예시: 검색 필터에 반영
  filters.q = tag.replace("#", "");
  applyFilters();
}

// 펫 목록 상태
const petList = ref([]);

// 유저의 모든 펫 목록 로드
async function loadAllPets() {
  try {
    const userId = routeUserId.value || store.state.user.userId;
    const res = await axios.get("/pet/find-allpetbyuser", {
      params: { petUserId: userId },
    });
    petList.value = res.data || [];
  } catch (err) {
    console.error("펫 목록 로드 실패:", err);
    petList.value = [];
  }
}

// 펫 이미지 URL 반환 함수
function getPetImageUrl(pet) {
  // DB에 이미지가 등록된 경우 /pet/image/{petId} 로 접근
  if (pet && pet.petId) {
    return `/pet/image/${pet.petId}`;
  }
  // 기본 이미지 fallback
  return "https://via.placeholder.com/80?text=No+Image";
}

// 펫 등록 페이지 이동
function goToPetRegister() {
  router.push("/Pet/RegisterPet");
}

// 기존 openPetModal 재사용
function openPetModal(pet) {
  selectedPet.value = pet;
  showModal.value = true;
}

/* -------------------------
   📰 내 게시물 불러오기
------------------------- */
const myPosts = ref([]);
const loadingMyPosts = ref(true);

async function loadMyPosts() {
  try {
    // ✅ 로그인 유저가 아니라 route param 기준으로 로드
    const userId = Number(route.params.userId) || store.state.user.userId;
    if (!userId) return;

    const res = await postApi.getUserPost(userId);
    if (res.data && res.data.posts) {
      myPosts.value = res.data.posts.map((p) => ({
        ...p,
        thumbnailUrl: `http://localhost:8080/post/image/${p.postId}`,
      }));
    } else {
      myPosts.value = [];
    }
  } catch (e) {
    console.error("🚫 내 게시물 불러오기 실패:", e);
  } finally {
    loadingMyPosts.value = false;
  }
}

/* 날짜 포맷 (기존 함수 없으면) */
function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR");
}

onMounted(async () => {
  if (!store.getters.isLogin) await store.dispatch("loadAuthFromStorage");

  const userId = Number(route.params.userId) || store.state.user.userId;

  await Promise.all([
    loadProfileUser(userId),
    loadPetProfile(userId),
    loadAllPets(userId),
    loadUserPosts(userId),
    loadMyPosts(userId),
  ]);
});

watch(
  () => route.params.userId,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      await loadProfileUser(); // ✅ 라우트 변경 시 다시 로드
      await loadMyPosts();
    }
  }
);
</script>

<style scoped>
.object-cover {
  object-fit: cover;
}
.story-ring {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 3px solid transparent;
  background: linear-gradient(45deg, #ff6ea8, #f7b2d9, #fcd5e8);
  background-origin: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* ✅ 혹시 모서리 벗어나는거 방지 */
}

.story-ring img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
</style>
