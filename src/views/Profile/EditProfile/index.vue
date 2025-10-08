<template>
  <div class="container py-4">
    <!-- 프로필 헤더 -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row align-items-center g-3">
          <div class="col-auto">
            <img
              v-if="profileImgUrl"
              :src="profileImgUrl"
              alt="프로필"
              class="rounded-circle object-cover"
              width="88"
              height="88"
            />
            <img
              v-else
              src="/default-avatar.png"
              alt="기본 이미지"
              class="rounded-circle object-cover"
              width="88"
              height="88"
            />
          </div>

          <div class="col">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <h5 class="mb-0">ID: {{ store.state.user.userLoginId }}</h5>
              <span class="text-muted small">·</span>

              <RouterLink v-if="isMine" to="/Profile/EditProfile">
                <button class="btn btn-sm btn-outline-secondary">설정</button>
              </RouterLink>
              <button v-else class="btn btn-sm btn-primary">팔로우</button>
            </div>

            <!-- 소개글 (pet_desc) -->
            <div class="mt-2">
              <div class="p-3 bg-light rounded">
                <p class="mb-0 small">{{ profile.bio }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하이라이트 펫 썸네일 -->
    <div class="d-flex align-items-center gap-4 mb-4 flex-wrap">
      <button class="btn btn-outline-secondary btn-sm">Add Pets</button>
      <div
        v-for="h in highlights2"
        :key="h.id"
        class="text-center"
        @click="openPetModal(h)"
        style="cursor: pointer"
      >
        <div class="story-ring mx-auto mb-1">
          <img :src="h.img" alt="" class="rounded-circle object-cover" />
        </div>
        <div class="small text-muted">{{ h.name }}</div>
      </div>
    </div>

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

        <!-- 카드 그리드 -->
        <div class="row g-3">
          <div v-for="post in filteredPosts" :key="post.id" class="col-md-6">
            <div class="card h-100 shadow-sm border-0">
              <div class="ratio ratio-4x3">
                <img
                  :src="
                    post.img || 'https://picsum.photos/seed/default/600/400'
                  "
                  class="card-img-top object-cover"
                  alt="게시물 이미지"
                />
              </div>
              <div class="card-body">
                <div class="small text-muted mb-1">{{ post.subtitle }}</div>
                <h6 class="card-title mb-1">{{ post.title }}</h6>
                <p class="card-text text-muted small mb-0">{{ post.desc }}</p>
              </div>
              <div
                class="card-footer bg-white d-flex justify-content-between align-items-center"
              >
                <span class="small text-muted">{{ post.time }}</span>
                <button class="btn btn-sm btn-outline-secondary">
                  ♥ {{ post.likes }}
                </button>
              </div>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  </div>
</template>

<script setup>
import ReviewDisplayBox from "@/components/reviewDisplayBox.vue";
import { computed, reactive, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import axios from "axios";
import PetProfileModal from "@/components/PetProfileModal";
import postApi from "@/apis/postApi";

const store = useStore();
const route = useRoute();
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

// ✅ 펫 이미지 + pet_desc 로드
async function loadPetProfile() {
  try {
    const userId = routeUserId.value || store.state.user.userId;
    const resPets = await axios.get("/pet/find-allpetbyuser", {
      params: { petUserId: userId },
    });
    const pets = resPets.data;

    if (pets.length > 0) {
      const firstPet = pets[0];
      profile.bio = firstPet.petDesc || "아직 반려견 소개가 없습니다.";
      if (firstPet.petId) {
        const resImg = await axios.get(`/pet/image/${firstPet.petId}`, {
          responseType: "blob",
        });
        profileImgUrl.value = URL.createObjectURL(resImg.data);
      }
    } else {
      profile.bio = "등록된 반려견이 없습니다.";
    }
  } catch (e) {
    console.error("펫 프로필 불러오기 실패:", e);
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

onMounted(async () => {
  if (!store.getters.isLogin) await store.dispatch("loadAuthFromStorage");
  await loadPetProfile();
  await loadUserPosts(); // ✅ 게시물도 로드
});

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
function openPetModal(pet) {
  selectedPet.value = pet;
  showModal.value = true;
}
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
</script>

<style scoped>
.object-cover {
  object-fit: cover;
}
.story-ring {
  width: 64px;
  height: 64px;
  padding: 3px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6ea8, #f7b2d9, #fcd5e8);
  display: grid;
  place-items: center;
}
.story-ring img {
  width: 100%;
  height: 100%;
}
</style>
