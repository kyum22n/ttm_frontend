<template>
  <div class="container py-4">
    <!-- 프로필 헤더 -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row align-items-center g-3">
          <div class="col-auto">
            <img v-if="profileImgUrl" :src="profileImgUrl" alt="프로필" class="rounded-circle object-cover" width="88"
              height="88" />
          </div>

          <div class="col">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <h5 class="mb-0">ID: {{ profileUser?.userLoginId || "불러오는 중..." }}</h5>

              <span class="text-muted small">·</span>
              <RouterLink to="/Profile/EditProfile">
                <button class="btn btn-sm btn-outline-secondary">설정</button>
              </RouterLink>
            </div>

            <ul class="list-inline text-muted small mb-2 mt-2">
              <li class="list-inline-item" v-for="(s, i) in profile.stats" :key="i">
                <span class="me-1">{{ s.label }}</span><strong class="text-dark">{{ s.value }}</strong>
              </li>
            </ul>

            <div class="row g-3">
              <div class="col-lg-8">
                <div class="p-3 bg-light rounded">
                  <p class="mb-0 small">{{ profile.bio }}</p>
                </div>
              </div>

              <div class="col-lg-2 text-lg-end">
                <!-- 1:1 산책 신청 버튼 (기존) -->
                <WalkRequest :receive-user-id="Number(route.params.userId)" />
              </div>

              <div class="col-lg-2">
                <!-- ✅ 1:1 산책 수락(A) 건이 있을 때에만 활성화 -->
                <button class="btn" :class="canOneOnOneGo ? 'btn-primary' : 'btn-outline-secondary'"
                  :disabled="!canOneOnOneGo" @click="openOneOnOneModal"
                  :title="canOneOnOneGo ? '' : '1:1 산책이 수락되면 활성화됩니다.'">
                  산책 하러가기!
                </button>
              </div>

              <!-- ✅ 새 버튼: 스티커 구경하기 -->
              <div class="col-lg-2">
                <button class="btn btn-warning" @click="showStickerModal = true" :title="'내가 받은 스티커 리뷰를 모아 보여줍니다.'">
                  스티커 구경하기
                </button>
              </div>

              <div>
                <ChatRequestButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하이라이트 펫 썸네일 -->
    <div class="d-flex align-items-center gap-4 mb-4 flex-wrap">
      <button class="btn btn-outline-secondary btn-sm" @click="router.push('/Register/AddPet')">Add Pets</button>

      <div v-for="pet in petList" :key="pet.petId" class="text-center" @click="openPetModal(pet)"
        style="cursor: pointer">
        <div class="story-ring mx-auto mb-1">
          <img :src="getPetImageUrl(pet)" alt="pet thumbnail" class="rounded-circle object-cover" width="64"
            height="64" />
        </div>
        <div class="small text-muted">{{ pet.petName }}</div>
      </div>
    </div>

    <!-- 펫 프로필 모달 -->
    <PetProfileModal v-model:show="showPetModal" :pet="selectedPet" :currentUserId="store.state.user.userId"
      @edit="goToEditPet" />

    <!-- 스티커 보여주기 모달 -->
    + <StickerWallModal
   v-model:show="showStickerModal"
   :user-id="userId || store.state.user.userId"
   :max="20"
/>

    <!-- ===== 콘텐츠 + 사이드바 ===== -->
    <div class="row g-4">
      <div class="col-lg-8">
        <ul class="nav nav-pills mb-3">
          <li v-for="t in tabs" :key="t.key" class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === t.key }" @click="activeTab = t.key">
              {{ t.label }}
            </button>
          </li>
        </ul>

        <section class="mt-5">
          <h5 class="fw-bold mb-3">내 게시물</h5>

          <div v-if="loadingMyPosts" class="text-center text-muted py-5">불러오는 중...</div>

          <div v-else-if="myPosts.length === 0" class="text-center text-muted py-5">
            아직 작성한 게시물이 없습니다.
          </div>

          <div v-else class="row g-3">
            <div v-for="post in myPosts" :key="post.postId" class="col-md-6 col-lg-4">
              <div class="card h-100 border-0 shadow-sm">
                <div class="ratio ratio-4x3">
                  <img :src="post.thumbnailUrl || '/default_post.png'" class="card-img-top object-cover"
                    alt="게시물 이미지" />
                </div>
                <div class="card-body">
                  <h6 class="card-title mb-1">{{ post.postTitle }}</h6>
                  <p class="card-text text-muted small">
                    {{ post.postContent }}
                  </p>
                </div>
                <div class="card-footer bg-white d-flex justify-content-between align-items-center">
                  <small class="text-muted">{{ formatDate(post.createdAt) }}</small>
                  <span class="text-muted small">♥ {{ post.postLikeCount }}</span>
                </div>

                <router-link :to="`/post/${post.postId}`" class="stretched-link"></router-link>
              </div>
            </div>
          </div>
        </section>

        <!-- 페이지네이션 -->
        <nav class="mt-4">
          <ul class="pagination pagination-sm">
            <li class="page-item" :class="{ disabled: page === 1 }">
              <button class="page-link" @click="page--" :disabled="page === 1">Prev</button>
            </li>
            <li class="page-item" v-for="n in totalPages" :key="n" :class="{ active: page === n }">
              <button class="page-link" @click="page = n">{{ n }}</button>
            </li>
            <li class="page-item" :class="{ disabled: page === totalPages }">
              <button class="page-link" @click="page++" :disabled="page === totalPages">Next</button>
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
              <button class="btn btn-sm btn-outline-secondary" @click="resetFilters">초기화</button>
            </div>

            <div class="mb-3">
              <label class="form-label small">검색</label>
              <input v-model="filters.q" type="search" class="form-control form-control-sm" placeholder="키워드..." />
            </div>

            <div class="mb-3">
              <label class="form-label small">종류</label>
              <div class="d-flex flex-wrap gap-2">
                <div v-for="c in categories" :key="c" class="form-check">
                  <input class="form-check-input" type="checkbox" :id="`cat-${c}`" :value="c" v-model="filters.cats" />
                  <label class="form-check-label small" :for="`cat-${c}`">{{ c }}</label>
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

            <button class="btn btn-dark w-100 btn-sm mt-2" @click="applyFilters">적용</button>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="card border-0 shadow-sm mb-3">
              <div class="card-body">
                <ReviewDisplayBox title="해시태그" :tags="tagsFromReviews" :max-visible="10" prefix="#" pill clickable
                  @select="onSelect" />
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

    <!-- ✅ 1:1 산책 진행 모달 -->
    <OneOnOneWalkModal v-model="showOOOWalk" :request-one-id="acceptedPair?.requestOneId || null"
      :partner-id="Number(route.params.userId)"
      :partner-name="profileUser?.userLoginId || ('User#' + route.params.userId)" />
  </div>
