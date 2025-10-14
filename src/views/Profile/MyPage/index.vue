<template>
  <div
    class="container-fluid py-4"
    style="
      background-color: #faf8f5;

      /* 브랜드 색상 세트 */
      --bs-primary: #6f5034;
      --bs-primary-rgb: 111, 80, 52;

      /* 링크, 글자 */
      --bs-link-color: #6f5034;
      --bs-link-hover-color: #5b432c;

      /* 버튼 (btn-primary) */
      --bs-btn-bg: #6f5034;
      --bs-btn-border-color: #6f5034;
      --bs-btn-hover-bg: #5b432c;
      --bs-btn-hover-border-color: #5b432c;
      --bs-btn-active-bg: #4d3826;
      --bs-btn-active-border-color: #4d3826;
      --bs-btn-active-color: #fff;

      /* 탭(nav-pills) */
      --bs-nav-pills-link-active-bg: #6f5034;

      /* 페이지네이션 */
      --bs-pagination-color: #6f5034;
      --bs-pagination-hover-color: #5b432c;
      --bs-pagination-active-bg: #6f5034;
      --bs-pagination-active-border-color: #6f5034;
    "
  >
    <div class="container">
      <!-- 프로필 헤더 -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row align-items-center g-3">
            <div class="col-auto">
              <div
                v-if="mainPet"
                class="main-pet-card p-2 bg-white rounded shadow-sm"
                style="width: 170px; cursor: pointer"
                @click="openPetModal(mainPet)"
              >
                <div
                  class="ratio ratio-1x1 mb-2"
                  style="overflow: hidden; border-radius: 8px"
                >
                  <img
                    :src="getPetImageUrl(mainPet)"
                    alt="main pet"
                    style="width: 100%; height: 100%; object-fit: cover"
                    loading="lazy"
                    decoding="async"
                    @error="onImgErr"
                  />
                </div>
                <div class="small">
                  <div>
                    <strong>{{ mainPet.petName }}</strong>
                  </div>
                  <div class="text-muted">
                    {{ mainPet.petBreed || "-" }} •
                    {{ mainPet.petWeight ? mainPet.petWeight + "kg" : "-" }}
                  </div>
                  <div class="text-muted">
                    {{ mainPet.petAge ? mainPet.petAge + "세" : "" }}
                  </div>
                </div>
              </div>
              <!-- no fallback avatar: left slot reserved for main pet only -->
            </div>

            <div class="col">
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <h5 class="mb-0">
                  ID: {{ profileUser?.userLoginId || "불러오는 중..." }}
                </h5>
                <template v-if="isMyProfile">
                  <span class="text-muted small">·</span>
                  <RouterLink to="/Profile/EditProfile">
                    <button class="btn btn-sm btn-outline-secondary">
                      설정
                    </button>
                  </RouterLink>
                </template>
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
                  <div class="d-flex gap-3 align-items-start">
                    <div class="p-3 bg-light rounded flex-grow-1">
                      <p class="mb-0 small">{{ profile.bio }}</p>
                      <div class="mt-3 small text-muted">
                        <div class="d-flex gap-3 flex-wrap">
                          <div>
                            위치:
                            <strong class="text-dark">{{
                              userLocation || "미등록"
                            }}</strong>
                          </div>
                          <div>
                            펫 수:
                            <strong class="text-dark">{{ petsCount }}</strong>
                          </div>
                          <div>
                            게시물:
                            <strong class="text-dark">{{ postsCount }}</strong>
                          </div>
                          <div>
                            좋아요 합계:
                            <strong class="text-dark">{{ totalLikes }}</strong>
                          </div>
                          <div v-if="memberSince">
                            가입일:
                            <strong class="text-dark">{{ memberSince }}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-2">
                    <button
                      class="btn btn-warning"
                      @click="showStickerModal = true"
                      :title="'내가 받은 스티커 리뷰를 모아 보여줍니다.'"
                    >
                      스티커 구경하기
                    </button>
                    <ChatRequestButton v-if="!isMyProfile" class="ms-2" />
                    <button
                      class="btn ms-2"
                      :class="
                        canOneOnOneGo ? 'btn-primary' : 'btn-outline-secondary'
                      "
                      :disabled="!canOneOnOneGo"
                      @click="openOneOnOneModal"
                      :title="
                        canOneOnOneGo ? '' : '1:1 산책이 수락되면 활성화됩니다.'
                      "
                    >
                      산책 하러가기!
                    </button>
                    <WalkRequest
                      class="ms-2"
                      v-if="!isMyProfile"
                      :receive-user-id="Number(route.params.userId)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 하이라이트 펫 썸네일 -->
      <div class="d-flex align-items-center gap-4 mb-4 flex-wrap">
        <template v-if="isMyProfile">
          <button
            class="btn btn-outline-secondary btn-sm"
            @click="router.push('/Register/AddPet')"
          >
            Add Pets
          </button>
        </template>

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
              loading="lazy"
              decoding="async"
              @error="onImgErr"
            />
          </div>
          <div class="small text-muted">{{ pet.petName }}</div>
        </div>
      </div>

      <!-- 펫 프로필 모달 -->
      <PetProfileModal
        v-model:show="showPetModal"
        :pet="selectedPet"
        :currentUserId="store.state.user.userId"
        @edit="goToEditPet"
      />

      <!-- 스티커 보여주기 모달 -->
      <StickerWallModal
        v-model:show="showStickerModal"
        :user-id="routeUserId || store.state.user.userId"
        :max="20"
      />

      <!-- ===== 콘텐츠 + 사이드바 ===== -->
      <div class="row g-4">
        <div class="col-lg-8">
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
                v-for="post in filteredMyPosts"
                :key="post.postId"
                class="col-md-6 col-lg-4"
              >
                <div class="card h-100 border-0 shadow-sm">
                  <div class="ratio ratio-4x3">
                    <img
                      :src="post.thumbnailUrl || '/default_post.png'"
                      class="card-img-top object-cover"
                      alt="게시물 이미지"
                      loading="lazy"
                      decoding="async"
                      @error="onPostImgErr"
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
            <ul class="pagination pagination-sm justify-content-center">
              <li class="page-item" :class="{ disabled: page === 1 }">
                <button
                  class="page-link"
                  @click="page--"
                  :disabled="page === 1"
                >
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
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <strong>필터</strong>
                <button
                  class="btn btn-sm btn-outline-secondary"
                  @click="resetFiltersAndReload"
                >
                  초기화
                </button>
              </div>
              <div class="mb-3">
                <label class="form-label small">태그</label>
                <div class="d-flex flex-wrap gap-2">
                  <div v-for="t in tags" :key="t.tagId" class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :id="`tag-${t.tagId}`"
                      :value="t.tagName"
                      v-model="filters.cats"
                      @change="applyFilters"
                    />
                    <label
                      class="form-check-label small"
                      :for="`tag-${t.tagId}`"
                      >{{ t.tagName }}</label
                    >
                  </div>
                </div>
              </div>

              <div class="mb-2">
                <label class="form-label small">정렬</label>
                <select
                  v-model="filters.sort"
                  class="form-select form-select-sm"
                >
                  <option value="latest">최신순</option>
                  <option value="likes">좋아요순</option>
                </select>
              </div>
              <router-link
                to="/post/create"
                class="btn btn-primary w-100 btn-sm mt-3"
                style="
                  --bs-btn-bg: #6f5034;
                  --bs-btn-border-color: #6f5034;
                  --bs-btn-hover-bg: #5b432c;
                  --bs-btn-hover-border-color: #5b432c;
                  --bs-btn-active-bg: #4d3826;
                  --bs-btn-active-border-color: #4d3826;
                  --bs-btn-focus-shadow-rgb: 111, 80, 52;
                "
              >
                ✏️ 게시글 작성하기
              </router-link>
            </div>
          </div>

          <div class="card border-0 shadow-sm">
            <div class="card-body">
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

      <!-- 1:1 산책 진행 모달 -->
      <OneOnOneWalkModal
        v-model="showOOOWalk"
        :request-one-id="acceptedPair?.requestOneId || null"
        :partner-id="Number(route.params.userId)"
        :partner-name="
          profileUser?.userLoginId || 'User#' + route.params.userId
        "
      />
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import PetProfileModal from "@/components/PetProfileModal";
import postApi from "@/apis/postApi";
import WalkRequest from "@/components/Walk/WalkRequest.vue";
import ChatRequestButton from "@/components/Chat/ChatRequestButton.vue";
import walkApi from "@/apis/walkApi";
import OneOnOneWalkModal from "@/components/Walk/OneOnOneWalkModal.vue";
import StickerWallModal from "@/components/Review/StickerWallModal.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();