</template>

<script setup>
import ReviewDisplayBox from "@/components/ReviewDisplayBox.vue";
import { computed, reactive, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import PetProfileModal from "@/components/PetProfileModal";
import postApi from "@/apis/postApi";
import WalkRequest from "@/components/Walk/WalkRequest.vue";
import ChatRequestButton from "@/components/Chat/ChatRequestButton.vue";
import walkApi from "@/apis/walkApi"; // ✅ 받은/보낸 1:1 신청 목록 사용

import OneOnOneWalkModal from "@/components/Walk/OneOnOneWalkModal.vue";
import StickerWallModal from "@/components/Review/StickerWallModal.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();

const profileUser = ref(null);
const profileImgUrl = ref(null);
const profile = reactive({ bio: "로딩 중입니다...", stats: [] });

const posts = ref([]);
const tabs = [
  { key: "all", label: "전체" },
  { key: "story", label: "스토리" },
  { key: "group", label: "그룹산책" },
  { key: "feed", label: "피드" },
];
const categories = ["강아지", "고양이", "일상", "산책", "모임"];
const activeTab = ref("all");
const filters = reactive({ q: "", cats: [], sort: "latest" });
const page = ref(1);
const pageSize = 6;

const myPosts = ref([]);
const loadingMyPosts = ref(true);

const petList = ref([]);
const showPetModal = ref(false);
const selectedPet = ref(null);

const userId = computed(() => store.state.user?.userId || null);
const routeUserId = ref(null);

const showStickerModal = ref(false); // 열고 닫기만

watch(
  () => route.params.userId,
  (newVal) => {
    if (newVal) {
      routeUserId.value = Number(newVal);
      loadPetProfile();
      loadAllPets();
      loadUserPosts();
      loadProfileUser();
      loadMyPosts();
      checkAcceptedPair();
    }
  },
  { immediate: true }
);

async function loadProfileUser() {
  try {
    const uid = Number(route.params.userId) || store.state.user.userId;
    if (!uid) return;
    const res = await axios.get("/user/info", { params: { userId: uid } });
    profileUser.value = res.data?.data || {};
  } catch (e) {
    console.error("유저 정보 불러오기 실패:", e);
  }
}

async function loadPetProfile() {
  try {
    const uid = routeUserId.value || store.state.user.userId;
    const resPets = await axios.get("/pet/find-allpetbyuser", { params: { petUserId: uid } });
    const pets = resPets.data || [];
    if (pets.length === 0) {
      profile.bio = "등록된 반려견이 없습니다.";
      profileImgUrl.value = "https://via.placeholder.com/100?text=No+Image";
      return;
    }
    pets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const mainPet = pets[0];
    profile.bio = mainPet.petDesc || "아직 반려견 소개가 없습니다.";
    profileImgUrl.value = `/pet/image/${mainPet.petId}`;
  } catch (e) {
    console.error("펫 프로필 불러오기 실패:", e);
    profile.bio = "프로필 정보를 불러오지 못했습니다.";
    profileImgUrl.value = "https://via.placeholder.com/100?text=No+Image";
  }
}

async function loadAllPets() {
  try {
    const uid = routeUserId.value || store.state.user.userId;
    const res = await axios.get("/pet/find-allpetbyuser", { params: { petUserId: uid } });
    petList.value = res.data || [];
  } catch (err) {
    console.error("펫 목록 로드 실패:", err);
    petList.value = [];
  }
}

function getPetImageUrl(pet) {
  if (pet?.petId) return `/pet/image/${pet.petId}`;
  return "https://via.placeholder.com/80?text=No+Image";
}

function goToEditPet(pet) {
  router.push(`/Register/EditPet/${pet.petId}`);
}

async function openPetModal(pet) {
  selectedPet.value = { ...pet };
  try {
    const res = await axios.get("/user/info", { params: { userId: pet.petUserId } });
    if (res.data?.data) {
      selectedPet.value.userLoginId = res.data.data.userLoginId;
      selectedPet.value.userAddress = res.data.data.userAddress;
    }
  } catch (e) {
    console.error("유저 정보 불러오기 실패:", e);
  }
  showPetModal.value = true;
}

async function loadUserPosts() {
  try {
    const uid = routeUserId.value || store.state.user.userId;
    const res = await postApi.getUserPost(uid);
    if (res.data?.posts) {
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

async function loadMyPosts() {
  try {
    const uid = Number(route.params.userId) || store.state.user.userId;
    if (!uid) return;
    const res = await postApi.getUserPost(uid);
    if (res.data?.posts) {
      myPosts.value = res.data.posts.map((p) => ({
        ...p,
        thumbnailUrl: `http://localhost:8080/post/image/${p.postId}`,
      }));
    } else {
      myPosts.value = [];
    }
  } catch (e) {
    console.error("내 게시물 불러오기 실패:", e);
  } finally {
    loadingMyPosts.value = false;
  }
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR");
}

const filteredPosts = computed(() => {
  let list = posts.value.filter((p) => (activeTab.value === "all" ? true : p.type === activeTab.value));
  if (filters.q) list = list.filter((p) => (p.title + p.subtitle + p.desc).includes(filters.q));
  if (filters.sort === "likes") list = [...list].sort((a, b) => b.likes - a.likes);
  const start = (page.value - 1) * pageSize;
  return list.slice(start, start + pageSize);
});
const totalPages = computed(() => Math.max(1, Math.ceil(posts.value.length / pageSize)));
function resetFilters() { filters.q = ""; filters.cats = []; filters.sort = "latest"; }
function applyFilters() { page.value = 1; }

// ===== 리뷰 해시태그 (그대로) =====
const reviews = computed(() => store.getters["review/reviews"] || []);
const tagsFromReviews = computed(() => {
  const ids = reviews.value.map((r) => r?.reviewTagId).filter(Boolean);
  return [...new Set(ids)].map((id) => String(id));
});
function onSelect(tag) { filters.q = tag.replace("#", ""); applyFilters(); }

// ===== 1:1 산책 수락 여부 확인 =====
const acceptedPair = ref(null); // { requestOneId, requestUserId, receiveUserId, rstatus }
const canOneOnOneGo = computed(() => !!acceptedPair.value?.requestOneId);

async function checkAcceptedPair() {
  try {
    const me = userId.value;
    const other = Number(route.params.userId);
    if (!me || !other) { acceptedPair.value = null; return; }

    // 내 기준 받은/보낸 둘 다 조회
    const [rec, sent] = await Promise.allSettled([
      walkApi.getReceivedRequests(me),   // 내가 받은
      walkApi.getOneOnOneRequests(me),  // 내가 보낸
    ]);

    const recvList = rec.status === "fulfilled" ? (rec.value?.data?.walkReceiveList || []) : [];
    const sentList = sent.status === "fulfilled" ? (sent.value?.data?.walkRequestList || []) : [];

    // A(수락) 상태이고, 둘의 페어가 일치하는 요청 1건 찾기
    const isAccepted = (row) => String((row?.rstatus || "P")).toUpperCase() === "A";
    const pairMatch = (row) =>
      (row.requestUserId === me && row.receiveUserId === other) ||
      (row.requestUserId === other && row.receiveUserId === me);

    const found =
      recvList.find((x) => isAccepted(x) && pairMatch(x)) ||
      sentList.find((x) => isAccepted(x) && pairMatch(x)) ||
      null;

    acceptedPair.value = found ? {
      requestOneId: found.requestOneId,
      requestUserId: found.requestUserId,
      receiveUserId: found.receiveUserId,
      rstatus: found.rstatus
    } : null;
  } catch (e) {
    console.warn("1:1 수락 페어 확인 실패:", e);
    acceptedPair.value = null;
  }
}

// 모달 오픈
const showOOOWalk = ref(false);
function openOneOnOneModal() {
  if (!canOneOnOneGo.value) return;
  showOOOWalk.value = true;
}

onMounted(async () => {
  if (!store.getters.isLogin) await store.dispatch("loadAuthFromStorage");
  await Promise.all([
    loadProfileUser(),
    loadPetProfile(),
    loadAllPets(),
    loadUserPosts(),
    loadMyPosts(),
  ]);
  await checkAcceptedPair();
});
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
  overflow: hidden;
}

.story-ring img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
</style>