/* ========================
  상태
======================== */
const profileUser = ref(null);
const profileImgUrl = ref(null);
const profile = reactive({ bio: "로딩 중입니다...", stats: [] });

const posts = ref([]);
const tabs = [
  { key: "all", label: "전체" },
  { key: "group", label: "산책" },
  { key: "feed", label: "피드" },
];
const activeTab = ref("all");
const filters = ref({
  cats: [],
  sort: "latest",
});
const tags = ref([]);
const page = ref(1);
const pageSize = 6;

const myPosts = ref([]);
const loadingMyPosts = ref(true);

const petList = ref([]);
const showPetModal = ref(false);
const selectedPet = ref(null);
const mainPet = ref(null);

const userId = computed(() => store.state.user?.userId || null);
const routeUserId = ref(null);

const userLocation = computed(
  () => profileUser.value?.userAddress || profileUser.value?.userLocation || ""
);
const petsCount = computed(() => (petList.value ? petList.value.length : 0));
const postsCount = computed(() => (myPosts.value ? myPosts.value.length : 0));
const totalLikes = computed(() =>
  (myPosts.value || []).reduce((acc, p) => acc + (p.postLikeCount || 0), 0)
);
const memberSince = computed(() => {
  const d = profileUser.value?.createdAt || profileUser.value?.regDate || null;
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("ko-KR");
  } catch (e) {
    return d;
  }
});

const isMyProfile = computed(() => {
  const routeId = route.params.userId ? Number(route.params.userId) : null;
  const me = store.state.user?.userId ?? null;
  if (!routeId) return me != null;
  return routeId === me;
});

const showStickerModal = ref(false);

watch(
  () => route.params.userId,
  (newVal) => {
    if (newVal) {
      routeUserId.value = Number(newVal);
      loadProfileUser();
      loadPetProfile();   // ✅ 경량 API 우선 사용
      loadAllPets();
      loadUserPosts();
      loadMyPosts();
      loadTags();
      checkAcceptedPair();
    }
  },
  { immediate: true }
);

/** 공통: 베이스 URL */
function baseUrl() {
  return (axios.defaults.baseURL || "").replace(/\/$/, "");
}

/** 이미지 에러 시 폴백 */
function onImgErr(e) {
  if (e?.target) e.target.src = "https://via.placeholder.com/100?text=No+Image";
}
function onPostImgErr(e) {
  if (e?.target) e.target.src = "/default_post.png";
}

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

/** ✅ 메인 펫은 경량 API(/pet/{userId}/first-pet) 우선 */
async function loadPetProfile() {
  const uid = Number(route.params.userId) || store.state.user.userId;
  if (!uid) return;

  try {
    // 1) 경량 API 시도
    const fp = await axios.get(`/pet/${uid}/first-pet`);
    if (fp?.status === 200 && fp.data) {
      mainPet.value = {
        petId: fp.data.petId,
        petName: fp.data.petName,
        petBreed: fp.data.petBreed,
        createdAt: fp.data.createdAt,
        petUserId: uid,
      };
      profile.bio = "반려견과 함께한 이야기를 나눠보세요!";
      const v = store.state.imageVersion ? `?v=${store.state.imageVersion}` : "";
      profileImgUrl.value = baseUrl() + fp.data.imageUrl + v;
      return;
    }
  } catch {
    // no-op → fallback
  }

  // 2) 폴백: 전체 리스트에서 첫 펫 선택 (서버가 BLOB을 싣지 않는 전제)
  try {
    const resPets = await axios.get("/pet/find-allpetbyuser", {
      params: { petUserId: uid },
    });
    const pets = resPets.data || [];
    if (pets.length === 0) {
      profile.bio = "등록된 반려견이 없습니다.";
      profileImgUrl.value = "https://via.placeholder.com/100?text=No+Image";
      mainPet.value = null;
      return;
    }
    pets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const mp = pets[0];
    mainPet.value = mp;
    profile.bio = mp.petDesc || "아직 반려견 소개가 없습니다.";
    const v = store.state.imageVersion ? `?v=${store.state.imageVersion}` : "";
    profileImgUrl.value = baseUrl() + `/pet/image/${mp.petId}` + v;
  } catch (e) {
    console.error("펫 프로필 불러오기 실패:", e);
    profile.bio = "프로필 정보를 불러오지 못했습니다.";
    profileImgUrl.value = "https://via.placeholder.com/100?text=No+Image";
    mainPet.value = null;
  }
}

async function loadAllPets() {
  try {
    const uid = Number(route.params.userId) || store.state.user.userId;
    const res = await axios.get("/pet/find-allpetbyuser", {
      params: { petUserId: uid },
    });
    petList.value = res.data || [];
  } catch (err) {
    console.error("펫 목록 로드 실패:", err);
    petList.value = [];
  }
}

function getPetImageUrl(pet) {
  if (pet?.petId) {
    const v = store.state.imageVersion ? `?v=${store.state.imageVersion}` : "";
    return baseUrl() + `/pet/image/${pet.petId}` + v;
  }
  return "https://via.placeholder.com/80?text=No+Image";
}

function goToEditPet(pet) {
  router.push(`/Register/EditPet/${pet.petId}`);
}

async function openPetModal(pet) {
  selectedPet.value = { ...pet };
  try {
    const res = await axios.get("/user/info", {
      params: { userId: pet.petUserId },
    });
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
    const uid = Number(route.params.userId) || store.state.user.userId;
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
      const base = baseUrl();
      myPosts.value = res.data.posts.map((p) => ({
        ...p,
        thumbnailUrl: `${base}/post/image/${p.postId}`,
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

/* ========================
  필터
======================== */
const filteredMyPosts = computed(() => {
  const sort = filters.value.sort;
  let list = myPosts.value.filter((p) => {
    const isReq = (p.isRequest || "").trim();
    if (activeTab.value === "all") return true;
    if (activeTab.value === "group") return isReq === "Y";
    if (activeTab.value === "feed") return isReq !== "Y";
    if (activeTab.value === "story") return isReq !== "Y";
    return true;
  });

  if (sort === "likes") {
    return [...list].sort(
      (a, b) => (b.postLikeCount || 0) - (a.postLikeCount || 0)
    );
    } else {
    return [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
});

function resetFilters() {
  filters.value.cats = [];
  filters.value.sort = "latest";
  store.dispatch("post/fetchList", 1).then(() => {
    posts.value = store.getters["post/getList"];
  });
}

async function resetFiltersAndReload() {
  resetFilters();
  await loadMyPosts();
}

async function applyFilters() {
  page.value = 1;
  try {
    const uId = Number(route.params.userId) || store.state.user.userId;

    if (!filters.value.cats || filters.value.cats.length === 0) {
      await loadMyPosts();
    } else {
      const selectedTag = filters.value.cats[filters.value.cats.length - 1];
      await store.dispatch("post/fetchListByTag", selectedTag);
      const list = store.getters["post/getList"] || [];
      myPosts.value = list.filter((p) => Number(p.postUserId) === Number(uId));
    }
  } catch (e) {
    console.error("필터 적용 실패:", e);
  }
}

// ===== 1:1 산책 수락 여부 확인 =====
const acceptedPair = ref(null);
const canOneOnOneGo = computed(() => !!acceptedPair.value?.requestOneId);

async function checkAcceptedPair() {
  try {
    const me = userId.value;
    const other = Number(route.params.userId);
    if (!me || !other) {
      acceptedPair.value = null;
      return;
    }

    const [rec, sent] = await Promise.allSettled([
      walkApi.getReceivedRequests(me),
      walkApi.getOneOnOneRequests(me),
    ]);

    const recvList =
      rec.status === "fulfilled" ? rec.value?.data?.walkReceiveList || [] : [];
    const sentList =
      sent.status === "fulfilled"
        ? sent.value?.data?.walkRequestList || []
        : [];

    const isAccepted = (row) =>
      String(row?.rstatus || "P").toUpperCase() === "A";
    const pairMatch = (row) =>
      (row.requestUserId === me && row.receiveUserId === other) ||
      (row.requestUserId === other && row.receiveUserId === me);

    const found =
      recvList.find((x) => isAccepted(x) && pairMatch(x)) ||
      sentList.find((x) => isAccepted(x) && pairMatch(x)) ||
      null;

    acceptedPair.value = found
      ? {
          requestOneId: found.requestOneId,
          requestUserId: found.requestUserId,
          receiveUserId: found.receiveUserId,
          rstatus: found.rstatus,
        }
      : null;
  } catch (e) {
    console.warn("1:1 수락 페어 확인 실패:", e);
    acceptedPair.value = null;
  }
}

const showOOOWalk = ref(false);
function openOneOnOneModal() {
  if (!canOneOnOneGo.value) return;
  showOOOWalk.value = true;
}

async function loadTags() {
  try {
    await store.dispatch("post/fetchTags");
    tags.value = store.getters["post/getTags"] || [];
  } catch (e) {
    console.warn("태그 로드 실패:", e);
    tags.value = [];
  }
}


onMounted(async () => {
  if (!store.getters.isLogin) await store.dispatch("loadAuthFromStorage");
  await Promise.all([
    loadProfileUser(),
    loadPetProfile(),  // ✅ 경량 API 우선
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

/* 메인 펫 카드 */
.main-pet-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 10px;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  cursor: pointer;
}

.main-pet-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

/* 설명란 */
.p-3.bg-light {
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

/* 왼쪽 큰 펫 아바타 */
.main-pet-left img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgba(255, 110, 168, 0.1);
}

.main-pet-left .small {
  line-height: 1;
}
</style>
